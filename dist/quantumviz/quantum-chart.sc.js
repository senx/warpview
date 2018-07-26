/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart, b as moment } from './chunk-3037685c.js';
import { a as GTSLib } from './chunk-faa0a089.js';
import './chunk-6133ee7c.js';

class QuantumChart {
    constructor() {
        this.unit = "";
        this.type = "line";
        this.chartTitle = "";
        this.responsive = false;
        this.showLegend = false;
        this.data = "[]";
        this.options = "{}";
        this.width = "";
        this.height = "";
        this.config = "{}";
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
                class: ''
            },
            cursor: {
                class: ''
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
                this._chart.options.scales.xAxes[0].time.displayFormats.millisecond = data.time.displayFormats;
                this._chart.update();
            }
            else {
                this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                this._chart.update();
            }
        }
    }
    hideData(newValue) {
        const meta = this._chart.getDatasetMeta(newValue);
        meta.hidden === null ? meta.hidden = true : meta.hidden = null;
        this._chart.update();
        this.didHideOrShowData.emit();
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
                            unit: 'day'
                        },
                        type: 'time'
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
                mode: 'x'
            }
        };
        /*
            if(this.options === "timestamp"){
              delete graphOpts.scales.xAxes[0].type;
            }
        */
        if (this.type === "spline") {
            graphOpts['elements'] = { line: { lineTension: 0 } };
        }
        if (this.type === "area") {
            graphOpts['elements'] = { line: { fill: 'start' } };
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
        slider.setAttribute("width", this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width.toString());
        this._xSlider.element = slider;
    }
    ySliderInit() {
        let slider = this.el.shadowRoot.querySelector("#ySlider");
        slider.setAttribute("min-value", this._ySlider.min.toString());
        slider.setAttribute("max-value", this._ySlider.max.toString());
        slider.setAttribute("height", this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height.toString());
        this._ySlider.element = slider;
    }
    gtsToData(gts) {
        let datasets = [];
        let ticks = [];
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
        //console.log("min Y", this._chart.options.scales.yAxes[0]);
        //console.log("max Y", this._chart.options.scales.yAxes[0]);
        if (event.detail.zoomValue.zoomType > 0) {
            //console.log("zoom +");
            //console.log("zoom coef", event.detail.zoomValue.coef);
            min = min + 0.1 * diff * event.detail.zoomValue.coef;
            max = max - 0.1 * diff * (1 - event.detail.zoomValue.coef);
            max = max > this._xSlider.max ? this._xSlider.max : max;
            min = min < this._xSlider.min ? this._xSlider.min : min;
            this._chart.options.scales.xAxes[0].time.min = moment(min, "x");
            this._chart.options.scales.xAxes[0].time.max = moment(max, "x");
        }
        else {
            //console.log("zoom -");
            //console.log("zoom coef", event.detail.zoomValue.coef);
            min = min - 0.15 * diff * event.detail.zoomValue.coef;
            max = max + 0.15 * diff * (1 - event.detail.zoomValue.coef);
            max = max > this._xSlider.max ? this._xSlider.max : max;
            min = min < this._xSlider.min ? this._xSlider.min : min;
            this._chart.options.scales.xAxes[0].time.min = moment(min, "x");
            this._chart.options.scales.xAxes[0].time.max = moment(max, "x");
        }
        this._chart.update();
        this._xSlider.element.setAttribute("max-value", (this._xSlider.max - (max - min)).toString());
        let cursorSize = ((max - min) / (this._xSlider.max - this._xSlider.min));
        //console.log("cursor size", cursorSize);
        let cursorOffset = ((min - this._xSlider.min) / (this._xSlider.max - this._xSlider.min));
        //console.log("offset", cursorOffset);
        this._xSlider.element.setAttribute("cursor-size", JSON.stringify({ "cursorSize": cursorSize, "cursorOffset": cursorOffset }));
        this.boundsDidChange.emit({ bounds: { min: min, max: max } });
    }
    yZoomListener(event) {
        let min = this._chart.options.scales.yAxes[0].ticks.min;
        let max = this._chart.options.scales.yAxes[0].ticks.max;
        let diff = max - min;
        if (event.detail.zoomValue.zoomType > 0) {
            //console.log("zoom +");
            //console.log("zoom coef", event.detail.zoomValue.coef);
            min = min + 0.1 * diff * (1 - event.detail.zoomValue.coef);
            max = max - 0.1 * diff * event.detail.zoomValue.coef;
            max = max > this._ySlider.max ? this._ySlider.max : max;
            min = min < this._ySlider.min ? this._ySlider.min : min;
            this._chart.options.scales.yAxes[0].ticks.min = min;
            this._chart.options.scales.yAxes[0].ticks.max = max;
        }
        else {
            //console.log("zoom -");
            //console.log("zoom coef", event.detail.zoomValue.coef);
            min = min - 0.15 * diff * (1 - event.detail.zoomValue.coef);
            max = max + 0.15 * diff * 1 - event.detail.zoomValue.coef;
            max = max > this._ySlider.max ? this._ySlider.max : max;
            min = min < this._ySlider.min ? this._ySlider.min : min;
            this._chart.options.scales.yAxes[0].ticks.min = min;
            this._chart.options.scales.yAxes[0].ticks.max = max;
        }
        this._chart.update();
        this._ySlider.element.setAttribute("max-value", (this._ySlider.max - (max - min)).toString());
        let cursorSize = ((max - min) / (this._ySlider.max - this._ySlider.min));
        //console.log("cursor size", cursorSize);
        //let cursorOffset = ((min - this._ySlider.min) / (this._ySlider.max - this._ySlider.min));
        let cursorOffset = ((this._ySlider.max - max) / (this._ySlider.max - this._ySlider.min));
        //console.log("offset", cursorOffset);
        this._ySlider.element.setAttribute("cursor-size", JSON.stringify({ "cursorSize": cursorSize, "cursorOffset": cursorOffset }));
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
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
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
                h("quantum-vertical-zoom-slider", { id: "ySlider", "min-value": "", "max-value": "", config: JSON.stringify(this._config) }),
                this.responsive
                    ? h("canvas", { id: "myChart" })
                    : h("canvas", { id: "myChart", width: this.width, height: this.height }),
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
            "type": Number,
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
            "name": "didHideOrShowData",
            "method": "didHideOrShowData",
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
    static get style() { return "quantum-chart[data-quantum-chart]   .chart-container[data-quantum-chart] {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

//import { start } from 'repl';
class QuantumHorizontalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
        this._config = {
            rail: {
                class: ''
            },
            cursor: {
                class: ''
            }
        };
        this._cursorMinWidth = 30;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
                if (object.cursorSize * this._rail.getBoundingClientRect().width < this._cursorMinWidth) {
                    this._cursor.style.width = this._cursorMinWidth.toString() + "px";
                }
                else {
                    this._cursor.style.width = (object.cursorSize * 100).toString() + "%";
                }
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.width = (0.94 * newValue).toString() + "px";
            console.log("width", (0.94 * newValue).toString());
            console.log(this._rail.getBoundingClientRect());
        }
    }
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
    }
    mouseDown(event) {
        event.preventDefault();
        let me = this;
        this.dimsX(event);
        this._rail.onmousemove = (event) => { me.dragX(event, me); };
        this._cursor.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseout = (event) => { me.stopDrag(me); };
    }
    dimsX(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = railDims.x;
        this._railMax = railDims.width + this._railMin;
        this._cursorWidth = cursorDims.width;
        this._mouseCursorLeftOffset = event.x - cursorDims.x;
        this._mouseCursorRightOffset = cursorDims.width - this._mouseCursorLeftOffset;
    }
    dragX(event, elem) {
        event.preventDefault();
        if ((event.clientX - elem._mouseCursorLeftOffset) >= elem._railMin && (event.clientX + elem._mouseCursorRightOffset) <= elem._railMax) {
            let v = event.clientX - elem._rail.offsetLeft - elem._mouseCursorLeftOffset;
            v = v < 0 ? 0 : v;
            elem._cursor.style.left = v + "px";
            let value = ((v) / ((this._railMax - this._railMin) - this._cursorWidth)) * (this.maxValue - this.minValue) + this.minValue;
            this.xSliderValueChanged.emit({ sliderValue: value });
        }
    }
    stopDrag(elem) {
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    yWheel(event) {
        event.preventDefault();
    }
    render() {
        return (h("div", { id: "rail", class: 'rail ' + this._config.rail.class, onWheel: (event) => this.xWheel(event) },
            h("div", { id: "cursor", class: 'cursor ' + this._config.cursor.class, onMouseDown: (event) => this.mouseDown(event) })));
    }
    static get is() { return "quantum-horizontal-zoom-slider"; }
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
    static get style() { return ".rail[data-quantum-horizontal-zoom-slider]{\n  position: relative;\n  background: grey;\n  opacity: 0.7;\n  float: right;\n  \n  left: 0;\n  height: 20px;\n  margin: 0px 0px 0px 0px;\n  border: 1px solid black;\n  border-radius: 6px;\n  padding: 0px 1px 1px 0px ;\n}\n.rail[data-quantum-horizontal-zoom-slider]:hover{\n  opacity: 1;\n}\n.cursor[data-quantum-horizontal-zoom-slider]{\n  background: red;\n  position: relative;\n  cursor: move;\n  width: 100%;\n  height: 20px;\n  border: 1px solid black;\n  border-radius: 6px;\n  left: 0px;\n  -webkit-transition: left .01s;\n  transition: left .01s;\n}"; }
}

