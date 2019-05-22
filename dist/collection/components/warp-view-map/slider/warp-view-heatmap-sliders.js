/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
export class WarpViewHeatmapSliders {
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
                    h("input", { type: "number", id: "radius", value: "25", min: "10", max: "50", onClick: (event) => this.radiusChanged(event.target) }),
                    h("br", null),
                    h("label", null, "Blur "),
                    h("input", { type: "number", id: "blur", value: "15", min: "10", max: "50", onClick: (event) => this.blurChanged(event.target) }),
                    h("br", null),
                    h("label", null, "Opacity "),
                    h("input", { type: "number", id: "opacity", value: "50", min: "10", max: "100", onClick: (event) => this.opacityChanged(event.target) })))));
    }
    static get is() { return "warp-view-heatmap-sliders"; }
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
