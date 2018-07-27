/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart, b as moment } from './chunk-d48f8ecd.js';
import { a as GTSLib } from './chunk-be650d54.js';
import './chunk-ee323282.js';

class QuantumBubble {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = JSON.parse(this.data);
        if (!data)
            return;
        const me = this;
        new Chart(ctx, {
            type: 'bubble',
            tooltips: {
                mode: 'x',
                position: 'nearest',
                custom: function (tooltip) {
                    if (tooltip.opacity > 0) {
                        me.pointHover.emit({ x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y });
                    }
                    else {
                        me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                    }
                    return;
                }
            },
            legend: { display: this.showLegend },
            data: {
                datasets: this.parseData(data)
            },
            options: {
                borderWidth: 1,
                scales: {
                    yAxes: [
                        {
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            }
                        }
                    ]
                },
                responsive: this.responsive
            }
        });
    }
    parseData(gts) {
        if (!gts)
            return;
        let datasets = [];
        for (let i = 0; i < gts.length; i++) {
            let label = Object.keys(gts[i])[0];
            let data = [];
            let g = gts[i][label];
            if (GTSLib.isArray(g)) {
                g.forEach(d => {
                    data.push({
                        x: d[0],
                        y: d[1],
                        r: d[2],
                    });
                });
            }
            datasets.push({
                data: data,
                label: label,
                backgroundColor: GTSLib.transparentize(GTSLib.getColor(i), 0.5),
                borderColor: GTSLib.getColor(i),
                borderWidth: 1
            });
        }
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-bubble"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative;\n}"; }
}

