/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Chart } from './chunk-35f9f27a.js';
import { a as GTSLib } from './chunk-e737bf72.js';
import './chunk-ee323282.js';

class QuantumChart {
    constructor() {
        this.alone = true;
        this.unit = "";
        this.type = "line";
        this.chartTitle = "";
        this.responsive = false;
        this.showLegend = true;
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
        this._type = 'timestamp';
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
            console.log('changeScale', this._data);
            if (data.time.timeMode === "timestamp") {
                delete this._chart.options.scales.xAxes[0].type;
                //  this._chart.options.scales.xAxes[0].type = 'linear'
                this._type = 'timestamp';
                /*  this._chart.options.scales.xAxes[0].type = 'linear'
                  this._chart.options.scales.xAxes[0].linear = {
                    displayFormats: {
                      millisecond:  data.time.displayFormats
                    }
                  }
                  this._chart.options.scales.xAxes[0].linear.stepSize = data.time.stepSize;
                  this._chart.options.scales.xAxes[0].linear.unit = data.time.unit;*/
                /* this._chart.options.scales.xAxes[0].linear.min= moment(!!this.timeMin ? this.timeMin : gts.ticks[0], "x");
                   max: moment(
                   !!this.timeMax ? this.timeMax : gts.ticks[gts.ticks.length - 1],
                   "x"
                 )*/
                //   this._chart.options.scales.xAxes[0].time.stepSize = data.time.stepSize;
                //   this._chart.options.scales.xAxes[0].time.unit = data.time.unit;
                //   this._chart.options.scales.xAxes[0].time.displayFormats.millisecond =
                // data.time.displayFormats;
            }
            else {
                this._type = 'time';
                this._chart.options.scales.xAxes[0].type = 'time';
                //     this._chart.options.scales.xAxes[0].ticks.stepSize = data.time.stepSize;
                //    this._chart.options.scales.xAxes[0].ticks.unit = data.time.unit;
            }
            this._chart.update();
        }
    }
    hideData(newValue, oldValue) {
        if (oldValue !== newValue) {
            const hiddenData = GTSLib.cleanArray(JSON.parse(newValue));
            this._data = JSON.parse(this.data);
            if (!this._data)
                return;
            Object.keys(this._mapIndex).forEach(key => {
                this._chart.getDatasetMeta(this._mapIndex[key]).hidden = !!hiddenData.find(item => item === key);
                console.log(this._chart.getDatasetMeta(this._mapIndex[key]).dataset._children);
            });
            this._chart.update();
        }
    }
    changeXView() {
        return;
        /*  let xView = JSON.parse(this.xView);
          if (this._type === "timestamp") {
            this._chart.options.scales.xAxes[0].ticks.min = xView.min;
            this._chart.options.scales.xAxes[0].ticks.max = xView.max;
          } else {
            this._chart.options.scales.xAxes[0].ticks.min = moment(xView.min, "x");
            this._chart.options.scales.xAxes[0].ticks.max = moment(xView.max, "x");
          }
          console.log(xView);
          this._chart.update();*/
    }
    changeYView() {
        return;
        /*  let yView = JSON.parse(this.yView);
          this._chart.options.scales.yAxes[0].ticks.min = yView.min;
          this._chart.options.scales.yAxes[0].ticks.max = yView.max;
          this._chart.update();*/
    }
    buildGraph() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToData(this._data);
        const sortedTicks = gts.ticks.slice().sort(function (a, b) {
            return a - b;
        });
        console.log('buildGraph', gts, !!this.timeMin ? this.timeMin : sortedTicks[0]);
        //console.log("sortedTicks", sortedTicks);
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
                        ticks: {},
                        time: {
                        //min: moment(!!this.timeMin ? this.timeMin : sortedTicks[0], "x"),
                        //max: moment(!!this.timeMax ? this.timeMax : sortedTicks[gts.ticks.length - 1], "x"),
                        //unit: "day"
                        },
                    }
                ],
                yAxes: [
                    {
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
        if (this._type === "timestamp") {
            delete graphOpts.scales.xAxes[0].time;
            //graphOpts.scales.xAxes[0].type = "linear";
            graphOpts.scales.xAxes[0].ticks = {
            //    suggestedMin: !!this.timeMin ? this.timeMin : sortedTicks[0],
            //   suggestedMax: !!this.timeMax ? this.timeMax : sortedTicks[gts.ticks.length - 1],
            //    beginAtZero: false
            };
        }
        else {
            graphOpts.scales.xAxes[0].time = {
            // suggestedMin: moment(!!this.timeMin ? this.timeMin : sortedTicks[0], "x"),
            //  suggestedMax: moment(!!this.timeMax ? this.timeMax : sortedTicks[gts.ticks.length - 1], "x"),
            //  unit: "day"
            };
        }
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
        // this._chart.options.scales.yAxes[0].ticks.suggestedMin = this._ySlider.min;
        // this._chart.options.scales.yAxes[0].ticks.suggestedMax = this._ySlider.max;
        this._chart.update();
        this._xSlider.min = sortedTicks[0];
        this._xSlider.max = sortedTicks[sortedTicks.length - 1];
        if (!this.alone) {
            console.log("Alone", sortedTicks[0], sortedTicks[sortedTicks.length - 1]);
            let chartInfos = {
                xMin: sortedTicks[0],
                xMax: sortedTicks[sortedTicks.length - 1],
                yMin: Math.min(...minArray),
                yMax: Math.max(...maxArray) * 1.05
            };
            this.chartInfos.emit(chartInfos);
        }
        else {
            console.log("Not alone");
        }
    }
    drawChart() {
        //console.debug("[QuantumChart] drawChart", this.data);
        this._data = JSON.parse(this.data);
        if (!this._data)
            return;
        this.buildGraph();
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
                    let i = 0;
                    d.gts.forEach(g => {
                        let data = [];
                        if (g.v) {
                            g.v.forEach(d => {
                                ticks.push(d[0]);
                                data.push(d[d.length - 1]);
                            });
                            let color = GTSLib.getColor(pos);
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
                            i++;
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
    static get style() { return "quantum-chart .chart-container {\n  width: var(--quantum-chart-width, 100%);\n  height: var(--quantum-chart-height, 100%);\n  position: relative; }"; }
}

class QuantumMultiCharts {
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
        this._chart = {
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0,
            xMinView: 0,
            xMaxView: 0,
            yMinView: 0,
            yMaxView: 0
        };
        this._xView = "{}";
        this._yView = "{}";
        this._slider = {
            x: {
                element: null,
                width: 0,
                max: 0,
                cursorSize: "{}"
            },
            y: {
                element: null,
                height: 0,
                max: 0,
                cursorSize: "{}"
            }
        };
    }
    changeScale(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._options = newValue;
        }
    }
    chartInfosWatcher(event) {
        this._chart.xMin = event.detail.xMin;
        this._chart.xMinView = event.detail.xMin;
        this._chart.xMax = event.detail.xMax;
        this._slider.x.max = event.detail.xMax;
        this._chart.xMaxView = event.detail.xMax;
        this._chart.yMin = event.detail.yMin;
        this._chart.yMinView = event.detail.yMin;
        this._chart.yMax = event.detail.yMax;
        this._slider.y.max = event.detail.yMax;
        this._chart.yMaxView = event.detail.yMax;
    }
    dataParser() {
        let datasets = [];
        let data = JSON.parse(this.data);
        if (Array.isArray(data[0].gts) && data[0].gts.length == 1) {
            data[0].gts = data[0].gts[0];
            console.log(data[0].gts);
        }
        data[0].gts.forEach(d => {
            if (Array.isArray(d)) {
                let a = [];
                d.forEach((g) => {
                    if (GTSLib.isGts(g)) {
                        a.push(g);
                    }
                });
                if (a.length > 0) {
                    datasets.push(a);
                }
            }
            else if (GTSLib.isGts(d)) {
                datasets.push(d);
            }
        });
        console.log("dataset", datasets);
    }
    componentWillLoad() {
        this.dataParser();
    }
    xSliderInit() {
        this._slider.x.width = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width;
    }
    /*
      ySliderInit() {
        this._slider.y.height = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height;
      }
    */
    componentDidLoad() {
        this.xSliderInit();
        //this.ySliderInit();
        this.wc.forceUpdate();
        const chart = this.el.shadowRoot.querySelector("#myChart");
        this.png = chart.toBase64Image();
    }
    xZoomListener(event) {
        let xMin = this._chart.xMinView;
        let xMax = this._chart.xMaxView;
        let diff = xMax - xMin;
        if (event.detail.zoomValue.zoomType > 0) {
            xMin = xMin + 0.1 * diff * event.detail.zoomValue.coef;
            xMax = xMax - 0.1 * diff * (1 - event.detail.zoomValue.coef);
        }
        else {
            xMin = xMin - 0.15 * diff * event.detail.zoomValue.coef;
            xMax = xMax + 0.15 * diff * (1 - event.detail.zoomValue.coef);
        }
        xMin = xMin < this._chart.xMin ? this._chart.xMin : xMin;
        xMax = xMax > this._chart.xMax ? this._chart.xMax : xMax;
        this._chart.xMinView = xMin;
        this._chart.xMaxView = xMax;
        this._xView = JSON.stringify({ min: this._chart.xMinView, max: this._chart.xMaxView });
        diff = this._chart.xMaxView - this._chart.xMinView;
        this._slider.x.max = this._chart.xMax - diff;
        let cursorSize = diff / (this._chart.xMax - this._chart.xMin);
        let cursorOffset = (this._chart.xMinView - this._chart.xMin) / (this._chart.xMax - this._chart.xMin);
        this._slider.x.cursorSize = JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset });
        //this.boundsDidChange.emit({ bounds: { min: this._chart.xMinView, max: this._chart.xMaxView }});
        this.wc.forceUpdate();
    }
    /*
      @Listen("yZoom")
      yZoomListener(event: CustomEvent) {
        let yMin = this._chart.yMinView;
        let yMax = this._chart.yMaxView;
        let diff = yMax - yMin;
    
        if (event.detail.zoomValue.zoomType > 0) {
          yMin = yMin + 0.1 * diff * (1 - event.detail.zoomValue.coef);
          yMax = yMax - 0.1 * diff * event.detail.zoomValue.coef;
    
        } else {
          yMin = yMin - 0.15 * diff * (1 - event.detail.zoomValue.coef);
          yMax = yMax + 0.15 * diff * event.detail.zoomValue.coef;
        }
        yMin = yMin < this._chart.yMin ? this._chart.yMin : yMin;
        yMax = yMax > this._chart.yMax ? this._chart.yMax : yMax;
    
        this._chart.yMinView = yMin;
        this._chart.yMaxView = yMax;
    
        this._yView = JSON.stringify({min: this._chart.yMinView, max: this._chart.yMaxView});
    
        diff = this._chart.yMaxView - this._chart.yMinView;
        this._slider.y.max = this._chart.yMax - diff;
    
        let cursorSize = diff / (this._chart.yMax - this._chart.yMin);
        let cursorOffset = (this._chart.yMax - this._chart.yMaxView) / (this._chart.yMax - this._chart.yMin);
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset });
        this.wc.forceUpdate();
      }
    */
    xSliderListener(event) {
        let offset = event.detail.sliderValue - this._chart.xMinView;
        this._chart.xMinView += offset;
        this._chart.xMaxView += offset;
        this._xView = JSON.stringify({ min: this._chart.xMinView, max: this._chart.xMaxView });
        //this.boundsDidChange.emit({ bounds: {min: this._chart.xMinView, max: this._chart.xMaxView}});
        this.wc.forceUpdate();
    }
    /*
      @Listen("ySliderValueChanged")
      ySliderListener(event: CustomEvent) {
        let offset = event.detail.sliderValue - this._chart.yMinView;
        this._chart.yMinView += offset;
        this._chart.yMaxView += offset;
        this._yView = JSON.stringify({min: this._chart.yMinView, max: this._chart.yMaxView});
        this.wc.forceUpdate();
      }
    */
    zoomReset() {
        this._chart.xMinView = this._chart.xMin;
        this._chart.xMaxView = this._chart.xMax;
        this._chart.yMinView = this._chart.yMin;
        this._chart.yMaxView = this._chart.yMax;
        this._xView = JSON.stringify({ min: this._chart.xMin, max: this._chart.xMax });
        this._yView = JSON.stringify({ min: this._chart.yMin, max: this._chart.yMax });
        this._slider.x.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        //this.boundsDidChange.emit({ bounds: { min: this._chart.xMin, max: this._chart.xMax }});
        this.wc.forceUpdate();
    }
    render() {
        return (h("div", { class: "charts-container" },
            h("quantum-chart", { id: "myChart", alone: false, unit: this.unit, type: this.type, chartTitle: this.chartTitle, responsive: this.responsive, "show-legend": this.showLegend, data: this.data, hiddenData: this.hiddenData, options: this._options, width: this.width, height: this.height, timeMin: this.timeMin, timeMax: this.timeMax, xView: this._xView, yView: this._yView }),
            h("button", { id: "reset", type: "button", onClick: () => this.zoomReset() }, "Zoom Reset"),
            h("a", { href: this.png, download: "chart-" + Date.now() },
                h("button", { id: "download", type: "button" }, "Download Chart")),
            h("div", { id: "xSliderWrapper" },
                h("quantum-horizontal-zoom-map", { id: "xSlider", img: this.png, width: this._slider.x.width, "min-value": this._chart.xMin, "max-value": this._slider.x.max, cursorSize: this._slider.x.cursorSize }))));
    }
    static get is() { return "quantum-multi-charts"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "chartTitle": {
            "type": String,
            "attr": "chart-title"
        },
        "data": {
            "type": String,
            "attr": "data"
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
            "attr": "hidden-data"
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
        "wc": {
            "elementRef": true
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get listeners() { return [{
            "name": "chartInfos",
            "method": "chartInfosWatcher"
        }, {
            "name": "xZoom",
            "method": "xZoomListener"
        }, {
            "name": "xSliderValueChanged",
            "method": "xSliderListener"
        }]; }
    static get style() { return ":host {\n  /*\n  .chart-container {\n    width: var(--quantum-chart-width, 100%);\n    height: var(--quantum-chart-height, 100%);\n    position: relative;\n  }\n\n  .wrapper {\n    display: grid;\n    grid-template-columns: 30px auto;\n    grid-template-rows: auto 100px;\n    margin: 10px;\n  }\n\n  #ySlider {\n    margin-top: 25px;\n    grid-row: 1;\n    grid-column:1;\n  }\n\n  #xSliderWrapper {\n    grid-row: 2;\n    grid-column:2;\n\n    quantum-horizontal-zoom-map {\n      height: 100px;\n      width: 100%;\n      z-index: 10;\n    }\n  }\n\n  #myChart {\n    grid-row: 1;\n    grid-column:2;\n  }\n\n  #reset{\n    z-index: 10;\n    background-color: var(--quantum-reset-bg-color, greenyellow);\n    border-radius: var(--quantum-reset-border-radius, 0px);\n    border-color: var(--quantum-reset-border-color, black);\n    width: var(--quantum-reset-width, 10px);\n    height: var(--quantum-reset-height, 10px);\n  }\n  */ }"; }
}

export { QuantumChart, QuantumMultiCharts };
