import Chart from 'chart.js';
import { ChartLib } from "../../utils/chart-lib";
import { ColorLib } from "../../utils/color-lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTSLib } from "../../utils/gts.lib";
import deepEqual from "deep-equal";
export class WarpViewPolar {
    constructor() {
        this.responsive = false;
        this.showLegend = true;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.debug = false;
        this._options = {
            gridLineColor: '#8e8e8e',
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
    parseData(gts) {
        let labels = [];
        let data = [];
        gts.forEach(d => {
            data.push(Math.abs(d[1]));
            labels.push(d[0]);
        });
        return { labels: labels, data: data };
    }
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.height = (this.responsive ? this.el.parentElement.getBoundingClientRect().height : this.height || 600) + '';
        this.width = (this.responsive ? this.el.parentElement.getBoundingClientRect().width : this.width || 800) + '';
        const color = this._options.gridLineColor;
        if (!this.data)
            return;
        let data = this.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (GTSLib.isArray(data) && data[0] && (data[0] instanceof DataModel || data[0].hasOwnProperty('data'))) {
            data = data[0];
        }
        let dataList;
        if (data instanceof DataModel || data.hasOwnProperty('data')) {
            dataList = data.data;
        }
        else {
            dataList = data;
        }
        let gts = this.parseData(dataList);
        if (this._chart) {
            this._chart.destroy();
            delete this._chart;
        }
        this.LOG.debug(['gts.data'], gts.data);
        if (gts && gts.data && gts.data.length > 0) {
            this._chart = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    datasets: [{
                            data: gts.data,
                            backgroundColor: ColorLib.generateTransparentColors(gts.data.length),
                            borderColor: ColorLib.generateColors(gts.data.length)
                        }],
                    labels: gts.labels
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 50,
                            bottom: 0
                        }
                    },
                    animation: {
                        duration: 0,
                    },
                    legend: { display: this.showLegend },
                    responsive: this.responsive,
                    maintainAspectRatio: false,
                    scale: {
                        gridLines: {
                            color: color,
                            zeroLineColor: color
                        },
                        pointLabels: {
                            fontColor: color,
                        },
                        ticks: {
                            fontColor: color,
                            backdropColor: 'transparent'
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    }
                }
            });
            this.onResize();
            setTimeout(() => {
                this._chart.update();
            }, 250);
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewPolar, this.debug);
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
    static get is() { return "warp-view-polar"; }
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
    static get style() { return "/**style-placeholder:warp-view-polar:**/"; }
}
