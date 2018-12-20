/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
import { GTSLib } from '../../utils/gts.lib';
import Dygraph from 'dygraphs';
import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Param } from "../../model/param";
import moment from "moment";
/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  timeMode.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export class WarpViewChart {
    constructor() {
        this.options = new Param();
        this.hiddenData = [];
        this.unit = '';
        this.type = 'line';
        this.responsive = false;
        this.standalone = true;
        this.LOG = new Logger(WarpViewChart);
        this._options = {
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.ticks = [];
        this.visibility = [];
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            if (this._chart) {
                if (!this.initialHeight) {
                    this.initialHeight = this.el.parentElement.clientHeight;
                }
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => {
                    this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                    const height = (this.responsive ? this.initialHeight : WarpViewChart.DEFAULT_HEIGHT) - 30;
                    const width = (this.responsive ? this.el.parentElement.clientWidth : WarpViewChart.DEFAULT_WIDTH) - 5;
                    this._chart.resize(width, this.displayGraph() ? height : 30);
                    this.warpViewChartResize.emit({ w: width, h: this.displayGraph() ? height : 30 });
                }, 250);
            }
        }
    }
    onHideData(newValue, oldValue) {
        if (oldValue.length !== newValue.length) {
            this.parentWidth = 0;
            this.LOG.debug(['hiddenData'], newValue);
            this.drawChart();
        }
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
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
        this.ticks = [];
        this.visibility = [];
        const datasets = [];
        const data = {};
        let labels = [];
        let colors = [];
        if (!gtsList) {
            return;
        }
        else {
            gtsList = GTSLib.flattenGtsIdArray(gtsList, 0).res;
            gtsList = GTSLib.flatDeep(gtsList);
            this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
            labels = new Array(gtsList.length);
            labels.push('Date');
            colors = [];
            gtsList = gtsList.filter(g => {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            gtsList.forEach((g, i) => {
                let label = GTSLib.serializeGtsMetadata(g);
                GTSLib.gtsSort(g);
                g.v.forEach(value => {
                    const ts = value[0];
                    if (!data[ts]) {
                        data[ts] = new Array(gtsList.length);
                        data[ts].fill(null);
                    }
                    data[ts][i] = value[value.length - 1];
                });
                let color = ColorLib.getColor(g.id);
                labels.push(label);
                colors.push(color);
                this.visibility.push(this.hiddenData.filter((h) => h === g.id).length === 0);
            });
        }
        this.LOG.debug(['gtsToData', 'this.visibility'], this.visibility);
        labels = labels.filter((i) => !!i);
        Object.keys(data).forEach(timestamp => {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                datasets.push([parseInt(timestamp)].concat(data[timestamp].slice(0, labels.length - 1)));
                this.ticks.push(parseInt(timestamp));
            }
            else {
                const ts = Math.floor(parseInt(timestamp) / GTSLib.getDivider(this._options.timeUnit));
                datasets.push([moment.utc(ts).toDate()].concat(data[timestamp].slice(0, labels.length - 1)));
                this.ticks.push(ts);
            }
        });
        datasets.sort((a, b) => a[0] > b[0] ? 1 : -1);
        this.LOG.debug(['gtsToData', 'datasets'], [datasets, labels, colors]);
        return { datasets: datasets, labels: labels, colors: colors.slice(0, labels.length) };
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
        if (Math.abs(x) < 1.0) {
            e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10, e - 1);
                res = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
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
        }
        return res;
    }
    /**
     *
     * @param {string} data
     * @returns {string}
     */
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
            // This happens when there's no selection and {legend: 'always'} is set.
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
        let html = `<b>${data.xHTML}</b>`;
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
        // For me the normalized value shows 0.075 for one click. If I took
        // that verbatim, it would be a 7.5%.
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
        // This is calculating the pixel offset of the leftmost date.
        const xOffset = g.toDomCoords(g.xAxisRange()[0], null)[0];
        const yar0 = g.yAxisRange(0);
        // This is calculating the pixel of the higest value. (Top pixel)
        const yOffset = g.toDomCoords(null, yar0[1])[1];
        // x y w and h are relative to the corner of the drawing area,
        // so that the upper corner of the drawing area is (0, 0).
        const x = offsetX - xOffset;
        const y = offsetY - yOffset;
        // This is computing the rightmost pixel, effectively defining the
        // width.
        const w = g.toDomCoords(g.xAxisRange()[1], null)[0] - xOffset;
        // This is computing the lowest pixel, effectively defining the height.
        const h = g.toDomCoords(null, yar0[0])[1] - yOffset;
        // Percentage from the left.
        const xPct = w === 0 ? 0 : (x / w);
        // Percentage from the top.
        const yPct = h === 0 ? 0 : (y / h);
        // The (1-) part below changes it from "% distance down from the top"
        // to "% distance up from the bottom".
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
        this.LOG.debug(['drawCallback'], [dygraph.dateWindow_, is_initial]);
        if (dygraph.dateWindow_) {
            this.boundsDidChange.emit({
                bounds: {
                    min: dygraph.dateWindow_[0],
                    max: dygraph.dateWindow_[1]
                }
            });
        }
        else {
            this.boundsDidChange.emit({
                bounds: {
                    min: Math.min.apply(null, this.ticks),
                    max: Math.max.apply(null, this.ticks)
                }
            });
        }
    }
    drawChart() {
        this.LOG.debug(['drawChart', 'this.data'], [this.data]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let data = GTSLib.getData(this.data);
        let dataList = data.data;
        this._options = ChartLib.mergeDeep(this._options, data.globalParams);
        const dataToplot = this.gtsToData(dataList);
        this.LOG.debug(['drawChart', 'dataToplot'], dataToplot);
        const chart = this.el.querySelector('#' + this.uuid);
        if (dataToplot) {
            const color = this._options.gridLineColor;
            let interactionModel = Dygraph.defaultInteractionModel;
            interactionModel.mousewheel = this.scroll.bind(this);
            interactionModel.mouseout = this.handleMouseOut.bind(this);
            let options = {
                height: this.displayGraph() ? (this.responsive ? this.el.parentElement.clientHeight : WarpViewChart.DEFAULT_HEIGHT) - 30 : 30,
                width: (this.responsive ? this.el.parentElement.clientWidth : WarpViewChart.DEFAULT_WIDTH) - 5,
                labels: dataToplot.labels,
                showRoller: false,
                showRangeSelector: dataToplot.datasets && dataToplot.datasets.length > 0 && this._options.showRangeSelector,
                showInRangeSelector: true,
                connectSeparatedPoints: true,
                colors: dataToplot.colors,
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
                axes: {
                    x: {
                        drawAxis: this.displayGraph()
                    },
                    y: {
                        axisLabelFormatter: (y) => {
                            return WarpViewChart.toFixed(y);
                        }
                    }
                },
                legendFormatter: this.legendFormatter,
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
            this._chart = new Dygraph(chart, dataToplot.datasets || [], options);
            this.LOG.debug(['options.height'], options.height);
            this.onResize();
        }
    }
    displayGraph() {
        let status = false;
        this.visibility.forEach(s => {
            status = s || status;
        });
        return status;
    }
    componentDidLoad() {
        this.drawChart();
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
        "el": {
            "elementRef": true
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
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
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
WarpViewChart.DEFAULT_HEIGHT = 600;
