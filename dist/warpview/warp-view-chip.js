/*! Built with http://stenciljs.com */
const { h } = window.warpview;

import { a as GTSLib, b as Logger, c as Param, d as ChartLib } from './chunk-cadda168.js';
import { a as ColorLib } from './chunk-586fec56.js';

/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
class GTS {
}

/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
class WarpViewChip {
    constructor() {
        this.gtsFilter = '';
        this._node = {
            selected: true,
            gts: GTS
        };
        this.LOG = new Logger(WarpViewChip);
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            if (this.gtsFilter !== '') {
                this.setState(new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
            }
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
        const chip = this.el.getElementsByClassName('normal')[0];
        if (this._node.selected) {
            chip.style.setProperty('background-color', ColorLib.transparentize(ColorLib.getColor(this._node.gts.id)));
            chip.style.setProperty('border-color', ColorLib.getColor(this._node.gts.id));
        }
        else {
            chip.style.setProperty('background-color', '#eeeeee');
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this._node = Object.assign({}, this.node, { selected: true });
    }
    /**
     *
     */
    componentDidLoad() {
        if (this.gtsFilter !== '' && new RegExp(this.gtsFilter, 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))) {
            this.setState(false);
        }
        this.colorizeChip();
    }
    /**
     *
     * @param index
     * @param obj
     * @returns {boolean}
     * @private
     */
    lastIndex(index, obj) {
        let array = this.toArray(obj);
        return (index === array.length - 1);
    }
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
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
    /**
     *
     * @param {UIEvent} event
     */
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
                h("i", { class: "normal" }),
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
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "node": {
            "type": "Any",
            "attr": "node"
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host .normal {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  border: 2px solid #454545;\n  margin-top: auto;\n  margin-bottom: auto;\n  vertical-align: middle; }"; }
}

/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = '';
        this.options = new Param();
        this.hide = false;
        this.gtsList = [];
        this._options = new Param();
        this.LOG = new Logger(WarpViewGtsTree);
        this._isFolded = false;
    }
    onData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.doRender();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this._isFolded = !!this.options.foldGTSTree;
            this.doRender();
        }
    }
    onGtsFilter(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['gtsFilter'], newValue);
            this.doRender();
            if (this._options.foldGTSTree && !this._isFolded) {
                this.foldAll();
            }
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this.LOG.debug(['componentWillLoad', 'data'], this.data);
        if (this.data) {
            this.doRender();
        }
    }
    doRender() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        if (!this.data) {
            return;
        }
        this.LOG.debug(['doRender', 'gtsList'], this.data);
        let dataList = GTSLib.getData(this.data).data;
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
        this.LOG.debug(['doRender', 'gtsList'], [this.gtsList, this._options.foldGTSTree, this._isFolded]);
        if (this._options.foldGTSTree && !this._isFolded) {
            this.foldAll();
        }
    }
    foldAll() {
        if (!this.el) {
            window.setTimeout(() => {
                this.foldAll();
            }, 100);
        }
        else {
            let el = this.el.querySelector("#root");
            el.className = 'collapsed';
            this.hide = true;
            this._isFolded = true;
        }
    }
    toggleVisibility(event) {
        let el = event.currentTarget.firstChild;
        if (el.className === 'expanded') {
            this._isFolded = true;
            el.className = 'collapsed';
            this.hide = true;
        }
        else {
            el.className = 'expanded';
            this._isFolded = false;
            this.hide = false;
        }
    }
    render() {
        return this.gtsList
            ? h("div", null,
                h("div", { class: "stack-level", onClick: (event) => this.toggleVisibility(event) },
                    h("span", { class: "expanded", id: "root" }),
                    " Stack"),
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, gtsFilter: this.gtsFilter }))
            : '';
    }
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
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
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n:host .stack-level {\n  font-size: 1em;\n  padding-top: 5px;\n  cursor: pointer;\n  color: var(--gts-stack-font-color, #000000); }\n\n:host .stack-level + div {\n  padding-left: 25px; }\n\n:host .expanded {\n  padding: 1px 10px;\n  margin-right: 5px;\n  background-image: var(--gts-tree-expanded-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));\n  background-position: center left;\n  background-repeat: no-repeat; }\n\n:host .collapsed {\n  padding: 1px 10px;\n  margin-right: 5px;\n  background-image: var(--gts-tree-collapsed-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));\n  background-repeat: no-repeat;\n  background-position: center left; }"; }
}
class Counter {
    static get is() { return "warp-view-gts-tree"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "gtsFilter": {
            "type": String,
            "attr": "gts-filter",
            "watchCallbacks": ["onGtsFilter"]
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
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
Counter.item = -1;

/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
class WarpViewTreeView {
    constructor() {
        this.branch = false;
        this.hidden = false;
        this.gtsFilter = '';
        this.ref = false;
        this.hide = {};
    }
    // noinspection JSMethodCanBeStatic
    /**
     *
     */
    componentWillLoad() {
        WarpViewTreeView.LOG.debug(['componentWillLoad'], Counter.item);
    }
    /**
     *
     * @param {UIEvent} event
     * @param {number} index
     */
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
    /**
     *
     * @param {number} index
     * @returns boolean
     */
    isHidden(index) {
        if (this.hide.hasOwnProperty(index + '')) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    }
    /**
     *
     * @returns {any}
     */
    render() {
        return h("div", { class: "list" }, this.gtsList ? h("ul", null, this.gtsList.map((node, index) => (h("li", { hidden: this.hidden }, GTSLib.isGts(node)
            ? h("warp-view-chip", { node: { gts: node }, name: node.c, gtsFilter: this.gtsFilter })
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
                    h("warp-view-tree-view", { gtsList: node, branch: true, hidden: this.isHidden(index), gtsFilter: this.gtsFilter }))
                : ''))))) : '');
    }
    static get is() { return "warp-view-tree-view"; }
    static get properties() { return {
        "branch": {
            "type": Boolean,
            "attr": "branch"
        },
        "el": {
            "elementRef": true
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
        "ref": {
            "state": true
        }
    }; }
    static get style() { return "/*!\n *  Copyright 2018  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\nwarp-view-tree-view ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  border: none;\n  overflow: hidden; }\n\nwarp-view-tree-view li {\n  color: var(--gts-stack-font-color, #000000);\n  position: relative;\n  padding: 0 0 0 20px;\n  line-height: 20px; }\n\nwarp-view-tree-view li .stack-level {\n  font-size: 1em;\n  padding-top: 5px; }\n\nwarp-view-tree-view li .stack-level + div {\n  padding-left: 25px; }\n\nwarp-view-tree-view li .expanded {\n  padding: 1px 10px;\n  margin-right: 5px;\n  background-image: var(--gts-tree-expanded-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));\n  background-position: center left;\n  background-repeat: no-repeat; }\n\nwarp-view-tree-view li .collapsed {\n  padding: 1px 10px;\n  margin-right: 5px;\n  background-image: var(--gts-tree-collapsed-icon, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));\n  background-repeat: no-repeat;\n  background-position: center left; }\n\nwarp-view-tree-view li .gtsInfo {\n  white-space: normal;\n  word-wrap: break-word; }\n\nwarp-view-tree-view li .gtsInfo[disabled] {\n  color: #aaaaaa;\n  cursor: not-allowed; }\n\nwarp-view-tree-view li .normal {\n  border-radius: 50%;\n  background-color: #bbbbbb;\n  display: inline-block;\n  width: 12px;\n  height: 12px; }\n\nwarp-view-tree-view li i, warp-view-tree-view li span {\n  cursor: pointer; }\n\nwarp-view-tree-view li .selected {\n  background-color: #aaddff;\n  font-weight: bold;\n  padding: 1px 5px; }\n\nwarp-view-tree-view .gts-classname {\n  color: var(--gts-classname-font-color, #0074D9); }\n\nwarp-view-tree-view .gts-labelname {\n  color: var(--gts-labelname-font-color, #19A979); }\n\nwarp-view-tree-view .gts-attrname {\n  color: var(--gts-labelname-font-color, #ED4A7B); }\n\nwarp-view-tree-view .gts-separator {\n  color: var(--gts-separator-font-color, #bbbbbb); }\n\nwarp-view-tree-view .gts-labelvalue {\n  color: var(--gts-labelvalue-font-color, #AAAAAA);\n  font-style: italic; }\n\nwarp-view-tree-view .gts-attrvalue {\n  color: var(--gts-labelvalue-font-color, #AAAAAA);\n  font-style: italic; }"; }
}
WarpViewTreeView.LOG = new Logger(WarpViewTreeView);

export { WarpViewChip, WarpViewGtsTree, WarpViewTreeView };
