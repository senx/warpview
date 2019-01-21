import { h } from '../warpview.core.js';

import { b as GTSLib, c as deepEqual, d as Logger, e as Param, a as ChartLib } from './chunk-19843615.js';
import { a as ColorLib } from './chunk-bf214dd1.js';

class GTS {
}

class WarpViewChip {
    constructor() {
        this.gtsFilter = '';
        this.hiddenData = [];
        this.debug = false;
        this.ref = false;
        this._node = {
            selected: true,
            gts: GTS
        };
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            if (this.gtsFilter !== '') {
                this.setState(new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
            }
        }
    }
    onHideData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['hiddenData'], newValue);
            this._node = Object.assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['hiddenData'], this._node);
            this.colorizeChip();
        }
    }
    handleKeyDown(ev) {
        if (ev.key === 'a') {
            this.setState(true);
        }
        if (ev.key === 'n') {
            this.setState(false);
        }
    }
    colorizeChip() {
        if (this._node.selected) {
            this.chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this._node.gts.id)));
            this.chip.style.setProperty('border-color', ColorLib.getColor(this._node.gts.id));
        }
        else {
            this.chip.style.setProperty('background-color', '#eeeeee');
        }
        this.ref = !this.ref;
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewChip, this.debug);
        this._node = Object.assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    }
    componentDidLoad() {
        if (this.gtsFilter !== '' && new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
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
        "name": {
            "type": String,
            "attr": "name"
        },
        "node": {
            "type": "Any",
            "attr": "node"
        },
        "ref": {
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
    static get listeners() { return [{
            "name": "document:keyup",
            "method": "handleKeyDown"
        }]; }
    static get style() { return ".sc-warp-view-chip-h   .normal.sc-warp-view-chip, .sc-warp-view-chip-h   div.sc-warp-view-chip   span.sc-warp-view-chip{cursor:pointer}.sc-warp-view-chip-h   .normal.sc-warp-view-chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle}.sc-warp-view-chip-h   .gts-classname.sc-warp-view-chip{color:var(--gts-classname-font-color,#0074d9)}.sc-warp-view-chip-h   .gts-labelname.sc-warp-view-chip{color:var(--gts-labelname-font-color,#19a979)}.sc-warp-view-chip-h   .gts-attrname.sc-warp-view-chip{color:var(--gts-labelname-font-color,#ed4a7b)}.sc-warp-view-chip-h   .gts-separator.sc-warp-view-chip{color:var(--gts-separator-font-color,#bbb)}.sc-warp-view-chip-h   .gts-attrvalue.sc-warp-view-chip, .sc-warp-view-chip-h   .gts-labelvalue.sc-warp-view-chip{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}"; }
}

class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = '';
        this.options = new Param();
        this.hiddenData = [];
        this.debug = false;
        this.hide = false;
        this.gtsList = [];
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue, oldValue);
            this.doRender();
        }
    }
    onOptions(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['options'], newValue, oldValue);
            this.doRender();
            if (!!this._options.foldGTSTree && !this.hide) {
                this.foldAll();
            }
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['gtsFilter'], newValue);
            this.doRender();
        }
    }
    onHideData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['hiddenData'], newValue);
            this.doRender();
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewGtsTree, this.debug);
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad', 'data'], this.data);
        if (this.data) {
            this.doRender();
        }
        if (this._options.foldGTSTree !== undefined && !!this._options.foldGTSTree && !this.hide) {
            this.foldAll();
        }
    }
    doRender() {
        this.LOG.debug(['doRender', 'gtsList'], this.data);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        if (!this.data) {
            return;
        }
        let dataList = GTSLib.getData(this.data).data;
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.hide);
    }
    foldAll() {
        if (!this.root) {
            window.setTimeout(() => {
                this.foldAll();
            }, 100);
        }
        else {
            this.hide = true;
        }
    }
    toggleVisibility() {
        this.hide = !this.hide;
    }
    render() {
        return this.gtsList
            ? h("div", null,
                h("div", { class: "stack-level", onClick: () => this.toggleVisibility() },
                    h("span", { class: { 'expanded': !this.hide, 'collapsed': this.hide }, ref: el => this.root = el }),
                    " Stack"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, debug: this.debug, hiddenData: this.hiddenData, gtsFilter: this.gtsFilter }))
            : '';
    }
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
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
        "hide": {
            "state": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color,#000)}:host .stack-level+div{padding-left:25px}:host .expanded{background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==))}:host .collapsed,:host .expanded{padding:1px 10px;margin-right:5px;background-position:0;background-repeat:no-repeat}:host .collapsed{background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=))}"; }
}

