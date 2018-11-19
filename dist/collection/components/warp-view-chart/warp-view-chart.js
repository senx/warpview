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
        this.showInRangeSelector = [];
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
    gtsToData(gtsList) {
        this.LOG.debug(['gtsToData'], gtsList);
        this.ticks = [];
        this.visibility = [];
        const datasets = [];
        const data = {};
        let pos = 0;
        let labels = [];
        let colors = [];
        if (!gtsList) {
            return;
        }
        else {
            gtsList = GTSLib.flatDeep(gtsList);
            this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
            labels = new Array(gtsList.length);
            labels[0] = 'Date';
            colors = new Array(gtsList.length);
            gtsList.forEach((g, i) => {
                if (g.v && GTSLib.isGtsToPlot(g)) {
                    let label = GTSLib.serializeGtsMetadata(g);
                    GTSLib.gtsSort(g);
                    g.v.forEach(value => {
                        if (!data[value[0]]) {
                            data[value[0]] = new Array(gtsList.length);
                            data[value[0]].fill(null);
                        }
                        data[value[0]][i] = value[value.length - 1] || -1;
                    });
                    let color = ColorLib.getColor(pos);
                    labels[i + 1] = label;
                    colors[i] = color;
                    this.showInRangeSelector.push(true);
                    this.visibility.push(this.hiddenData.filter((h) => h === label).length === 0);
                }
                pos++;
            });
        }
        labels = labels.filter((i) => !!i);
        Object.keys(data).forEach(timestamp => {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                datasets.push([parseInt(timestamp)].concat(data[timestamp].slice(0, labels.length - 1)));
                this.ticks.push(parseInt(timestamp));
            }
            else {
                const ts = Math.floor(parseInt(timestamp) / 1000);
                datasets.push([moment(ts).utc(true).toDate()].concat(data[timestamp].slice(0, labels.length - 1)));
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
        if (Math.abs(x) < 1.0) {
            e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10, e - 1);
                x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
            }
        }
        else {
            e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                x += (new Array(e + 1)).join('0');
            }
        }
        return x;
    }
    legendFormatter(data) {
        if (data.x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return '<br>' + data.series.map(function (series) {
                if (!series.isVisible)
                    return;
                let labeledData = series.labelHTML + ':<br>' + WarpViewChart.toFixed(series.yHTML);
                if (series.isHighlighted) {
                    labeledData = '<b>' + labeledData + '</b>';
                }
                return series.dashHTML + ' ' + labeledData;
            }).join('<br>');
        }
        let html = data.xHTML;
        data.series.forEach(function (series) {
            if (!series.isVisible || !series.yHTML)
                return;
            let labeledData = series.labelHTML + ':<br>' + WarpViewChart.toFixed(series.yHTML);
            if (series.isHighlighted) {
                labeledData = '<b>' + labeledData + '</b>';
            }
            html += '<br>' + series.dashHTML + ' ' + labeledData;
        });
        return html;
    }
    highlightCallback(event) {
        this.pointHover.emit({
            x: event.offsetX,
            y: event.offsetY
        });
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
            let options = {
                height: this.displayGraph() ? (this.responsive ? this.el.parentElement.clientHeight : WarpViewChart.DEFAULT_HEIGHT) - 30 : 30,
                width: (this.responsive ? this.el.parentElement.clientWidth : WarpViewChart.DEFAULT_WIDTH) - 5,
                labels: dataToplot.labels,
                showRoller: false,
                showRangeSelector: this._options.showRangeSelector || true,
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
                hideOverlayOnMouseOut: true,
                labelsUTC: true,
                gridLineColor: color,
                axisLineColor: color,
                axes: {
                    x: {
                        drawAxis: this.displayGraph()
                    }
                },
                legendFormatter: this.legendFormatter,
                highlightCallback: this.highlightCallback.bind(this),
                drawCallback: ((dygraph, is_initial) => {
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
                }).bind(this),
                axisLabelWidth: this.standalone ? 50 : 94,
                rightGap: this.standalone ? 0 : 20
            };
            if (!this.displayGraph()) {
                options.xAxisHeight = 30;
                options.rangeSelectorHeight = 30;
                chart.style.height = '30px';
            }
            this._chart = new Dygraph(chart, dataToplot.datasets || [], options);
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
