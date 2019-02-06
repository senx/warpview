import { DataModel } from "../../model/dataModel";
import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
export class WarpViewGtsPopup {
    constructor() {
        this.gtsList = new DataModel();
        this.maxToShow = 5;
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.displayed = [];
        this.current = 0;
        this._gts = [];
        this.modalOpenned = false;
    }
    onWarpViewModalOpen() {
        this.modalOpenned = true;
    }
    onWarpViewModalClose() {
        this.modalOpenned = false;
    }
    handleKeyDown(key) {
        if (key[0] === 's' && !this.modalOpenned) {
            this.showPopup();
        }
        else if (this.modalOpenned) {
            switch (key[0]) {
                case 'ArrowUp':
                case 'j':
                    this.current = Math.max(0, this.current - 1);
                    this.prepareData();
                    break;
                case 'ArrowDown':
                case 'k':
                    this.current = Math.min(this._gts.length - 1, this.current + 1);
                    this.prepareData();
                    break;
                case ' ':
                    this.warpViewSelectedGTS.emit({
                        gts: this._gts[this.current],
                        selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                    });
                    break;
                default:
                    return true;
            }
        }
    }
    isOpened() {
        return this.modal.isOpened();
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.prepareData();
    }
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.prepareData();
    }
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    prepareData() {
        if (this.gtsList && this.gtsList.data) {
            this._gts = GTSLib.flatDeep([this.gtsList.data]);
            this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewGtsPopup, this.debug);
    }
    componentDidLoad() {
        this.prepareData();
    }
    render() {
        return h("warp-view-modal", { kbdLastKeyPressed: this.kbdLastKeyPressed, modalTitle: "GTS Selector", ref: (el) => {
                this.modal = el;
            } },
            this.current > 0 ? h("div", { class: "up-arrow" }) : '',
            h("ul", null, this._gts.map((gts, index) => {
                return h("li", { class: this.current == index ? 'selected' : '', style: this.displayed.find(g => g.id === gts.id) ? {} : { 'display': 'none' } },
                    h("warp-view-chip", { node: { gts: gts }, name: gts.c, hiddenData: this.hiddenData }));
            })),
            this.current < this._gts.length - 1 ? h("div", { class: "down-arrow" }) : '');
    }
    static get is() { return "warp-view-gts-popup"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "current": {
            "state": true
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
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
        "isOpened": {
            "method": true
        },
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed",
            "watchCallbacks": ["handleKeyDown"]
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
            "name": "warpViewModalOpen",
            "method": "onWarpViewModalOpen"
        }, {
            "name": "warpViewModalClose",
            "method": "onWarpViewModalClose"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-gts-popup:**/"; }
}
