import { GTSLib } from '../../utils/gts.lib';
import Dygraph from 'dygraphs';
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Param } from "../../model/param";
import moment from "moment";
export class WarpViewChart {
    constructor() {
        this.options = new Param();
        this.hiddenData = [];
        this.unit = '';
        this.type = 'line';
        this.responsive = false;
        this.standalone = true;
        this.debug = false;
        this._options = {
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.visibility = [];
        this.parentWidth = -1;
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.dataHashset = {};
        this.dygraphdataSets = [];
        this.dygraphLabels = [];
        this.dygraphColors = [];
        this.initialResizeNeeded = false;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth || this.initialResizeNeeded || this.parentWidth <= 0) {
            this.parentWidth = this.el.parentElement.clientWidth;
            this.initialResizeNeeded = false;
            if (this._chart) {
                if (!this.initialHeight) {
                    this.initialHeight = this.el.parentElement.clientHeight;
                }
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => {
                    if (this.parentWidth > 0) {
                        this.LOG.debug(['onResize', 'destroy'], this.el.parentElement.clientWidth);
                        const height = (this.responsive ? this.initialHeight : WarpViewChart.DEFAULT_HEIGHT) - 30;
                        const width = (this.responsive ? this.el.parentElement.clientWidth : WarpViewChart.DEFAULT_WIDTH) - 5;
                        this._chart.resize(width, this.displayGraph() ? height : 30);
                        this.warpViewChartResize.emit({ w: width, h: this.displayGraph() ? height : 30 });
                    }
                    else {
                        this.onResize();
                    }
                }, 150);
            }
        }
    }
    onHideData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.parentWidth = 0;
            this.LOG.debug(['hiddenData'], newValue);
            let previousVisibility = JSON.stringify(this.visibility);
            let previouslyAllHidden = !this.displayGraph();
            if (!!this._chart) {
                this.visibility = [];
                this.visibleGtsId.forEach(id => {
                    this.visibility.push(newValue.indexOf(id) < 0 && (id != -1));
                });
                this.LOG.debug(['hiddendygraphfullv'], this.visibility);
            }
            let newVisibility = JSON.stringify(this.visibility);
            if (previousVisibility !== newVisibility) {
                this.drawChart(false, previouslyAllHidden && this.displayGraph());
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
            }
        }
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart(true);
            this.LOG.debug(['dataupdate', 'destroy'], 'redraw by data change');
        }
    }
    onOptions(newValue) {
        let optionChanged = false;
        Object.keys(newValue).forEach(opt => {
            if (this._options.hasOwnProperty(opt)) {
                optionChanged = optionChanged || (newValue[opt] !== (this._options[opt]));
            }
            else {
                optionChanged = true;
            }
        });
        this.LOG.debug(['optionsupdateOPTIONCHANGED'], optionChanged);
        if (optionChanged) {
            this.LOG.debug(['options'], newValue);
            this.drawChart(false, true);
        }
    }
    onTypeChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['typeupdate', 'destroy'], 'redraw by type change');
            this.drawChart();
        }
    }
    onUnitChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['unitupdate', 'destroy'], 'redraw by unit change (full redraw)');
            this.drawChart(true);
        }
    }
    async getTimeClip() {
        return new Promise(resolve => {
            this.LOG.debug(['getTimeClip'], this._chart.xAxisRange());
            resolve(this._chart.xAxisRange());
        });
    }
    handleMouseOut(evt) {
        this.LOG.debug(['handleMouseOut'], evt);
        const legend = this.el.querySelector('.dygraph-legend');
        window.setTimeout(() => {
            legend.style.display = 'none';
        }, 1000);
    }
    gtsToData(gtsList) {
        this.LOG.debug(['gtsToData'], gtsList);
        this.visibility = [];
        this.dataHashset = {};
        let labels = [];
        let colors = [];
        if (!gtsList) {
            return;
        }
        else {
            gtsList = GTSLib.flattenGtsIdArray(gtsList, 0).res;
            gtsList = GTSLib.flatDeep(gtsList);
            this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
            labels.push('Date');
            this.maxTick = Number.MIN_VALUE;
            this.minTick = Number.MAX_VALUE;
            this.visibleGtsId = [];
            const nonPlottable = gtsList.filter(g => {
                return (g.v && !GTSLib.isGtsToPlot(g));
            });
            gtsList = gtsList.filter(g => {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            gtsList.forEach((g, i) => {
                labels.push(GTSLib.serializeGtsMetadata(g) + g.id);
                g.v.forEach(value => {
                    const ts = value[0];
                    if (!this.dataHashset[ts]) {
                        this.dataHashset[ts] = new Array(gtsList.length);
                        this.dataHashset[ts].fill(null);
                    }
                    this.dataHashset[ts][i] = value[value.length - 1];
                    if (ts < this.minTick) {
                        this.minTick = ts;
                    }
                    if (ts > this.maxTick) {
                        this.maxTick = ts;
                    }
                });
                this.LOG.debug(['gtsToData', 'gts'], g);
                colors.push(ColorLib.getColor(g.id));
                this.visibility.push(true);
                this.visibleGtsId.push(g.id);
            });
            this.LOG.debug(['gtsToData', 'nonPlottable'], nonPlottable);
            if (nonPlottable.length > 0) {
                nonPlottable.forEach(g => {
                    g.v.forEach(value => {
                        const ts = value[0];
                        if (ts < this.minTick) {
                            this.minTick = ts;
                        }
                        if (ts > this.maxTick) {
                            this.maxTick = ts;
                        }
                    });
                });
                if (0 == gtsList.length) {
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = [0];
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = [0];
                    }
                    labels.push('emptySeries');
                    colors.push(ColorLib.getColor(0));
                    this.visibility.push(false);
                    this.visibleGtsId.push(-1);
                }
                else {
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = new Array(gtsList.length);
                        this.dataHashset[this.minTick].fill(null);
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = new Array(gtsList.length);
                        this.dataHashset[this.maxTick].fill(null);
                    }
                }
            }
        }
        this.rebuildDygraphDataSets();
        this.LOG.debug(['dygraphgtsidtable'], this.visibleGtsId);
        this.LOG.debug(['gtsToData', 'datasets'], this.dygraphdataSets, labels, colors);
        this.dygraphColors = colors;
        this.dygraphLabels = labels;
    }
    rebuildDygraphDataSets() {
        this.dygraphdataSets = [];
        const divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['chart', 'divider', 'timeunit'], divider, this._options.timeUnit);
        Object.keys(this.dataHashset).forEach(timestamp => {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.dygraphdataSets.push([parseInt(timestamp)].concat(this.dataHashset[timestamp]));
            }
            else {
                const ts = Math.floor(parseInt(timestamp) / divider);
                this.dygraphdataSets.push([moment.utc(ts).toDate()].concat(this.dataHashset[timestamp]));
            }
        });
        this.dygraphdataSets.sort((a, b) => a[0] - b[0]);
    }
    isStepped() {
        return this.type === 'step';
    }
    isStacked() {
        return this.type === 'area';
    }
    static toFixed(x) {
        let e;
        let res = '';
        if (Number.isSafeInteger(x)) {
            return x.toString();
        }
        else {
            res = x.toString();
            e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                res = x.toString();
                res += (new Array(e + 1)).join('0');
            }
            return res;
        }
    }
    static formatLabel(data) {
        const serializedGTS = data.split('{');
        let display = `<span class='gts-classname'>${serializedGTS[0]}</span>`;
        if (serializedGTS.length > 1) {
            display += `<span class='gts-separator'>{</span>`;
            const labels = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
            if (labels.length > 0) {
                labels.forEach((l, i) => {
                    const label = l.split('=');
                    if (l.length > 1) {
                        display += `<span><span class='gts-labelname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>${label[1]}</span>`;
                        if (i !== labels.length - 1) {
                            display += `<span>, </span>`;
                        }
                    }
                });
            }
            display += `<span class='gts-separator'>}</span>`;
        }
        if (serializedGTS.length > 2) {
            display += `<span class='gts-separator'>{</span>`;
            const labels = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
            if (labels.length > 0) {
                labels.forEach((l, i) => {
                    const label = l.split('=');
                    if (l.length > 1) {
                        display += `<span><span class='gts-attrname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>${label[1]}</span>`;
                        if (i !== labels.length - 1) {
                            display += `<span>, </span>`;
                        }
                    }
                });
            }
            display += `<span class='gts-separator'>}</span>`;
        }
        return display;
    }
    legendFormatter(data) {
        if (data.x === null) {
            return '<br>' + data.series.map(function (series) {
                if (!series.isVisible)
                    return;
                let labeledData = WarpViewChart.formatLabel(series.labelHTML) + ': ' + WarpViewChart.toFixed(parseFloat(series.yHTML));
                if (series.isHighlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                return WarpViewChart.formatLabel(series.labelHTML) + ' ' + labeledData;
            }).join('<br>');
        }
        let html = '';
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            html = `<b>${data.x}</b>`;
        }
        else {
            html = `<b>${moment.utc(parseInt(data.x)).toISOString()}</b>`;
        }
        data.series.forEach(function (series) {
            if (series.isVisible && series.yHTML) {
                let labeledData = WarpViewChart.formatLabel(series.labelHTML) + ': ' + WarpViewChart.toFixed(parseFloat(series.yHTML));
                if (series.isHighlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                html += `<br>${series.dashHTML} ${labeledData}`;
            }
        });
        return html;
    }
    highlightCallback(event) {
        const legend = this.el.querySelector('.dygraph-legend');
        legend.style.display = 'block';
        this.pointHover.emit({
            x: event.offsetX,
            y: event.offsetY
        });
    }
    scroll(event, g) {
        if (!event.altKey)
            return;
        this.LOG.debug(['scroll'], g);
        const normal = event.detail ? event.detail * -1 : event.wheelDelta / 40;
        const percentage = normal / 50;
        if (!(event.offsetX && event.offsetY)) {
            event.offsetX = event.layerX - event.target.offsetLeft;
            event.offsetY = event.layerY - event.target.offsetTop;
        }
        const percentages = WarpViewChart.offsetToPercentage(g, event.offsetX, event.offsetY);
        const xPct = percentages[0];
        const yPct = percentages[1];
        WarpViewChart.zoom(g, percentage, xPct, yPct);
        event.preventDefault();
    }
    static offsetToPercentage(g, offsetX, offsetY) {
        const xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
        const yar0 = g.yAxisRange(0);
        const yOffset = g.toDomCoords(null, yar0[1])[1];
        const x = offsetX - xOffset;
        const y = offsetY - yOffset;
        const w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;
        const h = g.toDomCoords(null, yar0[0])[1] - yOffset;
        const xPct = w === 0 ? 0 : (x / w);
        const yPct = h === 0 ? 0 : (y / h);
        return [xPct, (1 - yPct)];
    }
    static adjustAxis(axis, zoomInPercentage, bias) {
        const delta = axis[1] - axis[0];
        const increment = delta * zoomInPercentage;
        const foo = [increment * bias, increment * (1 - bias)];
        return [axis[0] + foo[0], axis[1] - foo[1]];
    }
    static zoom(g, zoomInPercentage, xBias, yBias) {
        xBias = xBias || 0.5;
        yBias = yBias || 0.5;
        const yAxes = g.yAxisRanges();
        const newYAxes = [];
        for (let i = 0; i < yAxes.length; i++) {
            newYAxes[i] = WarpViewChart.adjustAxis(yAxes[i], zoomInPercentage, yBias);
        }
        g.updateOptions({
            dateWindow: WarpViewChart.adjustAxis(g.xAxisRange(), zoomInPercentage, xBias),
            valueRange: newYAxes[0]
        });
    }
    drawCallback(dygraph, is_initial) {
        this.LOG.debug(['drawCallback', 'destroy'], [dygraph.dateWindow_, is_initial]);
        this._chart = dygraph;
        if (dygraph.dateWindow_) {
            this.boundsDidChange.emit({
                bounds: {
                    min: dygraph.dateWindow_[0],
                    max: dygraph.dateWindow_[1]
                }
            });
            this.LOG.debug(['drawCallback', 'newBoundsBasedOnDateWindow'], [dygraph.dateWindow_[0], dygraph.dateWindow_[1]]);
        }
        else {
            let divider = GTSLib.getDivider(this._options.timeUnit);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                divider = 1;
            }
            this.boundsDidChange.emit({
                bounds: {
                    min: this.minTick / divider,
                    max: this.maxTick / divider
                }
            });
            this.LOG.debug(['drawCallback', 'newBoundsBasedOnMinMaxTicks'], [this.minTick, this.maxTick]);
        }
        if (this.initialResizeNeeded) {
            this.onResize();
        }
    }
    drawChart(reparseNewData = false, forceresize = false) {
        this.LOG.debug(['drawChart', 'this.data'], [this.data]);
        let previousTimeMode = this._options.timeMode || '';
        let previousTimeUnit = this._options.timeUnit || '';
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let data = GTSLib.getData(this.data);
        let dataList = data.data;
        this._options = ChartLib.mergeDeep(this._options, data.globalParams);
        if (reparseNewData) {
            this.gtsToData(dataList);
        }
        else {
            if (previousTimeMode !== this._options.timeMode || previousTimeUnit !== this._options.timeUnit) {
                this.rebuildDygraphDataSets();
            }
        }
        const chart = this.el.querySelector('#' + this.uuid);
        if (this.dygraphdataSets) {
            const color = this._options.gridLineColor;
            let interactionModel = Dygraph.defaultInteractionModel;
            interactionModel.mousewheel = this.scroll.bind(this);
            interactionModel.mouseout = this.handleMouseOut.bind(this);
            let options = {
                height: this.displayGraph() ? (this.responsive ? this.el.parentElement.clientHeight : WarpViewChart.DEFAULT_HEIGHT) - 30 : 30,
                width: (this.responsive ? this.el.parentElement.clientWidth : WarpViewChart.DEFAULT_WIDTH) - 5,
                labels: this.dygraphLabels,
                showRoller: false,
                showRangeSelector: this.dygraphdataSets && this.dygraphdataSets.length > 0 && this._options.showRangeSelector,
                showInRangeSelector: true,
                connectSeparatedPoints: true,
                colors: this.dygraphColors,
                legend: 'follow',
                stackedGraph: this.isStacked(),
                strokeBorderWidth: this.isStacked() ? null : 0,
                strokeWidth: 2,
                stepPlot: this.isStepped(),
                ylabel: this.unit,
                labelsSeparateLines: true,
                highlightSeriesBackgroundAlpha: 1,
                highlightSeriesOpts: {
                    strokeWidth: 3,
                    strokeBorderWidth: 0,
                    highlightCircleSize: 3,
                    showInRangeSelector: true
                },
                visibility: this.visibility,
                labelsUTC: true,
                gridLineColor: color,
                axisLineColor: color,
                fillAlpha: 0.5,
                drawGapEdgePoints: this._options.showDots,
                drawPoints: this._options.showDots,
                pointSize: 3,
                digitsAfterDecimal: 5,
                axes: {
                    x: {
                        drawAxis: this.displayGraph(),
                    }
                },
                legendFormatter: this.legendFormatter.bind(this),
                highlightCallback: this.highlightCallback.bind(this),
                drawCallback: this.drawCallback.bind(this),
                axisLabelWidth: this.standalone ? 50 : 94,
                rightGap: this.standalone ? 0 : 20,
                interactionModel: interactionModel
            };
            if (!this.displayGraph()) {
                options.xAxisHeight = 30;
                options.rangeSelectorHeight = 30;
                chart.style.height = '30px';
            }
            if (this._options.timeMode === 'timestamp') {
                options.axes.x.axisLabelFormatter = (x) => {
                    return WarpViewChart.toFixed(x);
                };
            }
            this.initialResizeNeeded = reparseNewData || forceresize;
            if (!!this._chart) {
                this._chart.destroy();
                this.LOG.debug(['drawChart', 'dygraphdestroyed'], 'dygraph destroyed to reborn with reparseNewData=', reparseNewData, 'and forceresize=', forceresize);
            }
            this.LOG.debug(['drawChart', 'dygraphdataSets'], this.dygraphdataSets);
            if (this.dygraphdataSets && this.dygraphdataSets.length > 0) {
                this._chart = new Dygraph(chart, this.dygraphdataSets, options);
            }
        }
    }
    displayGraph() {
        let status = false;
        this.visibility.forEach(s => {
            status = s || status;
        });
        return status;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewChart, this.debug);
    }
    componentDidLoad() {
        this.drawChart(true);
    }
    render() {
        return h("div", null,
            h("div", { id: this.uuid, class: "chart" }));
    }
    static get is() { return "warp-view-chart"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "el": {
            "elementRef": true
        },
        "getTimeClip": {
            "method": true
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "standalone": {
            "type": Boolean,
            "attr": "standalone"
        },
        "type": {
            "type": String,
            "attr": "type",
            "watchCallbacks": ["onTypeChange"]
        },
        "unit": {
            "type": String,
            "attr": "unit",
            "watchCallbacks": ["onUnitChange"]
        }
    }; }
    static get events() { return [{
            "name": "boundsDidChange",
            "method": "boundsDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpViewChartResize",
            "method": "warpViewChartResize",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-chart:**/"; }
}
WarpViewChart.DEFAULT_WIDTH = 800;
WarpViewChart.DEFAULT_HEIGHT = 500;
