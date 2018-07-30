/*! Built with http://stenciljs.com */
quantumviz.loadBundle("chunk-26d6cf12.js", ["exports", "./chunk-e262070a.js"], function (t, e) { var s = window.quantumviz.h; t.QuantumToggle = /** @class */ (function () {
    function QuantumToggle() {
        this.option = "{}", this.checked = !1, this.state = !1, this._option = { switchClass: "", switchLabelClass: "", switchHandleClass: "" };
    }
    QuantumToggle.prototype.componentWillLoad = function () { this._option = e.GTSLib.mergeDeep(this._option, JSON.parse(this.option)); };
    QuantumToggle.prototype.componentDidLoad = function () { };
    QuantumToggle.prototype.componentWillUpdate = function () { };
    QuantumToggle.prototype.componentDidUpdate = function () { };
    QuantumToggle.prototype.render = function () {
        var _this = this;
        return s("label", { class: "switch " + this._option.switchClass }, this.checked ? s("input", { type: "checkbox", class: "switch-input", checked: !0, onClick: function () { return _this.switched(); } }) : s("input", { type: "checkbox", class: "switch-input", onClick: function () { return _this.switched(); } }), s("span", { class: "switch-label " + this._option.switchLabelClass }), s("span", { class: "switch-handle " + this._option.switchHandleClass }));
    };
    QuantumToggle.prototype.switched = function () { this.state = !this.state, this.timeSwitched.emit({ state: this.state }); };
    QuantumToggle.prototype.switchedListener = function (t) { };
    Object.defineProperty(QuantumToggle, "is", {
        get: function () { return "quantum-toggle"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumToggle, "encapsulation", {
        get: function () { return "shadow"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumToggle, "properties", {
        get: function () { return { checked: { type: Boolean, attr: "checked" }, option: { type: String, attr: "option" }, state: { state: !0 } }; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumToggle, "events", {
        get: function () { return [{ name: "timeSwitched", method: "timeSwitched", bubbles: !0, cancelable: !0, composed: !0 }]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumToggle, "listeners", {
        get: function () { return [{ name: "timeSwitched", method: "switchedListener" }]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantumToggle, "style", {
        get: function () { return "/**style-placeholder:quantum-toggle:**/"; },
        enumerable: true,
        configurable: true
    });
    return QuantumToggle;
}()); });
