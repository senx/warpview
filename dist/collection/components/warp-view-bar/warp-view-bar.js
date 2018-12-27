import Chart from "chart.js";
import { GTSLib } from "../../utils/gts.lib";
import { ChartLib } from "../../utils/chart-lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
import moment from "moment";
export class WarpViewBar {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewBar);
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this._mapIndex = {};
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                this.drawChart();
            }, 250);
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
    buildGraph() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let gts = this.gtsToData(this.data);
        if (!gts) {
            return;
        }
        const color = this._options.gridLineColor;
        const graphOpts = {
            legend: {
                display: this.showLegend
            },
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'index',
                position: 'nearest'
            },
            scales: {
                xAxes: [{
                        type: "time",
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [
                    {
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        },
                        scaleLabel: {
                            display: this.unit !== '',
                            labelString: this.unit
                        }
                    }
                ]
            },
            responsive: this.responsive
        };
        if (this._options.timeMode === 'timestamp') {
            graphOpts.scales.xAxes[0].time = undefined;
            graphOpts.scales.xAxes[0].type = 'linear';
            graphOpts.scales.xAxes[0].ticks = {
                fontColor: color,
            };
        }
        else {
            graphOpts.scales.xAxes[0].time = {
                displayFormats: {
                    millisecond: 'HH:mm:ss.SSS',
                    second: 'HH:mm:ss',
                    minute: 'HH:mm',
                    hour: 'HH'
                }
            };
            graphOpts.scales.xAxes[0].ticks = {
                fontColor: color
            };
            graphOpts.scales.xAxes[0].type = 'time';
        }
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: gts.ticks,
                datasets: gts.datasets
            },
            options: graphOpts
        });
        this.onResize();
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        if (!this.data)
            return;
        this.buildGraph();
    }
    gtsToData(gts) {
        this.LOG.debug(['gtsToData'], gts);
        let datasets = [];
        let ticks = [];
        let pos = 0;
        let dataList;
        if (typeof gts === 'string') {
            gts = JSON.parse(this.data);
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            dataList = gts;
        }
        if (!dataList || dataList.length === 0) {
            return;
        }
        else {
            dataList = GTSLib.flatDeep(dataList);
            let i = 0;
            let timestampdivider = 1000;
            if (this._options.timeUnit && this._options.timeUnit === 'ms') {
                timestampdivider = 1;
            }
            if (this._options.timeUnit && this._options.timeUnit === 'ns') {
                timestampdivider = 1000000;
            }
            dataList.forEach(g => {
                let data = [];
                if (g.v) {
                    GTSLib.gtsSort(g);
                    g.v.forEach(d => {
                        if (this._options.timeMode === 'timestamp') {
                            ticks.push(d[0]);
                        }
                        else {
                            ticks.push(moment.utc(d[0] / timestampdivider));
                        }
                        data.push(d[d.length - 1]);
                    });
                    let color = ColorLib.getColor(pos);
                    let label = GTSLib.serializeGtsMetadata(g);
                    this._mapIndex[label] = pos;
                    let ds = {
                        label: label,
                        data: data,
                        borderColor: color,
                        borderWidth: 1,
                        backgroundColor: ColorLib.transparentize(color)
                    };
                    datasets.push(ds);
                    pos++;
                    i++;
                }
            });
        }
        this.LOG.debug(['gtsToData', 'datasets'], datasets);
        return { datasets: datasets, ticks: GTSLib.unique(ticks).sort((a, b) => a > b ? 1 : a === b ? 0 : -1) };
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-bar:**/"; }
}
