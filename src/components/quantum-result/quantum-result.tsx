import { Component, Element, Prop, Watch } from "@stencil/core";
import monaco from "@timkendrick/monaco-editor";
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import { GTSLib } from "../../gts.lib";

import "@code-dimension/stencil-components";

@Component({
  tag: "quantum-result",
  styleUrls: [
    "../../../node_modules/monaco-editor/min/vs/editor/editor.main.css",
    "quantum-result.scss"
  ],
  shadow: false
})
export class QuantumResult {
  @Element() el: HTMLStencilElement;

  @Prop() result: string = '{"json": {},    "error": "",   "message": ""  }';
  @Prop() theme: string = "light";
  @Prop() config: string = "{}";
  @Prop() displayMessages = true;
  private _result = { json: [], error: "", message: "" };

  private _config = {
    messageClass: "",
    errorClass: ""
  };

  private resEd: IStandaloneCodeEditor;
  private monacoTheme = "vs";
  private resUid: string;

  @Watch("theme")
  themeHandler(newValue: string, _oldValue: string) {
    console.log(
      "[QuantumResult] - The new value of theme is: ",
      newValue,
      _oldValue
    );
    if ("dark" === newValue) {
      this.monacoTheme = "vs-dark";
    } else {
      this.monacoTheme = "vs";
    }
    console.log(
      "[QuantumResult] - The new value of theme is: ",
      this.monacoTheme
    );
    monaco.editor.setTheme(this.monacoTheme);
  }

  @Watch("result")
  resultHandler(newValue: any, _oldValue: any) {
    console.log(
      "[QuantumResult] - The new value of result is: ",
      newValue,
      _oldValue
    );
    this._result = JSON.parse(newValue);
    this.buildEditor(JSON.stringify(this._result.json));
  }

  /**
   *
   */
  componentWillLoad() {
    this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
    this._result = JSON.parse(this.result);
    this.resUid = GTSLib.guid();
    if ("dark" === this.theme) {
      this.monacoTheme = "vs-dark";
    }
    console.debug("[QuantumResult] - componentWillLoad", this._result.json);
  }

  buildEditor(json: string) {
    console.debug("[QuantumResult] - buildEditor", json, this._result.json);
    if (!this.resEd) {
      this.resEd = monaco.editor.create(
        this.el.querySelector("#result-" + this.resUid),
        {
          value: json,
          language: "json",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          theme: this.monacoTheme,
          readOnly: false
        }
      );
    } else {
      this.resEd.setValue(json);
    }
  }

  componentDidLoad() {
    console.debug("[QuantumResult] - componentDidLoad", this._result.json);
    this.buildEditor(JSON.stringify(this._result.json));
    }

  render() {
    const message =
  this._result.message && this.displayMessages ?
    <div class={this._config.messageClass}>{this._result.message}</div> : "";

    const error =
      this._result.error && this.displayMessages ? (
        <div class={this._config.errorClass}>{this._result.error}</div>
      ) : (
        ""
      );

    const stack = this._result.json && GTSLib.isArray(this._result.json) ? <div class={this.theme + " raw"}>
      {this._result.json.map((line, index) => (
        <span class="line">
            <span class="line-num">{index === 0 ? "[TOP]" : index}</span>
            <span class="line-content">{JSON.stringify(line)}</span>
          </span>
      ))}
    </div> : "";

    return (
      <div>
        {message}
        {error}
        <div class={"wrapper " + this.theme}>
          {this._result.json ? (
            <stc-tabs>
              <stc-tab-header slot="header" name="tab1">
                Stack
              </stc-tab-header>
              <stc-tab-header slot="header" name="tab2">
                Raw JSON
              </stc-tab-header>

              <stc-tab-content slot="content" name="tab1">
                {stack}
              </stc-tab-content>

              <stc-tab-content slot="content" name="tab2">
                <div id={"result-" + this.resUid} class="editor-res" />
              </stc-tab-content>
            </stc-tabs>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
