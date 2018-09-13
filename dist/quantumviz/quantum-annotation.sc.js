/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart } from './chunk-35f9f27a.js';
import { a as GTSLib } from './chunk-7f4b1b2f.js';
import { a as ColorLib } from './chunk-b534d406.js';
import { a as Logger } from './chunk-c6b875fd.js';
import { a as ChartLib } from './chunk-f29847bd.js';
import './chunk-ee323282.js';

class QuantumAnnotation {
    constructor() {
        this.chartTitle = "";
        this.responsive = false;
        this.showLegend = true;
        this.data = "[]";
        this.hiddenData = "[]";
        this.options = "{}";
        this.theme = "light";
        this.width = "";
        this.height = "";
        this.legendOffset = 70;
        this._mapIndex = {};
        this.LOG = new Logger(QuantumAnnotation);
        this._options = {};
        this.uuid = 'chart-' + ChartLib.guid().split('-').join('');
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onTheme(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['theme'], newValue);
            this.drawChart();
        }
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            const data = JSON.parse(newValue);
            if (data.time.timeMode === "timestamp") {
                this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                this._chart.options.scales.xAxes[0].time.displayFormats.millisecond =
                    data.time.displayFormats;
                this._chart.update();
            }
            else {
                this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                this._chart.update();
            }
        }
    }
    hideData(newValue, oldValue) {
        if (oldValue !== newValue) {
            const hiddenData = GTSLib.cleanArray(JSON.parse(newValue));
            Object.keys(this._mapIndex).forEach(key => {
                this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!hiddenData.find(item => item === key);
            });
            this._chart.update();
        }
    }
    minBoundChange(newValue, oldValue) {
        this._chart.options.animation.duration = 0;
        if (oldValue !== newValue) {
            this._chart.options.scales.xAxes[0].time.min = newValue;
            this._chart.update();
        }
        this.LOG.debug(['minBoundChange'], this._chart.options.scales.xAxes[0].time.min);
    }
    maxBoundChange(newValue, oldValue) {
        this._chart.options.animation.duration = 0;
        if (oldValue !== newValue) {
            this._chart.options.scales.xAxes[0].time.max = newValue;
            this._chart.update();
        }
        this.LOG.debug(['maxBoundChange'], this._chart.options.scales.xAxes[0].time.max);
    }
    /**
     *
     */
    drawChart() {
        this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
        let ctx = this.el.shadowRoot.querySelector('#' + this.uuid);
        let gts = this.parseData(JSON.parse(this.data));
        let calculatedHeight = 30 * gts.length + this.legendOffset;
        let height = this.height || this.height !== ""
            ? Math.max(calculatedHeight, parseInt(this.height))
            : calculatedHeight;
        this.height = height + "";
        ctx.parentElement.style.height = height + "px";
        ctx.parentElement.style.width = "100%";
        const color = this._options.gridLineColor || ChartLib.getGridColor(this.theme);
        const me = this;
        this._chart = new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: {
                layout: {
                    padding: {
                        bottom: 30 * gts.length
                    }
                },
                legend: { display: this.showLegend },
                responsive: this.responsive,
                tooltips: {
                    mode: "x",
                    position: "nearest",
                    custom: function (tooltip) {
                        if (tooltip.opacity > 0) {
                            me.pointHover.emit({
                                x: tooltip.dataPoints[0].x + 15,
                                y: this._eventPosition.y
                            });
                        }
                        else {
                            me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                        }
                        return;
                    },
                    callbacks: {
                        title: (tooltipItems) => {
                            return tooltipItems[0].xLabel || "";
                        },
                        label: (tooltipItem, data) => {
                            return `${data.datasets[tooltipItem.datasetIndex].label}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                                .val}`;
                        }
                    }
                },
                scales: {
                    xAxes: [
                        {
                            drawTicks: false,
                            type: "time",
                            time: {
                                min: this.timeMin,
                                max: this.timeMax,
                                unit: "day"
                            },
                            gridLines: {
                                zeroLineColor: color,
                                color: color,
                                display: false
                            },
                            ticks: {
                                fontColor: color
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            drawTicks: false,
                            scaleLabel: {
                                display: false
                            },
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            },
                            gridLines: {
                                color: color,
                                zeroLineColor: color,
                            },
                            ticks: {
                                fontColor: color,
                                min: 0,
                                max: 1,
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }
                    ]
                }
            }
        });
    }
    /**
     *
     * @param gts
     * @returns {any[]}
     */
    parseData(gts) {
        let dataList;
        if (gts.hasOwnProperty('data')) {
            dataList = gts.data;
        }
        else {
            dataList = gts;
        }
        let datasets = [];
        let pos = 0;
        if (!gts) {
            return;
        }
        else {
            dataList = GTSLib.flatDeep(dataList);
            dataList.forEach((g, i) => {
                if (GTSLib.isGtsToAnnotate(g)) {
                    let data = [];
                    let color = ColorLib.getColor(i);
                    const myImage = ChartLib.buildImage(1, 30, color);
                    g.v.forEach(d => {
                        data.push({ x: d[0] / 1000, y: 0.5, val: d[d.length - 1] });
                    });
                    let label = GTSLib.serializeGtsMetadata(g);
                    this._mapIndex[label] = pos;
                    datasets.push({
                        label: label,
                        data: data,
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        pointHitRadius: 5,
                        pointStyle: myImage,
                        borderColor: color,
                        backgroundColor: ColorLib.transparentize(color, 0.5)
                    });
                    pos++;
                }
            });
        }
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", { class: this.theme },
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container", style: {
                    position: "relative",
                    width: this.width,
                    height: this.height
                } },
                h("canvas", { id: this.uuid, width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-annotation"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
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
        "hiddenData": {
            "type": String,
            "attr": "hidden-data",
            "watchCallbacks": ["hideData"]
        },
        "options": {
            "type": String,
            "attr": "options",
            "watchCallbacks": ["changeScale"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "theme": {
            "type": String,
            "attr": "theme",
            "watchCallbacks": ["onTheme"]
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max",
            "watchCallbacks": ["maxBoundChange"]
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min",
            "watchCallbacks": ["minBoundChange"]
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "quantum-annotation[data-quantum-annotation]   .chart-container[data-quantum-annotation] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

export { QuantumAnnotation };
