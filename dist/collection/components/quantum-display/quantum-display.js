import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";
/**
 * Display component
 */
export class QuantumDisplay {
    constructor() {
        this.unit = '';
        this.displayTitle = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(QuantumDisplay);
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
        if (this.data instanceof DataModel) {
            this.toDisplay = GTSLib.isArray(this.data.data) ? this.data.data[0] : this.data.data;
        }
        else {
            this.toDisplay = GTSLib.isArray(this.data) ? this.data[0] : this.data;
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
        return h("div", null,
            h("h1", null, this.displayTitle),
            this.toDisplay && this.toDisplay !== '' ?
                h("div", { class: "chart-container", id: "#wrapper" },
                    h("div", { style: this.getStyle() },
                        h("div", { class: "value" },
                            this.toDisplay,
                            h("small", null, this.unit))))
                :
                    h("quantum-spinner", null));
    }
    static get is() { return "quantum-display"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "displayTitle": {
            "type": String,
            "attr": "display-title"
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
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
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/**style-placeholder:quantum-display:**/"; }
}
