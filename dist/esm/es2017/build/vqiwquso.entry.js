import { h } from '../warpview.core.js';

import { b as Logger, a as GTSLib } from './chunk-1029d1a2.js';
import { c as Param, b as deepEqual, a as ChartLib } from './chunk-64463141.js';

class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = 'x';
        this.options = new Param();
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.hide = false;
        this.gtsList = [];
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        this.LOG.debug(['options'], newValue, oldValue);
        this.doRender();
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
                    " Results"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, debug: this.debug, hiddenData: this.hiddenData, gtsFilter: this.gtsFilter, kbdLastKeyPressed: this.kbdLastKeyPressed }))
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
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed"
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
        this.gtsFilter = 'x';
        this.hiddenData = [];
        this.debug = false;
        this.kbdLastKeyPressed = [];
        this.ref = 0;
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
        this.ref++;
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.ref++;
        }
    }
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.ref++;
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
            ? h("warp-view-chip", { node: { gts: node }, name: node.c, gtsFilter: this.gtsFilter, debug: this.debug, hiddenData: this.hiddenData, kbdLastKeyPressed: this.kbdLastKeyPressed })
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
                    h("warp-view-tree-view", { gtsList: node, branch: true, hidden: this.isHidden(index), debug: this.debug, gtsFilter: this.gtsFilter, kbdLastKeyPressed: this.kbdLastKeyPressed, hiddenData: this.hiddenData }))
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
        "kbdLastKeyPressed": {
            "type": "Any",
            "attr": "kbd-last-key-pressed"
        },
        "ref": {
            "state": true
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */warp-view-tree-view ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}warp-view-tree-view li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}warp-view-tree-view li .stack-level{font-size:1em;padding-top:5px}warp-view-tree-view li .stack-level+div{padding-left:25px}warp-view-tree-view li .expanded{background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==))}warp-view-tree-view li .collapsed,warp-view-tree-view li .expanded{padding:1px 10px;margin-right:5px;background-position:0;background-repeat:no-repeat}warp-view-tree-view li .collapsed{background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=))}warp-view-tree-view li .gtsInfo{white-space:normal;word-wrap:break-word}warp-view-tree-view li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}warp-view-tree-view li .normal{border-radius:50%;background-color:#bbb;display:inline-block}warp-view-tree-view li i,warp-view-tree-view li span{cursor:pointer}warp-view-tree-view li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"; }
}

export { WarpViewGtsTree, WarpViewTreeView };
