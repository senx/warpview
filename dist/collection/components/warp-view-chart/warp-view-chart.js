import { GTSLib } from '../../utils/gts.lib';
import Dygraph from 'dygraphs';
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Param } from "../../model/param";
import moment from "moment-timezone";
import deepEqual from "deep-equal";
import { ChartBounds } from "../../model/chartBounds";
import DefaultHandler from 'dygraphs/src/datahandler/default';
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
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.visibility = [];
        this.rawData = [];
        this.executionErrorText = "";
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.dataHashset = {};
        this.dygraphdataSets = [];
        this.dygraphLabels = [];
        this.dygraphColors = [];
        this.initialResizeNeeded = false;
        this.chartBounds = new ChartBounds();
        this.previousParentHeight = -1;
        this.previousParentWidth = -1;
        this.visibilityStatus = 'unknown';
        this.heightWithPlottableData = -1;
    }
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            let parentWidth = this.el.parentElement.getBoundingClientRect().width;
            let parentHeight = this.el.parentElement.getBoundingClientRect().height;
            if (this.initialResizeNeeded || parentWidth !== this.previousParentWidth || parentHeight !== this.previousParentHeight) {
                this.initialResizeNeeded = false;
                if (this.standalone || this.displayGraph()) {
                    let width = parentWidth - 5;
                    if (this.visibilityStatus === 'plottablesAllHidden') {
                        parentHeight = this.heightWithPlottableData;
                        this.visibilityStatus = 'plottableShown';
                        this.resizeMyParent.emit({ h: parentHeight, w: parentWidth });
                    }
                    let height = parentHeight - 20;
                    if (this._chart) {
                        this.LOG.debug(['onResize', 'destroy'], width, height);
                        this._chart.resize(width, height);
                    }
                }
                else {
                    if (this.visibilityStatus === 'plottableShown') {
                        this.visibilityStatus = 'plottablesAllHidden';
                        this.heightWithPlottableData = parentHeight;
                    }
                    let height = 30;
                    let width = parentWidth;
                    if (this._chart) {
                        this.LOG.debug(['onResize', 'destroy'], width, height);
                        this._chart.resize(width, height);
                    }
                    parentHeight = height + 20;
                    this.resizeMyParent.emit({ h: parentHeight, w: width });
                }
            }
            this.previousParentHeight = parentHeight;
            this.previousParentWidth = parentWidth;
        }, 150);
    }
    onHideData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['hiddenData'], newValue);
            let previousVisibility = JSON.stringify(this.visibility);
            if (!!this._chart) {
                this.visibility = [];
                this.visibleGtsId.forEach(id => {
                    this.visibility.push(newValue.indexOf(id) < 0 && (id != -1));
                });
                this.LOG.debug(['hiddendygraphfullv'], this.visibility);
            }
            let newVisibility = JSON.stringify(this.visibility);
            if (previousVisibility !== newVisibility) {
                this.drawChart(false, true);
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
            }
        }
    }
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['data'], newValue);
            this.visibilityStatus = 'unknown';
            this.drawChart(true);
            this.LOG.debug(['dataupdate', 'destroy'], 'redraw by data change');
        }
    }
    onOptions(newValue) {
        let optionChanged = false;
        Object.keys(newValue).forEach(opt => {
            if (this._options.hasOwnProperty(opt)) {
                optionChanged = optionChanged || !deepEqual(newValue[opt] !== this._options[opt]);
            }
            else {
                optionChanged = true;
            }
        });
        this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
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
            this.LOG.debug(['getTimeClip'], this.chartBounds);
            resolve(this.chartBounds);
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
        const divider = GTSLib.getDivider(this._options.timeUnit);
        this.rawData = [];
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
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            const nonPlottable = gtsList.filter(g => {
                return (g.v && !GTSLib.isGtsToPlot(g));
            });
            gtsList = gtsList.filter(g => {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
            gtsList.forEach((g, i) => {
                labels.push(GTSLib.serializeGtsMetadata(g) + g.id);
                const series = [];
                g.v.forEach(value => {
                    const ts = value[0];
                    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                        series.push([parseInt(ts), value[value.length - 1]]);
                    }
                    else {
                        series.push([moment(Math.floor(parseInt(ts) / divider)).utc(true).valueOf(), value[value.length - 1]]);
                    }
                    if (!this.dataHashset[ts]) {
                        this.dataHashset[ts] = [];
                    }
                    this.dataHashset[ts][i] = value[value.length - 1];
                    if (ts < this.minTick) {
                        this.minTick = ts;
                    }
                    if (ts > this.maxTick) {
                        this.maxTick = ts;
                    }
                });
                this.LOG.debug(['gtsToData', 'series'], series);
                this.rawData.push(series);
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
                        this.dataHashset[this.minTick] = [];
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = [];
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
        this.executionErrorText = "";
        this.dygraphdataSets = [];
        const divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['chart', 'divider', 'timeunit'], divider, this._options.timeUnit);
        this.LOG.debug(['chart', 'this.dataHashset'], this.dataHashset);
        Object.keys(this.dataHashset).forEach(timestamp => {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.dygraphdataSets.push([parseInt(timestamp)].concat(this.dataHashset[timestamp]));
            }
            else {
                const ts = Math.floor(parseInt(timestamp) / divider);
                this.dygraphdataSets.push([moment(ts).utc(true).toDate()].concat(this.dataHashset[timestamp]));
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
        let serializedGTS = data.split('}')[0].split('{');
        let display = '';
        if (serializedGTS.length == 2) {
            display = `<span class='gts-classname'>${serializedGTS[0]}</span>`;
            display += `<span class='gts-separator'> {</span>`;
            const labels = serializedGTS[1].split(',');
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
        return display;
    }
    zoomCallback(minDate, maxDate, yRanges) {
        this.LOG.debug(['zoomCallback'], { minDate: minDate, maxDate: maxDate, yRanges: yRanges });
        this.zoom.emit({ minDate: minDate, maxDate: maxDate, yRanges: yRanges });
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
            html = `<b>${(moment.utc(parseInt(data.x)).toISOString() || '').replace('Z', this._options.timeZone == 'UTC' ? 'Z' : '')}</b>`;
        }
        data.series.sort((sa, sb) => (sa.isHighlighted && !sb.isHighlighted) ? -1 : 1).filter(s => s.isVisible && s.yHTML).slice(0, 50).forEach(function (series) {
            let labeledData = WarpViewChart.formatLabel(series.label) + ': ' + WarpViewChart.toFixed(parseFloat(series.yHTML));
            if (series.isHighlighted) {
                labeledData = `<b>${labeledData}</b>`;
            }
            html += `<br>${series.dashHTML} ${labeledData}`;
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
        let cmin = 0;
        let cmax = 0;
        let divider = GTSLib.getDivider(this._options.timeUnit);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            if (dygraph.dateWindow_) {
                this.chartBounds.tsmin = Math.round(dygraph.dateWindow_[0]);
                this.chartBounds.tsmax = Math.round(dygraph.dateWindow_[1]);
            }
            else {
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
            }
            cmin = this.chartBounds.tsmin;
            cmax = this.chartBounds.tsmax;
        }
        else {
            if (dygraph.dateWindow_) {
                cmin = dygraph.dateWindow_[0];
                cmax = dygraph.dateWindow_[1];
                let zoneOffset = moment.tz.zone(this._options.timeZone).utcOffset(cmin) * 60000;
                this.chartBounds.tsmin = Math.floor((cmin + zoneOffset) * divider);
                this.chartBounds.tsmax = Math.ceil((cmax + zoneOffset) * divider);
            }
            else {
                cmin = moment(this.minTick / divider).utc(true).valueOf();
                cmax = moment(this.maxTick / divider).utc(true).valueOf();
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
            }
        }
        this.chartBounds.msmin = this.chartBounds.tsmin / divider;
        this.chartBounds.msmax = this.chartBounds.tsmax / divider;
        this.LOG.debug(['drawCallback', 'newBounds', 'platform unit'], this.chartBounds.tsmin, this.chartBounds.tsmax);
        this.LOG.debug(['drawCallback', 'newBounds', 'for annotations'], cmin, cmax);
        this.boundsDidChange.emit({
            bounds: {
                min: cmin,
                max: cmax
            }
        });
        this.chartDraw.emit();
        if (this.initialResizeNeeded) {
            this.onResize();
        }
    }
    drawChart(reparseNewData = false, forceresize = false) {
        this.LOG.debug(['drawChart', 'this.data'], this.data);
        let previousTimeMode = this._options.timeMode || '';
        let previousTimeUnit = this._options.timeUnit || '';
        let previousTimeZone = this._options.timeZone || 'UTC';
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['tz'], this._options.timeZone);
        moment.tz.setDefault(this._options.timeZone);
        let data = GTSLib.getData(this.data);
        this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
        if (this._options.bounds) {
            data.bounds = {
                xmin: Math.floor(this._options.bounds.minDate),
                xmax: Math.ceil(this._options.bounds.maxDate),
                ymin: this._options.bounds.yRanges && this._options.bounds.yRanges.length > 0
                    ? Math.floor(this._options.bounds.yRanges[0])
                    : undefined,
                ymax: this._options.bounds.yRanges && this._options.bounds.yRanges.length > 1
                    ? Math.ceil(this._options.bounds.yRanges[1])
                    : undefined
            };
        }
        this.LOG.debug(['drawChart', "data"], data);
        let dataList = data.data;
        this._options = ChartLib.mergeDeep(this._options, data.globalParams);
        this.gtsToData(dataList);
        const chart = this.el.querySelector('#' + this.uuid);
        this.LOG.debug(['drawChart', 'this.dygraphdataSets'], this.dygraphdataSets);
        this.LOG.debug(['drawChart', 'this.rawData'], this.rawData);
        const me = this;
        Dygraph.prototype['parseArray_'] = function () {
            console.log('dygraphs', 'this.optionsViewForAxis_', this.optionsViewForAxis_('x')('ticker'));
            if (me.rawData.length === 0) {
                console.error("Can't plot empty data set");
                return null;
            }
            if (me.rawData[0].length === 0) {
                console.error("Data set cannot contain an empty row");
                return null;
            }
            let i;
            if (this.attr_("labels") === null) {
                console.warn("Using default labels. Set labels explicitly via 'labels' " +
                    "in the options parameter");
                this.attrs_.labels = ["X"];
                for (i = 1; i < me.rawData[0].length; i++) {
                    this.attrs_.labels.push("Y" + i);
                }
                this.attributes_.reparseSeries();
            }
            else {
                const num_labels = this.attr_("labels");
                console.log('num_labels', num_labels, me.rawData.length);
            }
            if (me._options.timeMode && me._options.timeMode === 'timestamp') {
                this.attrs_.axes.x.valueFormatter = this.dateValueFormatter;
                this.attrs_.axes.x.ticker = this.dateTicker;
                this.attrs_.axes.x.axisLabelFormatter = this.dateAxisLabelFormatter;
            }
            else {
                this.attrs_.axes.x.valueFormatter = x => x;
                this.attrs_.axes.x.ticker = this.numericTicks;
                this.attrs_.axes.x.axisLabelFormatter = this.numberAxisLabelFormatter;
            }
            return me.rawData;
        };
        if (!!this.rawData) {
            const color = this._options.gridLineColor;
            let interactionModel = Dygraph.defaultInteractionModel;
            interactionModel.mousewheel = this.scroll.bind(this);
            interactionModel.mouseout = this.handleMouseOut.bind(this);
            const customDataHandler = function () {
            };
            customDataHandler.prototype = new DefaultHandler();
            customDataHandler.prototype.extractSeries = (rawData, seriesIndex, options) => {
                this.LOG.debug(['drawChart', 'dataHandler', 'extractSeries'], seriesIndex);
                const series = [];
                const logScale = options.get('logscale');
                this.rawData[seriesIndex - 1].forEach(v => {
                    this.LOG.debug(['drawChart', 'dataHandler', 'extractSeries'], v);
                    const x = v[0];
                    let point = v[1];
                    if (logScale) {
                        if (point <= 0) {
                            point = null;
                        }
                    }
                    series.push([x, point]);
                });
                this.LOG.debug(['drawChart', 'dataHandler', 'extractSeries'], series);
                return series;
            };
            customDataHandler.prototype.seriesToPoints = (series, setName, boundaryIdStart) => {
                this.LOG.debug(['drawChart', 'dataHandler', 'seriesToPoints'], series);
                const points = [];
                series.forEach((s, i) => {
                    points.push({
                        x: NaN,
                        y: NaN,
                        xval: s[0],
                        yval: s[1],
                        name: setName,
                        idx: i + boundaryIdStart
                    });
                });
                return points;
            };
            let options = {
                height: this.displayGraph() ? (this.responsive ? this.el.parentElement.getBoundingClientRect().height : WarpViewChart.DEFAULT_HEIGHT) - 30 : 30,
                width: (this.responsive ? this.el.parentElement.getBoundingClientRect().width : WarpViewChart.DEFAULT_WIDTH) - 5,
                labels: this.dygraphLabels,
                showRoller: false,
                showRangeSelector: false,
                showInRangeSelector: true,
                connectSeparatedPoints: true,
                colors: this.dygraphColors,
                legend: 'follow',
                dataHandler: customDataHandler,
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
                zoomCallback: this.zoomCallback.bind(this),
                axisLabelWidth: this.standalone ? 50 : 94,
                rightGap: this.standalone ? 0 : 20,
                interactionModel: interactionModel
            };
            if (!this.displayGraph()) {
                options.xAxisHeight = 30;
                options.rangeSelectorHeight = 30;
                chart.style.height = '30px';
            }
            if (!!data.bounds) {
                options.dateWindow = [data.bounds.xmin, data.bounds.xmax];
                options.valueRange = [data.bounds.ymin, data.bounds.ymax];
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
        ChartLib.resizeWatchTimer(this.el, this.onResize.bind(this));
    }
    render() {
        return h("div", { id: "chartContainer" },
            this.executionErrorText !== "" ? h("div", { class: "executionErrorText" }, this.executionErrorText) : "",
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
        "executionErrorText": {
            "state": true
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
        }, {
            "name": "resizeMyParent",
            "method": "resizeMyParent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "chartDraw",
            "method": "chartDraw",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "zoom",
            "method": "zoom",
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
