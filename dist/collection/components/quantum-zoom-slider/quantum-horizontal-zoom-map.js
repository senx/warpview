import Draggabilly from "draggabilly";
export class QuantumHorizontalZoomMap {
    constructor() {
        this.cursorSize = "{}";
        this.config = "{}";
        this._cursorMinWidth = 30;
        this.lastPos = 0;
    }
    changeCursorSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            let object = JSON.parse(newValue);
            if (object.cursorOffset + object.cursorSize <= 100) {
                this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
                window.requestAnimationFrame(() => {
                    if (object.cursorSize * this._rail.getBoundingClientRect().width <
                        this._cursorMinWidth) {
                        this._cursor.style.width = this._cursorMinWidth.toString() + "px";
                    }
                    else {
                        this._cursor.style.width =
                            (object.cursorSize * 100).toString() + "%";
                    }
                });
            }
        }
    }
    initSize(newValue, oldValue) {
        if (oldValue !== newValue) {
            this._rail.style.width = (0.94 * newValue).toString() + "px";
            this._img.style.width = (newValue + 18).toString() + "px";
        }
    }
    componentWillLoad() {
        //this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    }
    componentDidLoad() {
        this._rail = this.el.shadowRoot.querySelector("#rail");
        this._cursor = this.el.shadowRoot.querySelector("#cursor");
        this._img = this.el.shadowRoot.querySelector("#img");
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
        this._mouseCursorLeftOffset =
            event.pageX - this._cursor.offsetLeft - this._rail.offsetLeft;
        this._mouseCursorRightOffset =
            cursorDims.width - this._mouseCursorLeftOffset;
    }
    xWheel(event) {
        event.preventDefault();
        let railDims = this._rail.getBoundingClientRect();
        let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
        this.xZoom.emit({ zoomValue: { coef: coef, zoomType: event.deltaY * -1 } });
    }
    positionClick(event) {
        event.preventDefault();
        if (event.pageX < this._railMin + this._cursor.offsetLeft ||
            event.pageX > this._railMin + this._cursor.offsetLeft + this._cursorWidth) {
            this.dimsX(event);
            let halfCursorWidth = this._cursorWidth / 2;
            let v;
            if (event.pageX - halfCursorWidth < this._rail.offsetLeft) {
                v = 0;
                this._cursor.style.left = "1px";
            }
            else if (event.pageX + halfCursorWidth > this._railMax) {
                v = this._railMax - this._railMin - this._cursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            else {
                v = event.pageX - this._railMin - halfCursorWidth;
                this._cursor.style.left = v.toString() + "px";
            }
            let value = (v / (this._railMax - this._railMin - this._cursorWidth)) *
                (this.maxValue - this.minValue) +
                this.minValue;
            this.xSliderValueChanged.emit({ sliderValue: value });
        }
    }
    render() {
        return (h("div", { id: "rail", onWheel: event => this.xWheel(event), onMouseUp: event => this.positionClick(event) },
            h("div", { id: "cursor" }),
            h("img", { id: "img", src: this.img })));
    }
    static get is() { return "quantum-horizontal-zoom-map"; }
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
        "img": {
            "type": String,
            "attr": "img"
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
    static get style() { return "/**style-placeholder:quantum-horizontal-zoom-map:**/"; }
}
