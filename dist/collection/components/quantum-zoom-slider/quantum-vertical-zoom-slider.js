import { GTSLib } from "../../gts.lib";
export class QuantumVerticalZoomSlider {
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
        this._rail.onmousemove = (event) => {
            me.dragY(event, me);
        };
        this._cursor.onmouseup = (event) => {
            me.stopDrag(me);
        };
        this._rail.onmouseup = (event) => {
            me.stopDrag(me);
        };
        this._rail.onmouseout = (event) => {
            me.stopDrag(me);
        };
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
        return (h("div", { id: "rail", onWheel: (event) => this.yWheel(event) },
            h("div", { id: "cursor", onMouseDown: (event) => this.mouseDown(event) })));
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
