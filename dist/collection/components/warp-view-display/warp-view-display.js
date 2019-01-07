import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewDisplay {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.debug = false;
        this.toDisplay = '';
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
        let gts = this.data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            this.toDisplay = GTSLib.isArray(gts.data) ? gts.data[0] : gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        }
        else {
            this.toDisplay = GTSLib.isArray(gts) ? gts[0] : gts;
        }
        this.LOG.debug(['drawChart'], [gts, this.toDisplay]);
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
    componentWillLoad() {
        this.LOG = new Logger(WarpViewDisplay, this.debug);
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad'], this._options);
        this.drawChart();
    }
    render() {
        return h("div", null, this.toDisplay && this.toDisplay !== '' ?
            h("div", { class: "chart-container", id: "#wrapper" },
                h("div", { style: this.getStyle() },
                    h("div", { class: "value" },
                        this.toDisplay + '',
                        h("small", null, this.unit))))
            :
                h("warp-view-spinner", null));
    }
    static get is() { return "warp-view-display"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
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
    static get style() { return "/**style-placeholder:warp-view-display:**/"; }
}