class WarpViewTreeView {
    constructor() {
        this.branch = false;
        this.hidden = false;
        this.gtsFilter = '';
        this.hiddenData = [];
        this.debug = false;
        this.ref = false;
        this.hide = {};
    }
    toggleVisibility(event, index) {
        let el;
        if (event.currentTarget.id) {
            el = event.currentTarget;
        }
        else {
            el = event.currentTarget.previousElementSibling;
        }
        if (el.className === 'expanded') {
            el.className = 'collapsed';
            this.hide[index + ''] = true;
        }
        else {
            el.className = 'expanded';
            this.hide[index + ''] = false;
        }
        this.ref = !this.ref;
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.ref = !this.ref;
        }
    }
    onHideData(newValue, oldValue) {
        if (!deepEqual(newValue, oldValue)) {
            this.LOG.debug(['hiddenData'], newValue);
            this.ref = !this.ref;
        }
    }
    isHidden(index) {
        if (this.hide.hasOwnProperty(index + '')) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewTreeView, this.debug);
    }
    render() {
        return h("div", { class: "list" }, this.gtsList ? h("ul", null, this.gtsList.map((node, index) => (h("li", { hidden: this.hidden }, GTSLib.isGts(node)
            ? h("warp-view-chip", { node: { gts: node }, name: node.c, gtsFilter: this.gtsFilter, debug: this.debug, hiddenData: this.hiddenData })
            : h("span", null, node
                ? h("div", null,
                    this.branch
                        ? h("div", null,
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                h("small", null,
                                    "List of ",
                                    node.length,
                                    " item",
                                    node.length > 1
                                        ? 's'
                                        : '')))
                        : h("div", { class: "stack-level" },
                            h("span", { class: "expanded", onClick: (event) => this.toggleVisibility(event, index), id: ChartLib.guid() }),
                            h("span", { onClick: (event) => this.toggleVisibility(event, index) },
                                index === 0 ? '[TOP]' : '[' + (index + 1) + ']',
                                "\u00A0",
                                h("small", null,
                                    "List of ",
                                    node.length,
                                    " item",
                                    node.length > 1
                                        ? 's'
                                        : ''))),
                    h("warp-view-tree-view", { gtsList: node, branch: true, hidden: this.isHidden(index), debug: this.debug, gtsFilter: this.gtsFilter }))
                : ''))))) : '');
    }
    static get is() { return "warp-view-tree-view"; }
    static get properties() { return {
        "branch": {
            "type": Boolean,
            "attr": "branch"
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list"
        },
        "hidden": {
            "type": Boolean,
            "attr": "hidden"
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "ref": {
            "state": true
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */warp-view-tree-view ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}warp-view-tree-view li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}warp-view-tree-view li .stack-level{font-size:1em;padding-top:5px}warp-view-tree-view li .stack-level+div{padding-left:25px}warp-view-tree-view li .expanded{background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==))}warp-view-tree-view li .collapsed,warp-view-tree-view li .expanded{padding:1px 10px;margin-right:5px;background-position:0;background-repeat:no-repeat}warp-view-tree-view li .collapsed{background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=))}warp-view-tree-view li .gtsInfo{white-space:normal;word-wrap:break-word}warp-view-tree-view li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}warp-view-tree-view li .normal{border-radius:50%;background-color:#bbb;display:inline-block}warp-view-tree-view li i,warp-view-tree-view li span{cursor:pointer}warp-view-tree-view li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"; }
}

export { WarpViewChip, WarpViewGtsTree, WarpViewTreeView };