class QuantumChart {
    constructor() {
        this.unit = "";
        this.type = "line";
        this.chartTitle = "";
        this.responsive = false;
        this.showLegend = false;
        this.data = "[]";
        this.hiddenData = "[]";
        this.options = "{}";
        this.width = "";
        this.height = "";
        this.config = "{}";
        this._mapIndex = {};
        this._xSlider = {
            element: null,
            min: 0,
            max: 0
        };
        this._ySlider = {
            element: null,
            min: 0,
            max: 0
        };
        this._config = {
            rail: {
                class: ""
            },
            cursor: {
                class: ""
            }
        };
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
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
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        //console.debug("[QuantumChart] drawChart", this.data);
        let data = JSON.parse(this.data);
        if (!data)
            return;
        let gts = this.gtsToData(JSON.parse(this.data));
        const me = this;
        const graphOpts = {
            animation: false,
            legend: { display: /*this.showLegend*/ false },
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
                }
            },
            scales: {
                xAxes: [
                    {
                        time: {
                            min: moment(!!this.timeMin ? this.timeMin : gts.ticks[0], "x"),
                            max: moment(!!this.timeMax ? this.timeMax : gts.ticks[gts.ticks.length - 1], "x"),
                            unit: "day"
                        },
                        type: "time"
                    }
                ],
                yAxes: [
                    {
                        /*
                        ticks: {
                          min: 500,
                          max: 1000
                        },
                        */
                        afterFit: function (scaleInstance) {
                            scaleInstance.width = 100; // sets the width to 100px
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.unit
                        }
                    }
                ]
            },
            responsive: this.responsive,
            zoom: {
                enabled: true,
                drag: false,
                sensitivity: 0.5,
                mode: "x"
            }
        };
        /*
            if(this.options === "timestamp"){
              delete graphOpts.scales.xAxes[0].type;
            }
        */
        if (this.type === "spline") {
            graphOpts["elements"] = { line: { lineTension: 0 } };
        }
        if (this.type === "area") {
            graphOpts["elements"] = { line: { fill: "start" } };
        }
        this._chart = new Chart(ctx, {
            type: this.type === "bar" ? this.type : "line",
            data: {
                labels: gts.ticks,
                datasets: gts.datasets
            },
            options: graphOpts
        });
        let maxArray = [];
        let minArray = [];
        gts.datasets.forEach(g => {
            let max = Math.max(...g.data);
            if (!!max && max != Infinity) {
                maxArray.push(max);
            }
        });
        gts.datasets.forEach(g => {
            let min = Math.min(...g.data);
            if (min == 0 || (!!min && min != Infinity)) {
                minArray.push(min);
            }
        });
        this._ySlider.min = Math.min(...minArray);
        this._ySlider.max = Math.max(...maxArray) * 1.05;
        this._chart.options.scales.yAxes[0].ticks.min = this._ySlider.min;
        this._chart.options.scales.yAxes[0].ticks.max = this._ySlider.max;
        this._chart.update();
        this._xSlider.min = gts.ticks[0];
        this._xSlider.max = gts.ticks[gts.ticks.length - 1];
    }
    xSliderInit() {
        let slider = this.el.shadowRoot.querySelector("#xSlider");
        slider.setAttribute("min-value", this._xSlider.min.toString());
        slider.setAttribute("max-value", this._xSlider.max.toString());
        slider.setAttribute("width", this.el.shadowRoot
            .querySelector("#myChart")
            .getBoundingClientRect()
            .width.toString());
        this._xSlider.element = slider;
    }
    ySliderInit() {
        let slider = this.el.shadowRoot.querySelector("#ySlider");
        slider.setAttribute("min-value", this._ySlider.min.toString());
        slider.setAttribute("max-value", this._ySlider.max.toString());
        slider.setAttribute("height", this.el.shadowRoot
            .querySelector("#myChart")
            .getBoundingClientRect()
            .height.toString());
        this._ySlider.element = slider;
    }
    gtsToData(gts) {
        let datasets = [];
        let ticks = [];
        let pos = 0;
        if (!gts) {
            return;
        }
        else
            gts.forEach(d => {
                if (d.gts) {
                    d.gts = GTSLib.flatDeep(d.gts);
                    d.gts.forEach((g, i) => {
                        let data = [];
                        if (g.v) {
                            g.v.forEach(d => {
                                ticks.push(d[0] / 1000);
                                data.push(d[d.length - 1]);
                            });
                            let color = GTSLib.getColor(i);
                            if (d.params && d.params[i] && d.params[i].color) {
                                color = d.params[i].color;
                            }
                            let label = GTSLib.serializeGtsMetadata(g);
                            this._mapIndex[label] = pos;
                            if (d.params && d.params[i] && d.params[i].key) {
                                label = d.params[i].key;
                            }
                            let ds = {
                                label: label,
                                data: data,
                                pointRadius: 1,
                                fill: false,
                                steppedLine: this.isStepped(),
                                borderColor: color,
                                borderWidth: 1,
                                backgroundColor: GTSLib.transparentize(color, 0.5)
                            };
                            if (d.params && d.params[i] && d.params[i].interpolate) {
                                switch (d.params[i].interpolate) {
                                    case "line":
                                        ds["lineTension"] = 0;
                                        break;
                                    case "spline":
                                        break;
                                    case "area":
                                        ds.fill = true;
                                }
                            }
                            datasets.push(ds);
                            pos++;
                        }
                    });
                }
            });
        return { datasets: datasets, ticks: GTSLib.unique(ticks) };
    }
    isStepped() {
        if (this.type.startsWith("step")) {
            return this.type.replace("step-", "");
        }
        else {
            return false;
        }
    }
    xZoomListener(event) {
        let min = this._chart.options.scales.xAxes[0].time.min._i;
        let max = this._chart.options.scales.xAxes[0].time.max._i;
        let diff = max - min;
        if (event.detail.zoomValue.zoomType > 0) {
            min = min + 0.1 * diff * event.detail.zoomValue.coef;
            max = max - 0.1 * diff * (1 - event.detail.zoomValue.coef);
            max = max > this._xSlider.max ? this._xSlider.max : max;
            min = min < this._xSlider.min ? this._xSlider.min : min;
            this._chart.options.scales.xAxes[0].time.min = moment(min, "x");
            this._chart.options.scales.xAxes[0].time.max = moment(max, "x");
        }
        else {
            min = min - 0.15 * diff * event.detail.zoomValue.coef;
            max = max + 0.15 * diff * (1 - event.detail.zoomValue.coef);
            max = max > this._xSlider.max ? this._xSlider.max : max;
            min = min < this._xSlider.min ? this._xSlider.min : min;
            this._chart.options.scales.xAxes[0].time.min = moment(min, "x");
            this._chart.options.scales.xAxes[0].time.max = moment(max, "x");
        }
        this._chart.update();
        this._xSlider.element.setAttribute("max-value", (this._xSlider.max - (max - min)).toString());
        let cursorSize = (max - min) / (this._xSlider.max - this._xSlider.min);
        let cursorOffset = (min - this._xSlider.min) / (this._xSlider.max - this._xSlider.min);
        this._xSlider.element.setAttribute("cursor-size", JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset }));
        this.boundsDidChange.emit({ bounds: { min: min, max: max } });
    }
    yZoomListener(event) {
        let min = this._chart.options.scales.yAxes[0].ticks.min;
        let max = this._chart.options.scales.yAxes[0].ticks.max;
        let diff = max - min;
        if (event.detail.zoomValue.zoomType > 0) {
            min = min + 0.1 * diff * (1 - event.detail.zoomValue.coef);
            max = max - 0.1 * diff * event.detail.zoomValue.coef;
            max = max > this._ySlider.max ? this._ySlider.max : max;
            min = min < this._ySlider.min ? this._ySlider.min : min;
            this._chart.options.scales.yAxes[0].ticks.min = min;
            this._chart.options.scales.yAxes[0].ticks.max = max;
        }
        else {
            min = min - 0.15 * diff * (1 - event.detail.zoomValue.coef);
            max = max + 0.15 * diff * 1 - event.detail.zoomValue.coef;
            max = max > this._ySlider.max ? this._ySlider.max : max;
            min = min < this._ySlider.min ? this._ySlider.min : min;
            this._chart.options.scales.yAxes[0].ticks.min = min;
            this._chart.options.scales.yAxes[0].ticks.max = max;
        }
        this._chart.update();
        this._ySlider.element.setAttribute("max-value", (this._ySlider.max - (max - min)).toString());
        let cursorSize = (max - min) / (this._ySlider.max - this._ySlider.min);
        let cursorOffset = (this._ySlider.max - max) / (this._ySlider.max - this._ySlider.min);
        this._ySlider.element.setAttribute("cursor-size", JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset }));
    }
    xSliderListener(event) {
        let min = this._chart.options.scales.xAxes[0].time.min._i;
        let max = this._chart.options.scales.xAxes[0].time.max._i;
        let offset = event.detail.sliderValue - min;
        this._chart.options.scales.xAxes[0].time.min = moment(min + offset, "x");
        this._chart.options.scales.xAxes[0].time.max = moment(max + offset, "x");
        this._chart.update();
    }
    ySliderListener(event) {
        let min = this._chart.options.scales.yAxes[0].ticks.min;
        let max = this._chart.options.scales.yAxes[0].ticks.max;
        let offset = event.detail.sliderValue - min;
        this._chart.options.scales.yAxes[0].ticks.min = min + offset;
        this._chart.options.scales.yAxes[0].ticks.max = max + offset;
        this._chart.update();
    }
    zoomReset() {
        this._chart.options.scales.xAxes[0].time.min = moment(this._xSlider.min, "x");
        this._chart.options.scales.xAxes[0].time.max = moment(this._xSlider.max, "x");
        this._chart.options.scales.yAxes[0].ticks.min = this._ySlider.min;
        this._chart.options.scales.yAxes[0].ticks.max = this._ySlider.max;
        this._chart.update();
        this._ySlider.element.setAttribute("cursor-size", JSON.stringify({ cursorSize: 1, cursorOffset: 0 }));
        this._xSlider.element.setAttribute("cursor-size", JSON.stringify({ cursorSize: 1, cursorOffset: 0 }));
    }
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
        console.log("chart :", this._config);
    }
    componentDidLoad() {
        this.drawChart();
        this.xSliderInit();
        this.ySliderInit();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" },
                h("button", { type: "button", onClick: () => this.zoomReset() }, "ZooM reset"),
                h("quantum-vertical-zoom-slider", { id: "ySlider", "min-value": "", "max-value": "", config: JSON.stringify(this._config) }),
                this.responsive ? (h("canvas", { id: "myChart" })) : (h("canvas", { id: "myChart", width: this.width, height: this.height })),
                h("quantum-horizontal-zoom-slider", { id: "xSlider", "min-value": "", "max-value": "", config: JSON.stringify(this._config) }))));
    }
    static get is() { return "quantum-chart"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "config": {
            "type": String,
            "attr": "config"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
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
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "boundsDidChange",
            "method": "boundsDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "xZoom",
            "method": "xZoomListener"
        }, {
            "name": "yZoom",
            "method": "yZoomListener"
        }, {
            "name": "xSliderValueChanged",
            "method": "xSliderListener"
        }, {
            "name": "ySliderValueChanged",
            "method": "ySliderListener"
        }]; }
    static get style() { return "quantum-chart .chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

class QuantumPie {
    constructor() {
        this.unit = '';
        this.type = 'pie';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    /**
     *
     * @param num
     * @returns {any[]}
     */
    generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.getColor(i));
        }
        return color;
    }
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    parseData(data) {
        let labels = [];
        let _data = [];
        data.forEach(d => {
            _data.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, data: _data };
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let data = this.parseData(JSON.parse(this.data));
        //console.debug('[QuantumPie]', this.data, data);
        new Chart(ctx, {
            type: (this.type === 'gauge') ? 'doughnut' : this.type,
            legend: { display: this.showLegend },
            data: {
                datasets: [{ data: data.data, backgroundColor: this.generateColors(data.data.length), label: this.chartTitle }],
                labels: data.labels
            },
            options: {
                responsive: this.responsive,
                tooltips: {
                    mode: 'index',
                    intersect: true,
                },
                circumference: this.getCirc(),
                rotation: this.getRotation(),
            }
        });
    }
    getRotation() {
        if ('gauge' === this.type) {
            return Math.PI;
        }
        else {
            return -0.5 * Math.PI;
        }
    }
    getCirc() {
        if ('gauge' === this.type) {
            return Math.PI;
        }
        else {
            return 2 * Math.PI;
        }
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-pie"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return "host .chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

class QuantumPolar {
    constructor() {
        this.unit = '';
        this.type = 'polar';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
        }
        return color;
    }
    parseData(gts) {
        let labels = [];
        let datas = [];
        gts.forEach(d => {
            datas.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, datas: datas };
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.parseData(JSON.parse(this.data));
        new Chart.PolarArea(ctx, {
            type: this.type,
            legend: { display: this.showLegend },
            data: {
                datasets: [{ data: gts.datas, backgroundColor: this.generateColors(gts.datas.length), label: this.chartTitle }],
                labels: gts.labels
            },
            options: {
                responsive: this.responsive,
                tooltips: {
                    mode: 'index',
                    intersect: true,
                }
            }
        });
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-polar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return ".chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative;\n}"; }
}

class QuantumRadar {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = true;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(GTSLib.transparentize(GTSLib.getColor(i), 0.5));
        }
        return color;
    }
    parseData(gts) {
        let labels = [];
        let datas = [];
        gts.forEach(d => {
            datas.push(d[1]);
            labels.push(d[0]);
        });
        return { labels: labels, datas: datas };
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        //let gts = this.parseData(JSON.parse(this.data));
        new Chart(ctx, {
            type: 'radar',
            legend: { display: this.showLegend },
            data: {
                /*
                datasets: [{data: gts.datas, backgroundColor: this.generateColors(gts.datas.length), label: this.chartTitle}],
                labels: gts.labels
                */
                labels: ['Beer', 'Rum', 'Peanut', 'Crisps'],
                datasets: [{
                        data: [50, 25, 10, 10],
                        backgroundColor: '#64aa3939'
                    }, {
                        data: [35, 75, 90, 5],
                        backgroundColor: '#642d882d'
                    }
                ]
            },
            options: {
                responsive: this.responsive,
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        });
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height }))));
    }
    static get is() { return "quantum-radar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
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
            "attr": "width"
        }
    }; }
    static get style() { return ".chart-container {\n    width: var(--quantum-chart-width, 100%);\n    height: var(--quantum-chart-height, 100%);\n    position: relative;\n  }"; }
}

