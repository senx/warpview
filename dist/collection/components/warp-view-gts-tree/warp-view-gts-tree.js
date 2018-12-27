import { GTSLib } from "../../utils/gts.lib";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { ChartLib } from "../../utils/chart-lib";
export class WarpViewGtsTree {
    constructor() {
        this.gtsFilter = '';
        this.options = new Param();
        this.hiddenData = [];
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
    onHideData(newValue) {
        this.LOG.debug(['hiddenData'], newValue);
        this.doRender();
    }
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
                h("warp-view-tree-view", { gtsList: this.gtsList, branch: false, hidden: this.hide, hiddenData: this.hiddenData, gtsFilter: this.gtsFilter }))
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
    static get style() { return "/**style-placeholder:warp-view-gts-tree:**/"; }
}
