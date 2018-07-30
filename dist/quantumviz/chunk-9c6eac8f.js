/*! Built with http://stenciljs.com */
const { h } = window.quantumviz;

import { a as GTSLib } from './chunk-357e00db.js';

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
            console.log("width", this._rail.style.width);
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
        if ((event.clientX - elem._mouseCursorLeftOffset) >= elem._railMin + 1 && (event.clientX + elem._mouseCursorRightOffset) <= elem._railMax - 1) {
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
    static get style() { return "/**style-placeholder:quantum-horizontal-zoom-slider:**/"; }
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
            console.log("height", this._rail.style.height);
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
        this._mouseCursorTopOffset = event.pageY - this._rail.offsetTop - this._cursor.offsetTop;
        this._mouseCursorBottomOffset = cursorDims.height - this._mouseCursorTopOffset;
    }
    dragY(event, elem) {
        event.preventDefault();
        if ((event.pageY - elem._mouseCursorTopOffset) >= elem._railMin + 1 && (event.pageY + elem._mouseCursorBottomOffset) <= elem._railMax - 1) {
            let v = event.pageY - elem._rail.offsetTop - elem._mouseCursorTopOffset;
            v = v < 0 ? 0 : v;
            elem._cursor.style.top = v + "px";
            let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
            value = (this.maxValue - this.minValue) - value;
            this.ySliderValueChanged.emit({ sliderValue: value });
        }
    }
    stopDrag(elem) {
        elem._rail.onmouseup = null;
        elem._rail.onmousemove = null;
        elem._cursor.onmouseup = null;
        elem._rail.onmouseout = null;
    }
    yWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
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
    static get style() { return "/**style-placeholder:quantum-vertical-zoom-slider:**/"; }
}

export { QuantumHorizontalZoomSlider as a, QuantumVerticalZoomSlider as b };