//import { start } from 'repl';
class QuantumVerticalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
        this._config = {
            rail: {
                class: ''
            },
            cursor: {
                class: ''
            }
        };
        this._cursorMinHeight = 30;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.top = (object.cursorOffset * 100).toString() + "%";
                if (object.cursorSize * this._rail.getBoundingClientRect().height < this._cursorMinHeight) {
                    this._cursor.style.height = this._cursorMinHeight.toString() + "px";
                }
                else {
                    this._cursor.style.height = (object.cursorSize * 100).toString() + "%";
                }
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.height = (0.97 * newValue).toString() + "px";
            console.log("width", (0.94 * newValue).toString());
            console.log(this._rail.getBoundingClientRect());
        }
    }
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
    }
    mouseDown(event) {
        console.log("min et max", this.minValue, this.maxValue);
        event.preventDefault();
        let me = this;
        //this._rail.addEventListener("mousemove", event => { me.drag(event, me) });
        //this._cursor.addEventListener("mouseup", event => { me.stopDrag(me) });
        //this._rail.addEventListener("mouseout", event => { me.stopDrag(me) });
        //this._rail.addEventListener("mouseup", event => { me.stopDrag(me) });
        this.dimsY(event);
        this._rail.onmousemove = (event) => { me.dragY(event, me); };
        this._cursor.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseup = (event) => { me.stopDrag(me); };
        this._rail.onmouseout = (event) => { me.stopDrag(me); };
    }
    dimsY(event) {
        let railDims = this._rail.getBoundingClientRect();
        let cursorDims = this._cursor.getBoundingClientRect();
        this._railMin = this._rail.offsetTop;
        this._railMax = railDims.height + this._rail.offsetTop;
        this._cursorHeight = cursorDims.height;
        //this._mouseCursorTopOffset = cursorDims.y + cursorDims.height - event.y;
        this._mouseCursorTopOffset = event.pageY - this._rail.offsetTop - this._cursor.offsetTop;
        this._mouseCursorBottomOffset = cursorDims.height - this._mouseCursorTopOffset;
    }
    dragY(event, elem) {
        event.preventDefault();
        if ((event.pageY - elem._mouseCursorTopOffset) >= elem._railMin && (event.pageY + elem._mouseCursorBottomOffset) <= elem._railMax) {
            //let v = (elem._railMin - elem._railMax) - (event.y - elem._railMax) - elem._mouseCursorLeftOffset;
            let v = event.pageY - elem._rail.offsetTop - elem._mouseCursorTopOffset;
            v = v < 0 ? 0 : v;
            elem._cursor.style.top = v + "px";
            //let value = (((this._railMax - this._railMin) - this._cursorHeight - v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
            let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
            value = (this.maxValue - this.minValue) - value;
            this.ySliderValueChanged.emit({ sliderValue: value });
            console.log("V", v);
            console.log(value);
        }
    }
    stopDrag(elem) {
        //elem._rail.removeEventListener("mousemove", event => { elem.drag(event, elem) });
        //elem._cursor.removeEventListener("mouseup", event => { elem.stopDrag(elem) });
        //elem._rail.removeEventListener("mouseup", event => { elem.stopDrag(elem) });
        //elem._rail.removeEventListener("mouseout", event => { elem.stopDrag(elem) });
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
    }
    yWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        /*
        let railHalfWidth = (railDims.x + railDims.width - this._rail.offsetLeft) / 2;
        let mouseRailPosition = event.x - this._rail.offsetLeft;
        let diff = mouseRailPosition - railHalfWidth;
        let coef = diff / railHalfWidth;
        */
        //let railWidth = railDims.x + railDims.width;
        let coef = (event.pageY - this._rail.offsetTop) / railDims.height;
        this.yZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    render() {
        return (h("div", { id: "rail", class: 'rail ' + this._config.rail.class, onWheel: (event) => this.yWheel(event) },
            h("div", { id: "cursor", class: 'cursor ' + this._config.cursor.class, onMouseDown: (event) => this.mouseDown(event) })));
    }
    static get is() { return "quantum-vertical-zoom-slider"; }
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
        "height": {
            "type": Number,
            "attr": "height",
            "watchCallbacks": ["initSize"]
        },
        "maxValue": {
            "type": Number,
            "attr": "max-value"
        },
        "minValue": {
            "type": Number,
            "attr": "min-value"
        }
    }; }
    static get events() { return [{
            "name": "ySliderValueChanged",
            "method": "ySliderValueChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "yZoom",
            "method": "yZoom",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".rail[data-quantum-vertical-zoom-slider]{\n  position: absolute;\n  background: grey;\n  opacity: 0.7;\n  width: 20px;\n  \n  margin: 0px 0px 20px 0px;\n  border: 1px solid black;\n  border-radius: 6px;\n  padding: 0px 0px 0px 0px ;\n}\n\n.rail[data-quantum-vertical-zoom-slider]:hover{\n  opacity: 1;\n}\n\n.cursor[data-quantum-vertical-zoom-slider]{\n  background: red;\n  position: relative;\n  cursor: move;\n  width: 20px;\n  height: 100%;\n  border: 1px solid black;\n  border-radius: 6px;\n  \n  -webkit-transition: top .01s;\n  transition: top .01s;\n}"; }
}

export { QuantumChart, QuantumHorizontalZoomSlider, QuantumVerticalZoomSlider };
