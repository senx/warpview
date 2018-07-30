/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-7dbf784a.js", ["exports", "./chunk-d9eae628.js", "./chunk-e262070a.js"], function (t, e, i) { var a = window.quantumviz.h; t.QuantumChart = /** @class */ (function () {
    function QuantumChart() {
        this.alone = !0, this.unit = "", this.type = "line", this.chartTitle = "", this.responsive = !1, this.showLegend = !1, this.data = "[]", this.hiddenData = "[]", this.options = "{}", this.width = "", this.height = "", this.config = "{}", this.xView = "{}", this.yView = "{}", this._mapIndex = {}, this._xSlider = { element: null, min: 0, max: 0 }, this._ySlider = { element: null, min: 0, max: 0 }, this._config = { rail: { class: "" }, cursor: { class: "" } };
    }
    QuantumChart.prototype.redraw = function (t, e) { e !== t && this.drawChart(); };
    QuantumChart.prototype.changeScale = function (t, e) { if (e !== t) {
        var e_1 = JSON.parse(t);
        "timestamp" === e_1.time.timeMode ? (this._chart.options.scales.xAxes[0].time.stepSize = e_1.time.stepSize, this._chart.options.scales.xAxes[0].time.unit = e_1.time.unit, this._chart.options.scales.xAxes[0].time.displayFormats.millisecond = e_1.time.displayFormats, this._chart.update()) : (this._chart.options.scales.xAxes[0].time.stepSize = e_1.time.stepSize, this._chart.options.scales.xAxes[0].time.unit = e_1.time.unit, this._chart.update());
    } };
    QuantumChart.prototype.hideData = function (t, e) {
        var _this = this;
        if (e !== t) {
            var e_2 = i.GTSLib.cleanArray(JSON.parse(t));
            Object.keys(this._mapIndex).forEach(function (t) { _this._chart.getDatasetMeta(_this._mapIndex[t]).hidden = !!e_2.find(function (e) { return e === t; }); }), this._chart.update();
        }
    };
    QuantumChart.prototype.changeXView = function () { var t = JSON.parse(this.xView); this._chart.options.scales.xAxes[0].time.min = e.moment(t.min, "x"), this._chart.options.scales.xAxes[0].time.max = e.moment(t.max, "x"), this._chart.update(); };
    QuantumChart.prototype.changeYView = function () { var t = JSON.parse(this.yView); this._chart.options.scales.yAxes[0].ticks.min = t.min, this._chart.options.scales.yAxes[0].ticks.max = t.max, this._chart.update(); };
    QuantumChart.prototype.drawChart = function () { var t = this.el.shadowRoot.querySelector("#myChart"), i = JSON.parse(this.data); if (!i)
        return; var a = this.gtsToData(i); var s = this, n = { animation: !1, legend: { display: !1 }, tooltips: { mode: "x", position: "nearest", custom: function (t) { t.opacity > 0 ? s.pointHover.emit({ x: t.dataPoints[0].x + 15, y: this._eventPosition.y }) : s.pointHover.emit({ x: -100, y: this._eventPosition.y }); } }, scales: { xAxes: [{ time: { min: e.moment(this.timeMin ? this.timeMin : a.ticks[0], "x"), max: e.moment(this.timeMax ? this.timeMax : a.ticks[a.ticks.length - 1], "x"), unit: "day" }, type: "time" }], yAxes: [{ afterFit: function (t) { t.width = 100; }, scaleLabel: { display: !0, labelString: this.unit } }] }, responsive: this.responsive, zoom: { enabled: !0, drag: !1, sensitivity: .5, mode: "x" } }; "spline" === this.type && (n.elements = { line: { lineTension: 0 } }), "area" === this.type && (n.elements = { line: { fill: "start" } }), this._chart = new e.Chart(t, { type: "bar" === this.type ? this.type : "line", data: { labels: a.ticks, datasets: a.datasets }, options: n }); var r = [], h = []; if (a.datasets.forEach(function (t) { var e = Math.max.apply(Math, t.data); e && e != 1 / 0 && r.push(e); }), a.datasets.forEach(function (t) { var e = Math.min.apply(Math, t.data); (0 == e || e && e != 1 / 0) && h.push(e); }), this._ySlider.min = Math.min.apply(Math, h), this._ySlider.max = 1.05 * Math.max.apply(Math, r), this._chart.options.scales.yAxes[0].ticks.min = this._ySlider.min, this._chart.options.scales.yAxes[0].ticks.max = this._ySlider.max, this._chart.update(), this._xSlider.min = a.ticks[0], this._xSlider.max = a.ticks[a.ticks.length - 1], this.alone)
        console.log("Not alone");
    else {
        console.log("Alone");
        var t_1 = { xMin: a.ticks[0], xMax: a.ticks[a.ticks.length - 1], yMin: Math.min.apply(Math, h), yMax: 1.05 * Math.max.apply(Math, r) };
        this.chartInfos.emit(t_1);
    } };
    QuantumChart.prototype.xSliderInit = function () { var t = this.el.shadowRoot.querySelector("#xSlider"); t.setAttribute("min-value", this._xSlider.min.toString()), t.setAttribute("max-value", this._xSlider.max.toString()), t.setAttribute("width", this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().width.toString()), this._xSlider.element = t; };
    QuantumChart.prototype.ySliderInit = function () { var t = this.el.shadowRoot.querySelector("#ySlider"); t.setAttribute("min-value", this._ySlider.min.toString()), t.setAttribute("max-value", this._ySlider.max.toString()), t.setAttribute("height", this.el.shadowRoot.querySelector("#myChart").getBoundingClientRect().height.toString()), this._ySlider.element = t; };
    QuantumChart.prototype.gtsToData = function (t) {
        var _this = this;
        var e = [], a = [], s = 0;
        if (t)
            return t.forEach(function (t) { t.gts && (t.gts = i.GTSLib.flatDeep(t.gts), t.gts.forEach(function (n, r) { var h = []; if (n.v) {
                n.v.forEach(function (t) { a.push(t[0] / 1e3), h.push(t[t.length - 1]); });
                var o = i.GTSLib.getColor(r);
                t.params && t.params[r] && t.params[r].color && (o = t.params[r].color);
                var l = i.GTSLib.serializeGtsMetadata(n);
                _this._mapIndex[l] = s, t.params && t.params[r] && t.params[r].key && (l = t.params[r].key);
                var c = { label: l, data: h, pointRadius: 1, fill: !1, steppedLine: _this.isStepped(), borderColor: o, borderWidth: 1, backgroundColor: i.GTSLib.transparentize(o, .5) };
                if (t.params && t.params[r] && t.params[r].interpolate)
                    switch (t.params[r].interpolate) {
                        case "line":
                            c.lineTension = 0;
                            break;
                        case "spline": break;
                        case "area": c.fill = !0;
                    }
                e.push(c), s++;
            } })); }), { datasets: e, ticks: i.GTSLib.unique(a) };
    };
    QuantumChart.prototype.isStepped = function () { return !!this.type.startsWith("step") && this.type.replace("step-", ""); };
    QuantumChart.prototype.componentWillLoad = function () { this._config = i.GTSLib.mergeDeep(this._config, JSON.parse(this.config)); };
    QuantumChart.prototype.componentDidLoad = function () { this.drawChart(); };
    QuantumChart.prototype.render = function () { return a("div", null, a("h1", null, this.chartTitle), a("div", { class: "chart-container" }, this.responsive ? a("canvas", { id: "myChart" }) : a("canvas", { id: "myChart", width: this.width, height: this.height }))); };
    Object.defineProperty(QuantumChart, "is", {
        get: function () { return "quantum-chart"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumChart, "encapsulation", {
        get: function () { return "shadow"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumChart, "properties", {
        get: function () { return { alone: { type: Boolean, attr: "alone" }, chartTitle: { type: String, attr: "chart-title" }, config: { type: String, attr: "config" }, data: { type: String, attr: "data", watchCallbacks: ["redraw"] }, el: { elementRef: !0 }, height: { type: String, attr: "height" }, hiddenData: { type: String, attr: "hidden-data", watchCallbacks: ["hideData"] }, options: { type: String, attr: "options", watchCallbacks: ["changeScale"] }, responsive: { type: Boolean, attr: "responsive" }, showLegend: { type: Boolean, attr: "show-legend" }, timeMax: { type: Number, attr: "time-max" }, timeMin: { type: Number, attr: "time-min" }, type: { type: String, attr: "type" }, unit: { type: String, attr: "unit" }, width: { type: String, attr: "width" }, xView: { type: String, attr: "x-view", watchCallbacks: ["changeXView"] }, yView: { type: String, attr: "y-view", watchCallbacks: ["changeYView"] } }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumChart, "events", {
        get: function () { return [{ name: "pointHover", method: "pointHover", bubbles: !0, cancelable: !0, composed: !0 }, { name: "boundsDidChange", method: "boundsDidChange", bubbles: !0, cancelable: !0, composed: !0 }, { name: "chartInfos", method: "chartInfos", bubbles: !0, cancelable: !0, composed: !0 }]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumChart, "style", {
        get: function () { return "/**style-placeholder:quantum-chart:**/"; },
        enumerable: true,
        configurable: true
    });
    return QuantumChart;
}()); });
