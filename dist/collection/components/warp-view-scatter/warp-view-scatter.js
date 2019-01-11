import Chart from 'chart.js';
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Logger } from "../../utils/logger";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import moment from "moment";
import deepEqual from "deep-equal";
export class WarpViewScatter {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.debug = false;
        this._options = {
            gridLineColor: '#8e8e8e'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.el.parentElement.clientWidth > 0) {
                    this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }, 150);
        }
    }
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let dataList;
        let data = this.data;
        if (!data)
            return;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.gtsToScatter(dataList);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + '';
        const color = this._options.gridLineColor;
        const options = {
            legend: {
                display: this.showLegend
            },
            responsive: this.responsive,
            animation: {
                duration: 0,
            },
            tooltips: {
                mode: 'x',
                position: 'nearest',
                callbacks: ChartLib.getTooltipCallbacks()
            },
            scales: {
                xAxes: [{
                        gridLines: {
                            color: color,
                            zeroLineColor: color,
                        },
                        ticks: {
                            fontColor: color
                        }
                    }],
                yAxes: [{
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
                    }]
            },
        };
        if (this._options.timeMode === 'timestamp') {
            options.scales.xAxes[0].time = undefined;
            options.scales.xAxes[0].type = 'linear';
            options.scales.xAxes[0].ticks = {
                fontColor: color,
            };
        }
        else {
            options.scales.xAxes[0].time = {
                displayFormats: {
                    millisecond: 'HH:mm:ss.SSS',
                    second: 'HH:mm:ss',
                    minute: 'HH:mm',
                    hour: 'HH'
                }
            };
            options.scales.xAxes[0].ticks = {
                fontColor: color
            };
            options.scales.xAxes[0].type = 'time';
        }
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart.Scatter(ctx, { data: { datasets: gts }, options: options });
        this.onResize();
        this.LOG.debug(['gtsToScatter', 'chart'], [gts, options]);
    }
    gtsToScatter(gts) {
        if (!gts) {
            return;
        }
        this.LOG.debug(['gtsToScatter'], gts);
        let datasets = [];
        let timestampdivider = 1000;
        if (this._options.timeUnit && this._options.timeUnit === 'ms') {
            timestampdivider = 1;
        }
        if (this._options.timeUnit && this._options.timeUnit === 'ns') {
            timestampdivider = 1000000;
        }
        for (let i = 0; i < gts.length; i++) {
            let g = gts[i];
            let data = [];
            g.v.forEach(d => {
                if (this._options.timeMode === 'timestamp') {
                    data.push({ x: d[0], y: d[d.length - 1] });
                }
                else {
                    data.push({ x: moment.utc(d[0] / timestampdivider), y: d[d.length - 1] });
                }
            });
            datasets.push({
                label: GTSLib.serializeGtsMetadata(g),
                data: data,
                pointRadius: 2,
                borderColor: ColorLib.getColor(i),
                backgroundColor: ColorLib.transparentize(ColorLib.getColor(i))
            });
        }
        this.LOG.debug(['gtsToScatter', 'datasets'], datasets);
        return datasets;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewScatter, this.debug);
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-scatter"; }
    static get encapsulation() { return "shadow"; }
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
    static get style() { return "/**style-placeholder:warp-view-scatter:**/"; }
}
