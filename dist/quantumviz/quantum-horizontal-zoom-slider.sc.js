/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as Draggabilly } from './chunk-0c767570.js';
import './chunk-6133ee7c.js';

class QuantumHorizontalZoomSlider {
    constructor() {
        this.cursorSize = "{}";
        this.config = '{}';
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
        }
    }
    componentWillLoad() {
        //this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
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
        this._mouseCursorLeftOffset = event.pageX - this._cursor.offsetLeft - this._rail.offsetLeft;
        this._mouseCursorRightOffset = cursorDims.width - this._mouseCursorLeftOffset;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    render() {
        return (h("div", { id: "rail", onWheel: (event) => this.xWheel(event) },
            h("div", { id: "cursor" })));
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
    static get style() { return "[data-quantum-horizontal-zoom-slider-host]   #rail[data-quantum-horizontal-zoom-slider] {\n  position: relative;\n  background-color: var(--quantum-bg-rail-color, grey);\n  opacity: 0.7;\n  height: 20px;\n  border: 1px solid var(--quantum-border-rail-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  padding: 0 0 0 0;\n  float: right;\n  margin: 0 15px 0 0; }\n\n[data-quantum-horizontal-zoom-slider-host]   #rail[data-quantum-horizontal-zoom-slider]:hover {\n  opacity: 1; }\n\n[data-quantum-horizontal-zoom-slider-host]   #cursor[data-quantum-horizontal-zoom-slider] {\n  background-color: var(--quantum-bg-cursor-color, red);\n  position: relative;\n  cursor: move;\n  width: 100%;\n  height: 20px;\n  border: 1px solid var(--quantum-border-cursor-color, black);\n  border-radius: var(--quantum-border-radius, 6px);\n  -webkit-transition: left .01s;\n  transition: left .01s; }"; }
}

export { QuantumHorizontalZoomSlider };
