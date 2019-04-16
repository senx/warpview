import { Logger } from "../../utils/logger";
import Chart from 'chart.js';
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { DataModel } from "../../model/dataModel";
import { GTSLib } from "../../utils/gts.lib";
import deepEqual from "deep-equal";
export class WarpViewPie {
    constructor() {
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.responsive = false;
        this.debug = false;
        this._options = {
            type: 'pie',
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
        this.parentHeight = -1;
    }
    onResize() {
        if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0 || this.el.parentElement.getBoundingClientRect().height !== this.parentHeight) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
                this.parentHeight = this.el.parentElement.getBoundingClientRect().height;
                if (this.el.parentElement.getBoundingClientRect().width > 0) {
                    this.LOG.debug(['onResize'], this.el.parentElement.getBoundingClientRect().width);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }, 150);
        }
    }
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.drawChart();
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    parseData(data) {
        this.LOG.debug(['parseData'], data);
        if (!data) {
            return;
        }
        let labels = [];
        let _data = [];
        let dataList;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
            this._options = ChartLib.mergeDeep(this._options, data.globalParams || {});
        }
        else {
            dataList = data;
        }
        if (!dataList) {
            return { labels: [], data: [] };
        }
        else {
            dataList.forEach(d => {
                _data.push(d[1]);
                labels.push(d[0]);
            });
            this.LOG.debug(['parseData'], [labels, _data]);
            return { labels: labels, data: _data };
        }
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector("#" + this.uuid);
        let data = this.parseData(this.data);
        if (!data) {
            return;
        }
        this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
        this.LOG.debug(['drawChart'], [this.data, this._options, data]);
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['data.data'], data.data);
        if (data.data && data.data.length > 0) {
            this._options.type = this.options.type || this._options.type;
            this._chart = new Chart(ctx, {
                type: this._options.type === 'gauge' ? 'doughnut' : this._options.type,
                data: {
                    datasets: [{
                            data: data.data,
                            backgroundColor: ColorLib.generateTransparentColors(data.data.length),
                            borderColor: ColorLib.generateColors(data.data.length)
                        }],
                    labels: data.labels
                },
                options: {
                    legend: {
                        display: this.showLegend
                    },
                    animation: {
                        duration: 0,
                    },
                    responsive: this.responsive,
                    maintainAspectRatio: false,
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    },
                    circumference: this.getCirc(),
                    rotation: this.getRotation(),
                }
            });
            this.onResize();
            setTimeout(() => {
                this._chart.update();
            }, 250);
        }
    }
    getRotation() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return -0.5 * Math.PI;
        }
    }
    getCirc() {
        if ('gauge' === this._options.type) {
            return Math.PI;
        }
        else {
            return 2 * Math.PI;
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewPie, this.debug);
    }
    componentDidLoad() {
        this.drawChart();
        ChartLib.resizeWatchTimer(this.el, this.onResize.bind(this));
    }
    render() {
        return h("div", null,
            h("div", { class: "chart-container" },
                h("canvas", { id: this.uuid, width: this.width, height: this.height })));
    }
    static get is() { return "warp-view-pie"; }
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
    static get style() { return "/**style-placeholder:warp-view-pie:**/"; }
}
