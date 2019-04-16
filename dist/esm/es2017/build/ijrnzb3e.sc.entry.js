import { h } from '../warpview.core.js';

import { a as GTSLib, b as Logger } from './chunk-1029d1a2.js';
import { a as ColorLib } from './chunk-bf214dd1.js';

class GTS {
}

class WarpViewChip {
    constructor() {
        this.gtsFilter = 'x';
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.refreshCounter = 0;
        this._node = {
            selected: true,
            gts: GTS
        };
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue != newValue) {
            if (this.gtsFilter.slice(1) !== '') {
                this.setState(new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
            }
            else {
                this.setState(true);
            }
        }
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this._node = Object.assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
        this.LOG.debug(['hiddenData'], this._node);
        this.colorizeChip();
    }
    handleKeyDown(key) {
        if (key[0] === 'a') {
            this.setState(true);
        }
        if (key[0] === 'n') {
            this.setState(false);
        }
    }
    colorizeChip() {
        if (this.chip) {
            if (this._node.selected) {
                this.chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this._node.gts.id)));
                this.chip.style.setProperty('border-color', ColorLib.getColor(this._node.gts.id));
            }
            else {
                this.chip.style.setProperty('background-color', '#eeeeee');
            }
            this.refreshCounter++;
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewChip, this.debug);
        this._node = Object.assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    }
    componentDidLoad() {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        this.colorizeChip();
    }
    lastIndex(index, obj) {
        let array = this.toArray(obj);
        return (index === array.length - 1);
    }
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map(function (key) {
            return {
                name: key,
                value: obj[key],
            };
        });
    }
    switchPlotState(event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    }
    setState(state) {
        this._node = Object.assign({}, this._node, { selected: state, label: GTSLib.serializeGtsMetadata(this._node.gts) });
        this.LOG.debug(['switchPlotState'], this._node);
        this.colorizeChip();
        this.warpViewSelectedGTS.emit(this._node);
    }
    render() {
        return h("div", null, this._node && this._node.gts && this._node.gts.l ?
            h("span", { onClick: (event) => this.switchPlotState(event) },
                h("i", { class: "normal", ref: el => this.chip = el }),
                h("span", { class: "gtsInfo" },
                    h("span", { class: 'gts-classname' },
                        "\u00A0 ",
                        this._node.gts.c),
                    h("span", { class: 'gts-separator', innerHTML: '&lcub; ' }),
                    this.toArray(this._node.gts.l).map((label, index) => h("span", null,
                        h("span", { class: 'gts-labelname' }, label.name),
                        h("span", { class: 'gts-separator' }, "="),
                        h("span", { class: 'gts-labelvalue' }, label.value),
                        h("span", { hidden: this.lastIndex(index, this._node.gts.l) }, ", "))),
                    h("span", { class: 'gts-separator', innerHTML: ' &rcub;' }),
                    this.toArray(this._node.gts.a).length > 0
                        ? h("span", null,
                            h("span", { class: 'gts-separator', innerHTML: '&lcub; ' }),
                            this.toArray(this._node.gts.a).map((label, index) => h("span", null,
                                h("span", { class: 'gts-attrname' }, label.name),
                                h("span", { class: 'gts-separator' }, "="),
                                h("span", { class: 'gts-attrvalue' }, label.value),
                                h("span", { hidden: this.lastIndex(index, this._node.gts.a) }, ", "))),
                            h("span", { class: 'gts-separator', innerHTML: ' &rcub;' }))
                        : ''))
            : '');
    }
    static get is() { return "warp-view-chip"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed",
            "watchCallbacks": ["handleKeyDown"]
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "node": {
            "type": "Any",
            "attr": "node"
        },
        "refreshCounter": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".sc-warp-view-chip-h   .normal.sc-warp-view-chip, .sc-warp-view-chip-h   div.sc-warp-view-chip   span.sc-warp-view-chip{cursor:pointer}.sc-warp-view-chip-h   .normal.sc-warp-view-chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle}.sc-warp-view-chip-h   .gts-classname.sc-warp-view-chip{color:var(--gts-classname-font-color,#0074d9)}.sc-warp-view-chip-h   .gts-labelname.sc-warp-view-chip{color:var(--gts-labelname-font-color,#19a979)}.sc-warp-view-chip-h   .gts-attrname.sc-warp-view-chip{color:var(--gts-labelname-font-color,#ed4a7b)}.sc-warp-view-chip-h   .gts-separator.sc-warp-view-chip{color:var(--gts-separator-font-color,#bbb)}.sc-warp-view-chip-h   .gts-attrvalue.sc-warp-view-chip, .sc-warp-view-chip-h   .gts-labelvalue.sc-warp-view-chip{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}"; }
}

export { WarpViewChip };
