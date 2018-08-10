export class QuantumChartZoom {
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
    xSliderInit() {
        this._slider.x.width = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width;
    }
    ySliderInit() {
        this._slider.y.height = this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height;
    }
    componentDidLoad() {
        this.xSliderInit();
        this.ySliderInit();
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
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMinView, max: this._chart.xMaxView } });
        this.wc.forceUpdate();
    }
    yZoomListener(event) {
        let yMin = this._chart.yMinView;
        let yMax = this._chart.yMaxView;
        let diff = yMax - yMin;
        if (event.detail.zoomValue.zoomType > 0) {
            yMin = yMin + 0.1 * diff * (1 - event.detail.zoomValue.coef);
            yMax = yMax - 0.1 * diff * event.detail.zoomValue.coef;
        }
        else {
            yMin = yMin - 0.15 * diff * (1 - event.detail.zoomValue.coef);
            yMax = yMax + 0.15 * diff * event.detail.zoomValue.coef;
        }
        yMin = yMin < this._chart.yMin ? this._chart.yMin : yMin;
        yMax = yMax > this._chart.yMax ? this._chart.yMax : yMax;
        this._chart.yMinView = yMin;
        this._chart.yMaxView = yMax;
        this._yView = JSON.stringify({ min: this._chart.yMinView, max: this._chart.yMaxView });
        diff = this._chart.yMaxView - this._chart.yMinView;
        this._slider.y.max = this._chart.yMax - diff;
        let cursorSize = diff / (this._chart.yMax - this._chart.yMin);
        let cursorOffset = (this._chart.yMax - this._chart.yMaxView) / (this._chart.yMax - this._chart.yMin);
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: cursorSize, cursorOffset: cursorOffset });
        this.wc.forceUpdate();
    }
    xSliderListener(event) {
        let offset = event.detail.sliderValue - this._chart.xMinView;
        this._chart.xMinView += offset;
        this._chart.xMaxView += offset;
        this._xView = JSON.stringify({ min: this._chart.xMinView, max: this._chart.xMaxView });
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMinView, max: this._chart.xMaxView } });
        this.wc.forceUpdate();
    }
    ySliderListener(event) {
        let offset = event.detail.sliderValue - this._chart.yMinView;
        this._chart.yMinView += offset;
        this._chart.yMaxView += offset;
        this._yView = JSON.stringify({ min: this._chart.yMinView, max: this._chart.yMaxView });
        this.wc.forceUpdate();
    }
    zoomReset() {
        this._chart.xMinView = this._chart.xMin;
        this._chart.xMaxView = this._chart.xMax;
        this._chart.yMinView = this._chart.yMin;
        this._chart.yMaxView = this._chart.yMax;
        this._xView = JSON.stringify({ min: this._chart.xMin, max: this._chart.xMax });
        this._yView = JSON.stringify({ min: this._chart.yMin, max: this._chart.yMax });
        this._slider.x.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        this._slider.y.cursorSize = JSON.stringify({ cursorSize: 1, cursorOffset: 0 });
        this.boundsDidChange.emit({ bounds: { min: this._chart.xMin, max: this._chart.xMax } });
        this.wc.forceUpdate();
    }
    render() {
        return (h("div", { class: "wrapper" },
            h("quantum-vertical-zoom-slider", { height: this._slider.y.height, id: "ySlider", "min-value": this._chart.yMin, "max-value": this._slider.y.max, cursorSize: this._slider.y.cursorSize }),
            h("quantum-chart", { id: "myChart", alone: false, unit: this.unit, type: this.type, chartTitle: this.chartTitle, responsive: this.responsive, "show-legend": this.showLegend, data: this.data, hiddenData: this.hiddenData, options: this._options, width: this.width, height: this.height, timeMin: this.timeMin, timeMax: this.timeMax, xView: this._xView, yView: this._yView }),
            h("button", { id: "reset", type: "button", onClick: () => this.zoomReset() }, "Zoom Reset"),
<<<<<<< HEAD
            h("a", { href: this.png, download: "chart-" + Date.now() },
                h("button", { id: "download", type: "button" }, "Download Chart")),
=======
>>>>>>> f4af6fe528abb42130cf2c947228c27a4fbfb215
            h("div", { id: "xSliderWrapper" },
                h("quantum-horizontal-zoom-map", { id: "xSlider", img: this.png, width: this._slider.x.width, "min-value": this._chart.xMin, "max-value": this._slider.x.max, cursorSize: this._slider.x.cursorSize }))));
    }
    static get is() { return "quantum-chart-zoom"; }
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
    static get events() { return [{
            "name": "boundsDidChange",
            "method": "boundsDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "chartInfos",
            "method": "chartInfosWatcher"
        }, {
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
    static get style() { return "/**style-placeholder:quantum-chart-zoom:**/"; }
}
