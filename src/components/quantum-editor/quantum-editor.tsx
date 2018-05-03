import { Component, Element, Prop } from "@stencil/core";
import monaco from '@timkendrick/monaco-editor';
import { Monarch } from '../../monarch'
import { WarpScript } from '../../ref';
import 'clipboard';
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
declare var Prism: any;

@Component({
  tag: 'quantum-editor',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    '../../../node_modules/prismjs/themes/prism-okaidia.css',
    '../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css',
    '../../../node_modules/prismjs/plugins/toolbar/prism-toolbar.css',
    'quantum-editor.scss'
  ],
  shadow: false
})
export class QuantumEditor {
  @Element() el: HTMLStencilElement;
  @Prop() url: string = '';
  ed: any;
  warpscript: string;
  result: string;
  status: string;
  error: string;
  themes = ['vs', 'vs-dark', 'hc-black']
  componentWillLoad() {
    this.warpscript = this.el.textContent.slice();
    Prism.languages.json = {
      'property': /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
      'string': {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: true
      },
      'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      'punctuation': /[{}[\]);,]/,
      'operator': /:/g,
      'boolean': /\b(?:true|false)\b/i,
      'null': /\bnull\b/i
    };

    Prism.languages.jsonp = Prism.languages.json;
  }

  componentDidLoad() {
    console.debug('[QuantumEditor] - componentDidLoad - warpscript', this.warpscript);
    monaco.languages.register({ id: 'warpscript' });
    monaco.languages.setMonarchTokensProvider('warpscript', Monarch.rules);
    monaco.languages.registerCompletionItemProvider('warpscript', {
      provideCompletionItems: () => {
        let defs = [];
        WarpScript.reference.forEach(f => {
          defs.push({ label: f.name, kind: this.getType(f.tags, f.name) });
        });
        return defs;
      }
    });
    this.ed = monaco.editor.create(this.el.querySelector('#editor'), {
      value: this.warpscript,
      language: 'warpscript',
      theme: 'vs-dark'
    });
    this.ed.model.onDidChangeContent((event) => {
      this.warpscript = this.ed.getValue();
    });
    // this.el.textContent = ''
    /*
    editor.updateOptions({
		lineNumbers: "on"
  });
  */
    // this.ed.setTheme('vs-dark');
  }

  private getType(tags: string[], name: string): monaco.languages.CompletionItemKind {
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

  execute(_event: UIEvent) {
    let me = this;
    this.result = undefined;
    this.status = undefined;
    this.error = undefined;
    console.debug('[QuantumEditor] - execute - this.ed.getValue()', this.ed.getValue());
    fetch(this.url, { method: 'POST', body: this.ed.getValue() }).then(response => {
      if (response.ok) {
        console.debug('[QuantumEditor] - execute - response', response);
        response.json().then(res => {
          this.result = '[\n';
          res.forEach(l => this.result += '\t' + JSON.stringify(l) + '\n');
          this.result += ']';
          this.status = `Your script execution took ${this.formatElapsedTime(parseInt(response.headers.get('x-warp10-elapsed')))} serverside,
          fetched ${response.headers.get('x-warp10-fetched')} datapoints 
          and performed ${response.headers.get('x-warp10-ops')}  WarpScript operations.`
          this.el.forceUpdate();
          window.setTimeout(() => Prism.highlightAllUnder(this.el.querySelector('#result')), 100);
        }, err => {
          console.error(err);
        });
      } else {
        console.error(response.statusText);
        if (response.headers.has('x-warp10-error-message')) {
          let line = parseInt(response.headers.get('x-warp10-error-line'))

          // Check if error message contains infos from LINEON
          let lineonPattern = /\[Line #(\d+)\]/g;  // Captures the lines sections name
          let lineonMatch: RegExpMatchArray | null;
          while ((lineonMatch = lineonPattern.exec(response.headers.get('x-warp10-error-message')))) {
            line = parseInt(lineonMatch[1]);
          }
          this.error = 'Error at line ' + line + ' : ' + response.headers.get('x-warp10-error-message');
        }
      }
    }, err => {
      console.error(err);
    });
  }

  private formatElapsedTime(elapsed: number) {
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
    const status = this.status ? (
      <div class="alert alert-primary">{this.status}</div>
    ) : (<span></span>);
    const error = this.error ? (
      <div class="alert alert-danger">{this.error}</div>
    ) : (<span></span>);
    const result = this.result ? (
      <div id="result">
        <pre class="line-numbers"><code class="language-json">{this.result}</code></pre>
      </div>
    ) : (<span></span>);
    return <div>
      <h1>WarpScript</h1>
      <div id="editor"></div>
      <button type="button" class="btn btn-primary float-right m-3" onClick={(event: UIEvent) => this.execute(event)} >Execute</button>
      <div class="clearfix"></div>
      {result}{status}{error}
    </div>;
  }
}