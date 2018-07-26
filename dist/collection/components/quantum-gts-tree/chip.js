import { GTSLib } from "../../gts.lib";
export class QuantumChip {
    constructor() {
        this._node = {
            selected: true, gts: {
                c: '', l: {}, a: {}, v: []
            }
        };
    }
    /**
     *
     * @param {boolean} state
     * @returns {string}
     */
    gtsColor(state) {
        //console.debug('[QuantumChip] - gtsColor', state);
        if (state) {
            return GTSLib.getColor(this.index);
        }
        else {
            return '#bbbbbb';
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
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
    }
    /**
     *
     * @param index
     * @param obj
     * @returns {boolean}
     * @private
     */
    _lastIndex(index, obj) {
        let array = this._toArray(obj);
        return (index === array.length - 1);
    }
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    _toArray(obj) {
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
        //console.debug('[QuantumChip] - switchPlotState', event);
        //console.debug('[QuantumChip] - switchPlotState', this._node);
        this._node = Object.assign({}, this._node, { selected: !this._node.selected });
        //console.debug('[QuantumChip] - switchPlotState', this._node);
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
        this.selected.emit(this.node);
    }
    render() {
        return (h("div", null, this._node !== undefined && this._node.gts !== undefined
            ?
                h("span", null,
                    h("i", { class: "normal" }),
                    h("span", { class: "gtsInfo", onClick: (event) => this.switchPlotState(event) },
                        h("span", { class: 'gts-classname' }, this._node.gts.c),
                        h("span", { class: 'gts-separator', innerHTML: '&lcub; ' }),
                        this.node.gts.l,
                        this._toArray(this._node.gts.l).map((label, labelIndex) => h("span", null,
                            h("span", { class: 'gts-labelname' }, label.name),
                            h("span", { class: 'gts-separator' }, "="),
                            h("span", { class: 'gts-labelvalue' }, label.value),
                            h("span", { hidden: this._lastIndex(labelIndex, this._node.gts.l) }, ", "))),
                        h("span", { class: 'gts-separator', innerHTML: ' &rcub;' })))
            : h("span", null)));
    }
    static get is() { return "quantum-chip"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "index": {
            "type": Number,
            "attr": "index"
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
            "name": "selected",
            "method": "selected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-chip:**/"; }
}
