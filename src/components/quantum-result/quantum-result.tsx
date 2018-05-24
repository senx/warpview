import {Component, Element, Prop, Watch} from "@stencil/core";
import monaco from '@timkendrick/monaco-editor';
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-result',
  styleUrls: [
    '../../../node_modules/monaco-editor/min/vs/editor/editor.main.css',
    'quantum-result.scss'
  ],
  shadow: false
})
export class QuantumResult {

  @Element() el: HTMLStencilElement;

  @Prop() result: any = {
    json: {},
    error: '',
    message: ''
  };
  @Prop() theme: string = 'light';
  @Prop() config: string = '{}';

  private _config = {
    messageClass: '',
    errorClass: ''
  };

  private resEd: IStandaloneCodeEditor;
  private monacoTheme = 'vs';
  private resUid: string;

  @Watch('theme')
  themeHandler(newValue: string, _oldValue: string) {
    console.log('[QuantumResult] - The new value of theme is: ', newValue, _oldValue);
    if ('dark' === newValue) {
      this.monacoTheme = 'vs-dark';
    } else {
      this.monacoTheme = 'vs';
    }
    console.log('[QuantumResult] - The new value of theme is: ', this.monacoTheme);
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch('result')
  resultHandler(newValue: any, _oldValue: any) {
    console.log('[QuantumResult] - The new value of result is: ', newValue, _oldValue);
    this.resEd.setValue(newValue.json);
  }

  /**
   *
   */
  componentWillLoad() {
    this._config = {...this._config, ...JSON.parse(this.config)};
    this.resUid = GTSLib.guid();
    if ('dark' === this.theme) {
      this.monacoTheme = 'vs-dark';
    }
  }

  componentDidUnload() {
    if (this.resEd) {
      this.resEd.dispose();
    }
  }

  componentDidLoad() {
    if (!this.resEd) {
      this.resEd = monaco.editor.create(this.el.querySelector('#result-' + this.resUid), {
        value: this.result.json,
        language: 'json', automaticLayout: true,
        scrollBeyondLastLine: false,
        theme: this.monacoTheme, readOnly: false
      });
    } else {
      this.resEd.setValue(this.result.json);
    }
  }

  render() {
    const message = this.result.message ? (
      <div class={this._config.messageClass}>{this.result.message}</div>
    ) : (<span/>);
    const error = this.result.error ? (
      <div class={this._config.errorClass}>{this.result.error}</div>
    ) : (<span/>);
    return <div>
      {message}
      {error}
      <div id={'result-' + this.resUid} class="editor-res"/>
    </div>
  }
}
