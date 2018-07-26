import {Component, Element, Prop, Event, Watch, State, EventEmitter} from "@stencil/core";
import monaco, {MarkedString} from '@timkendrick/monaco-editor';
import {Monarch} from '../../monarch'
import {WarpScript} from '../../ref';
import {globalfunctions as wsGlobals} from '../../wsGlobals';
import Hover = monaco.languages.Hover;
import IReadOnlyModel = monaco.editor.IReadOnlyModel;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-editor',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    'quantum-editor.scss'
  ],
  shadow: false
})
export class QuantumEditor {

  @Element() el: HTMLStencilElement;

  @Prop() url: string = '';
  @Prop() theme: string = 'light';
  @Prop() warpscript: string;
  @Prop() showDataviz = false;
  @Prop() horizontalLayout = false;
  @Prop() config: string = '{}';
  @Prop() displayMessages = true;

  @Event() statusEvent: EventEmitter;
  @Event() errorEvent: EventEmitter;
  @Event() warpscriptChanged: EventEmitter;
  @Event() warpscriptResult: EventEmitter;
  @Event() datavizRequested: EventEmitter;

  @State() result: string;
  @State() status: string;
  @State() error: string;


  private WARPSCRIPT_LANGUAGE = 'warpscript';
  private ed: IStandaloneCodeEditor;
  private edUid: string;
  private monacoTheme = 'vs';
  private loading = false;
  private _config = {
    execButton: {
      class: '',
      label: 'Execute'
    },
    datavizButton: {
      class: '',
      label: 'Visualize'
    }
  };

  /**
   *
   * @param {string} newValue
   * @param {string} _oldValue
   */
  @Watch('theme')
  themeHandler(newValue: string, _oldValue: string) {
    console.log('[QuantumEditor] - The new value of theme is: ', newValue, _oldValue);
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    console.log('[QuantumEditor] - The new value of theme is: ', this.monacoTheme);
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch('warpscript')
  warpscriptHandler(newValue: string, _oldValue: string) {
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
    if(!monaco.languages.getLanguages().find(l => l.id === this.WARPSCRIPT_LANGUAGE)) {
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
            {open: "{", close: "}"},
            {open: "[", close: "]"},
            {open: "(", close: ")"},
            {open: "<%", close: "%>"},
            {open: "[[", close: "]]"},
            {open: " '", close: "'", notIn: ["string", "comment"]},
            {open: "<'", close: "'>"},
            {open: "\"", close: "\"", notIn: ["string"]},
            {open: "`", close: "`", notIn: ["string", "comment"]},
            {open: "/**", close: " */", notIn: ["string"]}
          ],
          surroundingPairs: [
            {open: "{", close: "}"},
            {open: "[", close: "]"},
            {open: "(", close: ")"},
            {open: "[[", close: "]]"},
            {open: "<%", close: "%>"},
            {open: "<'", close: "'>"},
            {open: "'", close: "'"},
            {open: "\"", close: "\""},
            {open: "`", close: "`"}
          ],
          onEnterRules: [
            {
              // e.g. /** | */
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              afterText: /^\s*\*\/$/,
              action: {indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * '}
            },
            {
              // e.g. /** ...|
              beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
              action: {indentAction: monaco.languages.IndentAction.None, appendText: ' * '}
            },
            {
              // e.g.  * ...|
              beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
              action: {indentAction: monaco.languages.IndentAction.None, appendText: '* '}
            },
            {
              // e.g.  */|
              beforeText: /^(\t|( {2}))* \*\/\s*$/,
              action: {indentAction: monaco.languages.IndentAction.None, removeText: 1}
            }
          ],
        }
      );
      monaco.languages.registerHoverProvider(this.WARPSCRIPT_LANGUAGE, {
        provideHover: (model: IReadOnlyModel, position: monaco.Position) => {
          let word = model.getWordAtPosition(position);
          let range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
          console.log('[wsHoverProvider] - provideHover', model, position, word);
          let name = word.word;
          let entry = wsGlobals[name];
          if (entry && entry.description) {
            let signature = entry.signature || '';
            let contents: MarkedString[] = ['### ' + name, {
              language: this.WARPSCRIPT_LANGUAGE,
              value: signature
            }, entry.description];
            return {
              range: range,
              contents: contents
            } as Hover
          }

          return undefined;
        }
      });

      monaco.languages.registerCompletionItemProvider(this.WARPSCRIPT_LANGUAGE, {
        provideCompletionItems: () => {
          let defs = [];
          WarpScript.reference.forEach(f => {
            defs.push({label: f.name, kind: QuantumEditor.getType(f.tags, f.name)});
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
  private static getType(tags: string[], name: string): monaco.languages.CompletionItemKind {
    let t = tags.join(' ');
    if (t.indexOf('constant') > -1) {
      return monaco.languages.CompletionItemKind.Enum;
    } else if (t.indexOf('reducer') > -1 && name !== 'REDUCE') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('mapper') > -1 && name !== 'MAP') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('bucketize') > -1 && name !== 'BUCKETIZE') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('filter') > -1 && name !== 'FILTER') {
      return monaco.languages.CompletionItemKind.Interface;
    } else if (t.indexOf('control') > -1) {
      return monaco.languages.CompletionItemKind.Keyword;
    } else if (t.indexOf('operators') > -1) {
      return monaco.languages.CompletionItemKind.Method;
    } else if (t.indexOf('stack') > -1) {
      return monaco.languages.CompletionItemKind.Module;
    } else {
      return monaco.languages.CompletionItemKind.Function;
    }
  }

  /**
   *
   * @param {UIEvent} _event
   * @param {string} theme
   */
  setTheme(_event: UIEvent, theme: string) {
    this.theme = theme;
  }

  /**
   *
   * @param {UIEvent} _event
   */
  execute(_event: UIEvent) {
    this.result = undefined;
    this.status = undefined;
    this.error = undefined;
    console.debug('[QuantumEditor] - execute - this.ed.getValue()', this.ed.getValue(), _event);
    this.loading = true;
    fetch(this.url, {method: 'POST', body: this.ed.getValue()}).then(response => {
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
      } else {
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
  requestDataviz(_event: UIEvent) {
    this.datavizRequested.emit(this.result);
  }

  /**
   *
   * @param {number} elapsed
   * @returns {string}
   */
  private static formatElapsedTime(elapsed: number) {
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
    const loading = this.loading ? (
      <div class="loader">
        <div class="spinner"/>
      </div>
    ) : ('');
    const result = this.result || this.error ? (
      <quantum-result
        displayMessages={this.displayMessages}
        theme={this.theme}
        result={JSON.stringify({json: this.result, error: this.error, message: this.status})}
        config={JSON.stringify(this._config)}
      />
    ) : ('');
    const datavizBtn = this.showDataviz && this.result ? (
      <button type="button" class={this._config.datavizButton.class}
              onClick={(event: UIEvent) => this.requestDataviz(event)} innerHTML={this._config.datavizButton.label}>
      </button>
    ) : ('');


    return (
      <div>
        <div class="clearfix"/>
        <div class={'layout ' + (this.horizontalLayout ? 'horizontal-layout' : 'vertical-layout')}>
          <div class="panel1">
            <div id={'editor-' + this.edUid} class="editor"/>
            <div class="clearfix"/>
            {loading}
            {datavizBtn}
            <button type="button" class={this._config.execButton.class}
                    onClick={(event: UIEvent) => this.execute(event)} innerHTML={this._config.execButton.label}>
            </button>
          </div>
          <div class="panel2">
            {result}
          </div>
        </div>
      </div>
    );
  }
}
