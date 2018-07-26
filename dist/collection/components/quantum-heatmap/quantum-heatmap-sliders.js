export class QuantumHeatmapSliders {
    radiusChanged(value) {
        this.heatRadiusDidChange.emit(value);
    }
    blurChanged(value) {
        this.heatBlurDidChange.emit(value);
    }
    opacityChanged(value) {
        this.heatOpacityDidChange.emit(value);
    }
    /*
      @Listen('radiusChange')
        radiusChangeListener(event: CustomEvent){
          _radius = this.el.shadowRoot.querySelector("#radius");
        }
    
      @Listen('blurChange')
        blurChangeListener(event: CustomEvent){
          _blur = this.el.shadowRoot.querySelector("#blur");
        }
    */
    componentWillLoad() {
    }
    componentDidLoad() {
    }
    render() {
        return (h("div", null,
            h("div", { class: "container" },
                h("div", { class: "options" },
                    h("label", null, "Radius "),
                    h("input", { type: "number", id: "radius", value: "20", min: "10", max: "50", onClick: (event) => this.radiusChanged(event.target) }),
                    h("br", null),
                    h("label", null, "Blur "),
                    h("input", { type: "number", id: "blur", value: "20", min: "10", max: "50", onClick: (event) => this.blurChanged(event.target) }),
                    h("br", null),
                    h("label", null, "Opacity "),
                    h("input", { type: "number", id: "opacity", value: "50", min: "10", max: "100", onClick: (event) => this.opacityChanged(event.target) })))));
    }
    static get is() { return "quantum-heatmap-sliders"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "blurValue": {
            "type": Number,
            "attr": "blur-value"
        },
        "el": {
            "elementRef": true
        },
        "maxBlurValue": {
            "type": Number,
            "attr": "max-blur-value"
        },
        "maxRadiusValue": {
            "type": Number,
            "attr": "max-radius-value"
        },
        "minBlurValue": {
            "type": Number,
            "attr": "min-blur-value"
        },
        "minRadiusValue": {
            "type": Number,
            "attr": "min-radius-value"
        },
        "radiusValue": {
            "type": Number,
            "attr": "radius-value"
        }
    }; }
    static get events() { return [{
            "name": "heatRadiusDidChange",
            "method": "heatRadiusDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "heatBlurDidChange",
            "method": "heatBlurDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "heatOpacityDidChange",
            "method": "heatOpacityDidChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}
