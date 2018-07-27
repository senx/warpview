import Chart from "chart.js";
import { GTSLib } from "../../gts.lib";
//import 'chartjs-plugin-zoom';
import moment from "moment";
export class QuantumChart {
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
    static get style() { return "/**style-placeholder:quantum-chart:**/"; }
}
