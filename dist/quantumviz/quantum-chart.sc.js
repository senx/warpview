/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart, b as moment } from './chunk-49509f30.js';
import { a as GTSLib } from './chunk-0b5c2300.js';
import { a as Draggabilly } from './chunk-f78e876a.js';
import './chunk-ee323282.js';

class QuantumChart {
    constructor() {
        this.alone = true;
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
        this.xView = "{}";
        this.yView = "{}";
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
    toBase64Image() {
        return this._chart.toBase64Image();
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
    changeXView() {
        let xView = JSON.parse(this.xView);
        this._chart.options.scales.xAxes[0].time.min = moment(xView.min, "x");
        this._chart.options.scales.xAxes[0].time.max = moment(xView.max, "x");
        this._chart.update();
    }
    changeYView() {
        let yView = JSON.parse(this.yView);
        this._chart.options.scales.yAxes[0].ticks.min = yView.min;
        this._chart.options.scales.yAxes[0].ticks.max = yView.max;
        this._chart.update();
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
            legend: { display: this.showLegend },
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
                        ticks: {
                        //min: 500,
                        //max: 1000
                        },
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
        if (!this.alone) {
            console.log("Alone");
            let chartInfos = {
                xMin: gts.ticks[0],
                xMax: gts.ticks[gts.ticks.length - 1],
                yMin: Math.min(...minArray),
                yMax: Math.max(...maxArray) * 1.05
            };
            this.chartInfos.emit(chartInfos);
        }
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
                                pointRadius: 0,
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
                            else {
                                ds["lineTension"] = 0;
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
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
        //console.log("chart :", this._config);
    }
    componentDidLoad() {
        this.drawChart();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.chartTitle),
            h("div", { class: "chart-container" }, this.responsive ? (h("canvas", { id: "myChart" })) : (h("canvas", { id: "myChart", width: this.width, height: this.height })))));
    }
    static get is() { return "quantum-chart"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "alone": {
            "type": Boolean,
            "attr": "alone"
        },
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
        "toBase64Image": {
            "method": true
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
        },
        "xView": {
            "type": String,
            "attr": "x-view",
            "watchCallbacks": ["changeXView"]
        },
        "yView": {
            "type": String,
            "attr": "y-view",
            "watchCallbacks": ["changeYView"]
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
        }, {
            "name": "chartInfos",
            "method": "chartInfos",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "quantum-chart[data-quantum-chart]   .chart-container[data-quantum-chart] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

class QuantumHorizontalZoomMap {
    constructor() {
        this.cursorSize = "{}";
        this.config = "{}";
        this._cursorMinWidth = 30;
        this.lastPos = 0;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
                window.requestAnimationFrame(() => {
                    if (object.cursorSize * this._rail.getBoundingClientRect().width <
                        this._cursorMinWidth) {
                        this._cursor.style.width = this._cursorMinWidth.toString() + "px";
                    }
                    else {
                        this._cursor.style.width =
                            (object.cursorSize * 100).toString() + "%";
                    }
                });
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.width = (0.94 * newValue).toString() + "px";
            this._img.style.width = (newValue + 18).toString() + "px";
        }
    }
    componentWillLoad() {
        //this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
        this._img = this.el.shadowRoot.querySelector("#img");
        let drag = new Draggabilly(this._cursor, {
            axis: "x",
            containment: this._rail
        });
        drag.on("dragStart", (event, pointer) => {
            this.dimsX(event);
        });
        drag.on("dragMove", (event, pointer, moveVector) => {
            if ((event.pageX - this._mouseCursorLeftOffset) >= this._railMin + 1 && (event.pageX + this._mouseCursorRightOffset) <= this._railMax - 1) {
                let v = event.pageX - this._rail.offsetLeft - this._mouseCursorLeftOffset;
                v = Math.max(0, v);
                let value = (v / (this._railMax - this._railMin - this._cursorWidth)) *
                    (this.maxValue - this.minValue) +
                    this.minValue;
                window.setTimeout(() => this.xSliderValueChanged.emit({ sliderValue: value }));
            }
        });
    }
    dimsX(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetLeft;
        this._railMax = railDims.width + this._rail.offsetLeft;
        this._cursorWidth = cursorDims.width;
        this._mouseCursorLeftOffset =
            event.pageX - this._cursor.offsetLeft - this._rail.offsetLeft;
        this._mouseCursorRightOffset =
            cursorDims.width - this._mouseCursorLeftOffset;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    positionClick(event) {
        event.preventDefault();
        if (event.pageX < this._railMin + this._cursor.offsetLeft ||
            event.pageX > this._railMin + this._cursor.offsetLeft + this._cursorWidth) {
            this.dimsX(event);
            let halfCursorWidth = this._cursorWidth / 2;
            let v;
            if (event.pageX - halfCursorWidth < this._rail.offsetLeft) {
                v = 0;
                this._cursor.style.left = "1px";
            }
            else if (event.pageX + halfCursorWidth > this._railMax) {
                v = this._railMax - this._railMin - this._cursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            else {
                v = event.pageX - this._railMin - halfCursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            let value = (v / (this._railMax - this._railMin - this._cursorWidth)) *
                (this.maxValue - this.minValue) +
                this.minValue;
            this.xSliderValueChanged.emit({ sliderValue: value });
        }
    }
    render() {
        return (h("div", { id: "rail", onWheel: event => this.xWheel(event), onMouseUp: event => this.positionClick(event) },
            h("div", { id: "cursor" }),
            h("img", { id: "img", src: this.img })));
    }
    static get is() { return "quantum-horizontal-zoom-map"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "config": {
            "type": String,
            "attr": "config"
        },
        "cursorSize": {
            "type": String,
            "attr": "cursor-size",
            "watchCallbacks": ["changeCursorSize"]
        },
        "el": {
            "elementRef": true
        },
        "img": {
            "type": String,
            "attr": "img"
        },
        "maxValue": {
            "type": Number,
            "attr": "max-value"
        },
        "minValue": {
            "type": Number,
            "attr": "min-value"
        },
        "width": {
            "type": Number,
            "attr": "width",
            "watchCallbacks": ["initSize"]
        }
    }; }
    static get events() { return [{
            "name": "xSliderValueChanged",
            "method": "xSliderValueChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "xZoom",
            "method": "xZoom",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "[data-quantum-horizontal-zoom-map-host]   #rail[data-quantum-horizontal-zoom-map] {\n  position: relative;\n  border: 1px solid black;\n  float: right;\n  margin: 0 0 0 100px;\n  position: absolute;\n  height: 100px;\n  width: 100%;\n  overflow: hidden; }\n\n[data-quantum-horizontal-zoom-map-host]   #img[data-quantum-horizontal-zoom-map] {\n  position: absolute;\n  height: 100px;\n  \n  top: 0;\n  right: -1.5%; }\n\n[data-quantum-horizontal-zoom-map-host]   #cursor[data-quantum-horizontal-zoom-map]:hover {\n  opacity: 0.6; }\n\n[data-quantum-horizontal-zoom-map-host]   #cursor[data-quantum-horizontal-zoom-map] {\n  z-index: 1;\n  opacity: 0.3;\n  background-color: grey;\n  position: relative;\n  cursor: move;\n  width: 100%;\n  height: 100%;\n  border-left: 3px solid red;\n  border-right: 3px solid red;\n  -webkit-transition: left .01s;\n  transition: left .01s; }"; }
}

export { QuantumChart, QuantumHorizontalZoomMap };
