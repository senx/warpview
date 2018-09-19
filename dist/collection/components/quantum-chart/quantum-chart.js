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
 *  time.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export class QuantumChart {
    constructor() {
        this.options = new Param();
        this.hiddenData = [];
        this.unit = '';
        this.type = 'line';
        this.responsive = false;
        this.standalone = true;
        this.LOG = new Logger(QuantumChart);
        this._options = {
            time: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.ticks = [];
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
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
            const height = (this.responsive ? this.el.parentElement.clientHeight : QuantumChart.DEFAULT_HEIGHT) - 30;
            const width = (this.responsive ? this.el.parentElement.clientWidth : QuantumChart.DEFAULT_WIDTH) - 5;
            this._chart.resize(width, height);
        }, 250);
    }
    gtsToData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        this.ticks = [];
        const datasets = [];
        const data = {};
        let pos = 0;
        let i = 0;
        let labels = [];
        let colors = [];
        if (!gts) {
            return;
        }
        else {
            const gtsList = GTSLib.flatDeep(gts);
            this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
            labels = new Array(gtsList.length);
            labels[0] = 'Date';
            colors = new Array(gtsList.length);
            gtsList.forEach(g => {
                if (g.v && GTSLib.isGtsToPlot(g)) {
                    let label = GTSLib.serializeGtsMetadata(g);
                    this.LOG.debug(['gtsToData', 'label'], label);
                    if (this.hiddenData.filter((i) => i === label).length === 0) {
                        GTSLib.gtsSort(g);
                        g.v.forEach(value => {
                            if (!data[value[0]]) {
                                data[value[0]] = new Array(gtsList.length);
                                data[value[0]].fill(null);
                            }
                            data[value[0]][i] = value[value.length - 1];
                        });
                        let color = ColorLib.getColor(pos);
                        labels[i + 1] = label;
                        colors[i] = color;
                        i++;
                    }
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
    legendFormatter(data) {
        if (data.x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return '<br>' + data.series.map(function (series) {
                if (!series.isVisible)
                    return;
                let labeledData = series.labelHTML + ': ' + series.yHTML;
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
            let labeledData = series.labelHTML + ': ' + series.yHTML;
            if (series.isHighlighted) {
                labeledData = '<b>' + labeledData + '</b>';
            }
            html += '<br>' + series.dashHTML + ' ' + labeledData;
        });
        return html;
    }
    highlightCallback(event) {
        this.pointHover.emit({
            x: event.x,
            y: event.y
        });
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let dataList = GTSLib.getData(this.data).data;
        const dataToplot = this.gtsToData(dataList);
        this.LOG.debug(['drawChart'], [dataToplot]);
        const chart = this.el.querySelector('#' + this.uuid);
        if (dataToplot && dataToplot.datasets && dataToplot.datasets.length > 0) {
            const color = this._options.gridLineColor;
            this._chart = new Dygraph(chart, dataToplot.datasets, {
                height: (this.responsive ? this.el.parentElement.clientHeight : QuantumChart.DEFAULT_HEIGHT) - 30,
                width: (this.responsive ? this.el.parentElement.clientWidth : QuantumChart.DEFAULT_WIDTH) - 5,
                labels: dataToplot.labels,
                showRoller: false,
                showRangeSelector: this._options.showRangeSelector || true,
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
                hideOverlayOnMouseOut: true,
                labelsUTC: true,
                gridLineColor: color,
                axisLineColor: color,
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
            });
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { id: this.uuid, class: "chart" }));
    }
    static get is() { return "quantum-chart"; }
    static get properties() { return {
        "data": {
            "type": "Any",
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
        }]; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-chart:**/"; }
}
QuantumChart.DEFAULT_WIDTH = 800;
QuantumChart.DEFAULT_HEIGHT = 600;
