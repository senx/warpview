import monaco from '@timkendrick/monaco-editor';
import { Monarch } from '../../monarch';
import { WarpScript } from '../../ref';
import { globalfunctions as wsGlobals } from '../../wsGlobals';
import { GTSLib } from "../../gts.lib";
export class QuantumEditor {
    constructor() {
        this.url = '';
        this.theme = 'light';
        this.showDataviz = false;
        this.horizontalLayout = false;
        this.config = '{}';
        this.displayMessages = true;
        this.WARPSCRIPT_LANGUAGE = 'warpscript';
        this.monacoTheme = 'vs';
        this.loading = false;
        this._config = {
            execButton: {
                class: '',
                label: 'Execute'
            },
            datavizButton: {
                class: '',
                label: 'Visualize'
            }
        };
    }
    /**
     *
     * @param {string} newValue
     * @param {string} _oldValue
     */
    themeHandler(newValue, _oldValue) {
        console.log('[QuantumEditor] - The new value of theme is: ', newValue, _oldValue);
        if ('dark' === newValue) {
            this.monacoTheme = 'vs-dark';
        }
        else {
            this.monacoTheme = 'vs';
        }
        console.log('[QuantumEditor] - The new value of theme is: ', this.monacoTheme);
        monaco.editor.setTheme(this.monacoTheme);
    }
    warpscriptHandler(newValue, _oldValue) {
        console.log('[QuantumEditor] - The new value of warpscript is: ', newValue, _oldValue);
        this.result = undefined;
        this.ed.setValue(newValue);
    }
    /**
     *
     */
    componentWillLoad() {
        this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
        console.log('[QuantumEditor] - _config: ', this._config);
        this.edUid = GTSLib.guid();
        if ('dark' === this.theme) {
            this.monacoTheme = 'vs-dark';
        }
        console.log('[QuantumEditor] - componentWillLoad theme is: ', this.theme);
        if (!monaco.languages.getLanguages().find(l => l.id === this.WARPSCRIPT_LANGUAGE)) {
            monaco.languages.register({ id: this.WARPSCRIPT_LANGUAGE });
            console.log('[QuantumEditor] - componentWillLoad register: ', this.WARPSCRIPT_LANGUAGE);
            monaco.languages.setMonarchTokensProvider(this.WARPSCRIPT_LANGUAGE, Monarch.rules);
            monaco.languages.setLanguageConfiguration(this.WARPSCRIPT_LANGUAGE, {
                wordPattern: /[^\s\t]+/,
                comments: {
                    lineComment: "//",
                    blockComment: ["/**", "*/"]
                },
                brackets: [
                    ["{", "}"],
                    ["[", "]"],
                    ["(", ")"],
                    ["<%", "%>"],
                    ["<'", "'>"],
                    ["[[", "]]"]
                ],
                autoClosingPairs: [
                    { open: "{", close: "}" },
                    { open: "[", close: "]" },
                    { open: "(", close: ")" },
                    { open: "<%", close: "%>" },
                    { open: "[[", close: "]]" },
                    { open: " '", close: "'", notIn: ["string", "comment"] },
                    { open: "<'", close: "'>" },
                    { open: "\"", close: "\"", notIn: ["string"] },
                    { open: "`", close: "`", notIn: ["string", "comment"] },
                    { open: "/**", close: " */", notIn: ["string"] }
                ],
                surroundingPairs: [
                    { open: "{", close: "}" },
                    { open: "[", close: "]" },
                    { open: "(", close: ")" },
                    { open: "[[", close: "]]" },
                    { open: "<%", close: "%>" },
                    { open: "<'", close: "'>" },
                    { open: "'", close: "'" },
                    { open: "\"", close: "\"" },
                    { open: "`", close: "`" }
                ],
                onEnterRules: [
                    {
                        // e.g. /** | */
                        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
                        afterText: /^\s*\*\/$/,
                        action: { indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
                    },
                    {
                        // e.g. /** ...|
                        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
                        action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' }
                    },
                    {
                        // e.g.  * ...|
                        beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
                        action: { indentAction: monaco.languages.IndentAction.None, appendText: '* ' }
                    },
                    {
                        // e.g.  */|
                        beforeText: /^(\t|( {2}))* \*\/\s*$/,
                        action: { indentAction: monaco.languages.IndentAction.None, removeText: 1 }
                    }
                ],
            });
            monaco.languages.registerHoverProvider(this.WARPSCRIPT_LANGUAGE, {
                provideHover: (model, position) => {
                    let word = model.getWordAtPosition(position);
                    let range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
                    console.log('[wsHoverProvider] - provideHover', model, position, word);
                    let name = word.word;
                    let entry = wsGlobals[name];
                    if (entry && entry.description) {
                        let signature = entry.signature || '';
                        let contents = ['### ' + name, {
                                language: this.WARPSCRIPT_LANGUAGE,
                                value: signature
                            }, entry.description];
                        return {
                            range: range,
                            contents: contents
                        };
                    }
                    return undefined;
                }
            });
            monaco.languages.registerCompletionItemProvider(this.WARPSCRIPT_LANGUAGE, {
                provideCompletionItems: () => {
                    let defs = [];
                    WarpScript.reference.forEach(f => {
                        defs.push({ label: f.name, kind: QuantumEditor.getType(f.tags, f.name) });
                    });
                    return defs;
                }
            });
        }
    }
    /**
     *
     */
    componentDidUnload() {
        console.log('Component removed from the DOM');
        if (this.ed) {
            this.ed.dispose();
        }
    }
    /**
     *
     */
    componentDidLoad() {
        console.log('[QuantumEditor] - componentDidLoad - warpscript', this.warpscript);
        this.ed = monaco.editor.create(this.el.querySelector('#editor-' + this.edUid), {
            value: this.warpscript,
            language: this.WARPSCRIPT_LANGUAGE, automaticLayout: true,
            theme: this.monacoTheme, hover: true
        });
        this.ed.getModel().onDidChangeContent((event) => {
            console.debug('ws changed', event);
            this.warpscriptChanged.emit(this.ed.getValue());
        });
    }
    /**
     *
     * @param {string[]} tags
     * @param {string} name
     * @returns {monaco.languages.CompletionItemKind}
     */
    static getType(tags, name) {
        let t = tags.join(' ');
        if (t.indexOf('constant') > -1) {
            return monaco.languages.CompletionItemKind.Enum;
        }
        else if (t.indexOf('reducer') > -1 && name !== 'REDUCE') {
            return monaco.languages.CompletionItemKind.Interface;
        }
        else if (t.indexOf('mapper') > -1 && name !== 'MAP') {
            return monaco.languages.CompletionItemKind.Interface;
        }
        else if (t.indexOf('bucketize') > -1 && name !== 'BUCKETIZE') {
            return monaco.languages.CompletionItemKind.Interface;
        }
        else if (t.indexOf('filter') > -1 && name !== 'FILTER') {
            return monaco.languages.CompletionItemKind.Interface;
        }
        else if (t.indexOf('control') > -1) {
            return monaco.languages.CompletionItemKind.Keyword;
        }
        else if (t.indexOf('operators') > -1) {
            return monaco.languages.CompletionItemKind.Method;
        }
        else if (t.indexOf('stack') > -1) {
            return monaco.languages.CompletionItemKind.Module;
        }
        else {
            return monaco.languages.CompletionItemKind.Function;
        }
    }
    /**
     *
     * @param {UIEvent} _event
     * @param {string} theme
     */
    setTheme(_event, theme) {
        this.theme = theme;
    }
    /**
     *
     * @param {UIEvent} _event
     */
    execute(_event) {
        this.result = undefined;
        this.status = undefined;
        this.error = undefined;
        console.debug('[QuantumEditor] - execute - this.ed.getValue()', this.ed.getValue(), _event);
        this.loading = true;
        fetch(this.url, { method: 'POST', body: this.ed.getValue() }).then(response => {
            if (response.ok) {
                console.debug('[QuantumEditor] - execute - response', response);
                response.text().then(res => {
                    this.warpscriptResult.emit(res);
                    this.result = JSON.parse(res);
                    this.status = `Your script execution took ${QuantumEditor.formatElapsedTime(parseInt(response.headers.get('x-warp10-elapsed')))} serverside,
          fetched ${response.headers.get('x-warp10-fetched')} datapoints and performed ${response.headers.get('x-warp10-ops')}  WarpScript operations.`;
                    this.statusEvent.emit(this.status);
                    this.loading = false;
                }, err => {
                    console.error(err);
                    this.error = err;
                    this.errorEvent.emit(this.error);
                    this.loading = false;
                });
            }
            else {
                console.error(response.statusText);
                this.error = response.statusText;
                this.errorEvent.emit(this.error);
                this.loading = false;
            }
        }, err => {
            console.error(err);
            this.error = err;
            this.errorEvent.emit(this.error);
            this.loading = false;
        });
    }
    /**
     *
     * @param {UIEvent} _event
     */
    requestDataviz(_event) {
        this.datavizRequested.emit(this.result);
    }
    /**
     *
     * @param {number} elapsed
     * @returns {string}
     */
    static formatElapsedTime(elapsed) {
        if (elapsed < 1000) {
            return elapsed.toFixed(3) + ' ns';
        }
        if (elapsed < 1000000) {
            return (elapsed / 1000).toFixed(3) + ' μs';
        }
        if (elapsed < 1000000000) {
            return (elapsed / 1000000).toFixed(3) + ' ms';
        }
        if (elapsed < 1000000000000) {
            return (elapsed / 1000000000).toFixed(3) + ' s ';
        }
        // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
        return (elapsed / 60000000000).toFixed(3) + ' m ';
    }
    render() {
        const loading = this.loading ? (h("div", { class: "loader" },
            h("div", { class: "spinner" }))) : ('');
        const result = this.result || this.error ? (h("quantum-result", { displayMessages: this.displayMessages, theme: this.theme, result: JSON.stringify({ json: this.result, error: this.error, message: this.status }), config: JSON.stringify(this._config) })) : ('');
        const datavizBtn = this.showDataviz && this.result ? (h("button", { type: "button", class: this._config.datavizButton.class, onClick: (event) => this.requestDataviz(event), innerHTML: this._config.datavizButton.label })) : ('');
        return (h("div", null,
            h("div", { class: "clearfix" }),
            h("div", { class: 'layout ' + (this.horizontalLayout ? 'horizontal-layout' : 'vertical-layout') },
                h("div", { class: "panel1" },
                    h("div", { id: 'editor-' + this.edUid, class: "editor" }),
                    h("div", { class: "clearfix" }),
                    loading,
                    datavizBtn,
                    h("button", { type: "button", class: this._config.execButton.class, onClick: (event) => this.execute(event), innerHTML: this._config.execButton.label })),
                h("div", { class: "panel2" }, result))));
    }
    static get is() { return "quantum-editor"; }
    static get properties() { return {
        "config": {
            "type": String,
            "attr": "config"
        },
        "displayMessages": {
            "type": Boolean,
            "attr": "display-messages"
        },
        "el": {
            "elementRef": true
        },
        "error": {
            "state": true
        },
        "horizontalLayout": {
            "type": Boolean,
            "attr": "horizontal-layout"
        },
        "result": {
            "state": true
        },
        "showDataviz": {
            "type": Boolean,
            "attr": "show-dataviz"
        },
        "status": {
            "state": true
        },
        "theme": {
            "type": String,
            "attr": "theme",
            "watchCallbacks": ["themeHandler"]
        },
        "url": {
            "type": String,
            "attr": "url"
        },
        "warpscript": {
            "type": String,
            "attr": "warpscript",
            "watchCallbacks": ["warpscriptHandler"]
        }
    }; }
    static get events() { return [{
            "name": "statusEvent",
            "method": "statusEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "errorEvent",
            "method": "errorEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpscriptChanged",
            "method": "warpscriptChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpscriptResult",
            "method": "warpscriptResult",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "datavizRequested",
            "method": "datavizRequested",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-editor:**/"; }
}
