import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";
/**
 * Display component
 */
export class QuantumImage {
    constructor() {
        this.imageTitle = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(QuantumImage);
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['onData'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this.LOG.debug(['drawChart'], [this.options, this._options]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
        this.toDisplay = [];
        if (this.data instanceof DataModel) {
            if (this.data.data && this.data.data.length > 0 && GTSLib.isEmbeddedImage(this.data.data[0])) {
                this.toDisplay.push(this.data.data[0]);
            }
            else if (this.data.data && GTSLib.isEmbeddedImage(this.data.data)) {
                this.toDisplay.push(this.data.data);
            }
        }
        else {
            if (GTSLib.isArray(this.data)) {
                this.data.forEach(d => {
                    if (GTSLib.isEmbeddedImage(d)) {
                        this.toDisplay.push(d);
                    }
                });
            }
        }
        this.LOG.debug(['drawChart'], [this.data, this.toDisplay]);
    }
    getStyle() {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad'], this._options);
        this.drawChart();
    }
    render() {
        return h("div", null, this.toDisplay ?
            h("div", { class: "chart-container", id: "#wrapper" }, this.toDisplay.map((img) => h("div", { style: this.getStyle() },
                h("img", { src: img, class: "responsive" }))))
            :
                h("quantum-spinner", null));
    }
    static get is() { return "quantum-image"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
        },
        "imageTitle": {
            "type": String,
            "attr": "image-title"
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-image:**/"; }
}