class QuantumScatter {
    constructor() {
        this.unit = '';
        this.chartTitle = '';
        this.responsive = false;
        this.showLegend = true;
        this.data = '[]';
        this.options = {};
        this.width = '';
        this.height = '';
    }
    redraw(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.drawChart();
        }
    }
    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        const me = this;
        new Chart.Scatter(ctx, {
            data: {
                datasets: gts
            },
            options: {
                legend: { display: this.showLegend },
                responsive: this.responsive,
                tooltips: {
                    mode: 'x',
                    position: 'nearest',
                    custom: function (tooltip) {
                        if (tooltip.opacity > 0) {
                            me.pointHover.emit({ x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y });
                        }
                        else {
                            me.pointHover.emit({ x: -100, y: this._eventPosition.y });
                        }
                        return;
                    },
                },
                scales: {
                    xAxes: [{
                            type: 'time',
                            time: {
                                min: this.timeMin,
                                max: this.timeMax,
                            }
                        }],
                    yAxes: [{
                            afterFit: function (scaleInstance) {
                                scaleInstance.width = 100; // sets the width to 100px
                            },
                            scaleLabel: {
                                display: true,
                                labelString: this.unit
                            }
                        }]
                },
            }
        });
    }
    gtsToScatter(gts) {
        let datasets = [];
        gts.forEach(d => {
            for (let i = 0; i < d.gts.length; i++) {
                let g = d.gts[i];
                let data = [];
                g.v.forEach(d => {
                    data.push({ x: d[0] / 1000, y: d[d.length - 1] });
                });
                let color = GTSLib.getColor(i);
                if (d.params && d.params[i] && d.params[i].color) {
                    color = d.params[i].color;
                }
                let label = `${g.c} - ${JSON.stringify(g.l)}`;
                if (d.params && d.params[i] && d.params[i].key) {
                    label = d.params[i].key;
                }
                datasets.push({
                    label: label,
                    data: data,
                    pointRadius: 2,
                    borderColor: color,
                    backgroundColor: GTSLib.transparentize(color, 0.5)
                });
            }
        });
        return datasets;
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive
                ? h("canvas", { id: "myChart" })
                : h("canvas", { id: "myChart", width: this.width, height: this.height })));
    }
    static get is() { return "quantum-scatter"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["redraw"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        },
        "timeMax": {
            "type": Number,
            "attr": "time-max"
        },
        "timeMin": {
            "type": Number,
            "attr": "time-min"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get events() { return [{
            "name": "pointHover",
            "method": "pointHover",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "quantum-scatter .chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

export { QuantumBubble, QuantumChart, QuantumPie, QuantumPolar, QuantumRadar, QuantumScatter };
