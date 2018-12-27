import { DataModel } from "../../model/dataModel";
import { ColorLib } from "../../utils/color-lib";
import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
export class WarpViewGtsPopup {
    constructor() {
        this.gtsList = new DataModel();
        this.maxToShow = 5;
        this.hiddenData = [];
        this.displayed = [];
        this.current = 0;
        this._gts = [];
        this.chips = [];
        this.LOG = new Logger(WarpViewGtsPopup);
    }
    handleKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', ' '].indexOf(e.key) > -1) {
            e.preventDefault();
            return false;
        }
    }
    handleKeyUp(ev) {
        this.LOG.debug(['document:keyup'], ev);
        switch (ev.key) {
            case 's':
                ev.preventDefault();
                this.showPopup();
                break;
            case 'ArrowUp':
                ev.preventDefault();
                this.current = Math.max(0, this.current - 1);
                this.prepareData();
                break;
            case 'ArrowDown':
                ev.preventDefault();
                this.current = Math.min(this._gts.length - 1, this.current + 1);
                this.prepareData();
                break;
            case ' ':
                ev.preventDefault();
                this.warpViewSelectedGTS.emit({
                    gts: this.displayed[this.current],
                    selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                });
                break;
            default:
                return true;
        }
        return false;
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.prepareData();
        this.colorizeChips();
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.prepareData();
        }
    }
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    prepareData() {
        if (this.gtsList) {
            this._gts = GTSLib.flatDeep([this.gtsList.data]);
            this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    colorizeChips() {
        this.chips.map((chip, index) => {
            if (this.hiddenData.indexOf(this.displayed[index].id) === -1) {
                chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this.displayed[index].id)));
                chip.style.setProperty('border-color', ColorLib.getColor(this.displayed[index].id));
            }
            else {
                chip.style.setProperty('background-color', '#eeeeee');
            }
        });
    }
    componentDidLoad() {
        this.prepareData();
    }
    render() {
        return h("warp-view-modal", { modalTitle: "GTS Selector", ref: (el) => {
                this.modal = el;
            } },
            this.current > 0 ? h("div", { class: "up-arrow" }) : '',
            h("ul", null, this._gts.map((gts, index) => gts
                ? this.displayed.find(g => g.id === gts.id)
                    ? h("li", { class: this.current === index ? 'selected' : '' },
                        h("div", { class: "round", ref: (el) => this.chips[index] = el, style: {
                                'background-color': ColorLib.transparentize(ColorLib.getColor(gts.id)),
                                'border-color': ColorLib.getColor(gts.id)
                            } }),
                        h("span", { innerHTML: GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts)) }))
                    : ''
                : '')),
            this.current < this._gts.length - 1 ? h("div", { class: "down-arrow" }) : '');
    }
    static get is() { return "warp-view-gts-popup"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "current": {
            "state": true
        },
        "displayed": {
            "state": true
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list",
            "watchCallbacks": ["onData"]
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "maxToShow": {
            "type": Number,
            "attr": "max-to-show"
        }
    }; }
    static get events() { return [{
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "document:keydown",
            "method": "handleKeyDown"
        }, {
            "name": "document:keyup",
            "method": "handleKeyUp"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-gts-popup:**/"; }
}
