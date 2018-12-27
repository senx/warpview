import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewImage {
    constructor() {
        this.imageTitle = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewImage);
        this._options = new Param();
    }
    onResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
            this.drawChart();
        }, 250);
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
        if (!this.data)
            return;
        let gts = this.data;
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
            }
        }
        if (gts instanceof DataModel || gts.hasOwnProperty('data')) {
            if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
                this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
                this.toDisplay.push(gts.data[0]);
            }
            else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
                this.toDisplay.push(gts.data);
            }
        }
        else {
            if (GTSLib.isArray(gts)) {
                gts.forEach(d => {
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
                h("img", { src: img, class: "responsive", alt: "Result" }))))
            :
                h("warp-view-spinner", null));
    }
    static get is() { return "warp-view-image"; }
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
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-image:**/"; }
}
