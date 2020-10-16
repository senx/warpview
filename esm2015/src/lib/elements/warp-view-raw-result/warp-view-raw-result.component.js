/*
 *  Copyright 2020 SenX S.A.S.
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
 */
import { Utils } from '../../model/utils';
import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { editor } from 'monaco-editor';
import { Logger } from '../../model/logger';
import { EditorConfig } from '../../model/editorConfig';
var setTheme = editor.setTheme;
var create = editor.create;
export class WarpViewRawResultComponent {
    constructor() {
        this.loading = false;
        // tslint:disable-next-line:variable-name
        this._theme = 'light';
        // tslint:disable-next-line:variable-name
        this._config = {
            editor: new EditorConfig(),
            messageClass: '',
            errorClass: ''
        };
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this.LINE_HEIGHT = 18;
        this.CONTAINER_GUTTER = 10;
        this.monacoTheme = 'vs';
        this.LOG = new Logger(WarpViewRawResultComponent, this._debug);
    }
    set debug(debug) {
        if (typeof debug === 'string') {
            debug = 'true' === debug;
        }
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set theme(newValue) {
        this.LOG.debug(['WarpViewRawResult'], 'The new value of theme is: ', newValue);
        if ('dark' === newValue) {
            this.monacoTheme = 'vs-dark';
        }
        else {
            this.monacoTheme = 'vs';
        }
        this.LOG.debug(['WarpViewRawResult'], 'The new value of theme is: ', this.monacoTheme);
        this._theme = newValue;
        setTheme(this.monacoTheme);
    }
    get theme() {
        return this._theme;
    }
    set result(newValue) {
        this.loading = true;
        this._result = newValue;
        this.LOG.debug(['WarpViewRawResult'], 'The new value of result is: ', newValue);
        this.buildEditor(this._result || '');
        this.loading = false;
    }
    get result() {
        return this._result;
    }
    set config(config) {
        let conf = (typeof config === 'string') ? JSON.parse(config || '{}') : config || {};
        this._config = Utils.mergeDeep(this._config, conf);
        this.LOG.debug(['config'], this._config, conf);
        if (this.resEd) {
            this.LOG.debug(['config'], this._config);
            this.resEd.updateOptions(this.setOptions());
        }
    }
    get config() {
        return this._config;
    }
    ngOnInit() {
        this._config = Utils.mergeDeep(this._config, this.config);
        if ('dark' === this.theme) {
            this.monacoTheme = 'vs-dark';
        }
        this.LOG.debug(['ngOnInit'], this.result);
    }
    buildEditor(json) {
        this.LOG.debug(['buildEditor'], 'buildEditor', json, this._config);
        if (!this.resEd && json) {
            this.resEd = create(this.editor.nativeElement, this.setOptions());
        }
        if (!!this.resEd) {
            this.resEd.setValue(json || '');
        }
        this.loading = false;
    }
    adjustHeight() {
        if (this.editor) {
            const el = this.editor.nativeElement;
            const codeContainer = el.getElementsByClassName('view-lines')[0];
            const containerHeight = codeContainer.offsetHeight;
            let prevLineCount = 0;
            if (!containerHeight) {
                // dom hasn't finished settling down. wait a bit more.
                setTimeout(() => this.adjustHeight(), 0);
            }
            else {
                setTimeout(() => {
                    const height = codeContainer.childElementCount > prevLineCount
                        ? codeContainer.offsetHeight // unfold
                        : codeContainer.childElementCount * this.LINE_HEIGHT + this.CONTAINER_GUTTER; // fold
                    prevLineCount = codeContainer.childElementCount;
                    el.style.height = height + 'px';
                    this.resEd.layout();
                }, 0);
            }
        }
    }
    ngAfterViewInit() {
        this.LOG.debug(['ngAfterViewInit'], this._result);
        this.loading = true;
        this.buildEditor(JSON.stringify(this._result));
        this.loading = false;
    }
    setOptions() {
        return {
            value: '',
            language: 'json',
            minimap: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            theme: this.monacoTheme,
            readOnly: !!this._config.editor.rawResultsReadOnly,
            fixedOverflowWidgets: true,
            lineNumbers: 'on',
            wordWrap: 'on'
        };
    }
}
WarpViewRawResultComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-raw-result',
                template: "<!--\n  ~  Copyright 2020 SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n\n<div [class]=\"'wrapper ' + _theme\">\n  <div *ngIf=\"loading\" class=\"loader\">\n    <div class=\"spinner\"></div>\n  </div>\n  <div #editor></div>\n</div>\n",
                encapsulation: ViewEncapsulation.Emulated,
                styles: ["/*!\n *  Copyright 2020 SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */:host,warpview-raw-result{height:100%}:host .decorationsOverviewRuler,warpview-raw-result .decorationsOverviewRuler{display:none}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(1turn)}}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}:host .editor-res,warpview-raw-result .editor-res{height:100%;min-height:500px;width:100%}:host .wrapper,warpview-raw-result .wrapper{height:100%;overflow:hidden;width:100%}:host .wrapper .loader,warpview-raw-result .wrapper .loader{background-color:rgba(0,0,0,.3);bottom:0;left:0;position:absolute;right:0;top:0;z-index:1}:host .wrapper .loader .spinner,warpview-raw-result .wrapper .loader .spinner{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:transparent;border-style:solid;border-top-color:var(--warp-view-spinner-color,#5899da);height:50px;left:calc(50% - 25px);margin:auto;overflow:visible;position:absolute;top:calc(50% - 25px);width:50px;z-index:999}:host .wrapper.dark,warpview-raw-result .wrapper.dark{--warp-view-spinner-color:#f3f3f3;background-color:#1e1e1e;color:#f8f9fa}:host .wrapper.light,warpview-raw-result .wrapper.light{background-color:#fff!important;color:#000}:host .wrapper>div,warpview-raw-result .wrapper>div{height:100%;width:100%!important}"]
            },] }
];
WarpViewRawResultComponent.ctorParameters = () => [];
WarpViewRawResultComponent.propDecorators = {
    editor: [{ type: ViewChild, args: ['editor', { static: true },] }],
    debug: [{ type: Input }],
    theme: [{ type: Input }],
    result: [{ type: Input }],
    config: [{ type: Input, args: ['config',] }],
    heightLine: [{ type: Input }],
    heightPx: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJhdy1yZXN1bHQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycHZpZXctZWRpdG9yL3Byb2plY3RzL3dhcnB2aWV3LWVkaXRvci1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXJhdy1yZXN1bHQvd2FycC12aWV3LXJhdy1yZXN1bHQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3hDLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQVUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2hILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRTFDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUV0RCxJQUFPLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xDLElBQU8sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFTOUIsTUFBTSxPQUFPLDBCQUEwQjtJQWlGckM7UUFyQkEsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQix5Q0FBeUM7UUFDekMsV0FBTSxHQUFHLE9BQU8sQ0FBQztRQUdqQix5Q0FBeUM7UUFDekMsWUFBTyxHQUFXO1lBQ2hCLE1BQU0sRUFBRSxJQUFJLFlBQVksRUFBRTtZQUMxQixZQUFZLEVBQUUsRUFBRTtZQUNoQixVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUM7UUFDRix5Q0FBeUM7UUFDekMsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUlQLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLEVBQUUs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RUFBRSxJQUFJO1lBQ3JCLG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3ZCLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCO1lBQ2xELG9CQUFvQixFQUFFLElBQUk7WUFDMUIsV0FBVyxFQUFFLElBQUk7WUFDakIsUUFBUSxFQUFFLElBQUk7U0FDRyxDQUFDO0lBQ3RCLENBQUM7OztZQXpKRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsNHlCQUFvRDtnQkFFcEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFFBQVE7O2FBQzFDOzs7O3FCQUVFLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO29CQUVsQyxLQUFLO29CQVlMLEtBQUs7cUJBZ0JMLEtBQUs7cUJBWUwsS0FBSyxTQUFDLFFBQVE7eUJBY2QsS0FBSzt1QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtVdGlsc30gZnJvbSAnLi4vLi4vbW9kZWwvdXRpbHMnO1xuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtlZGl0b3J9IGZyb20gJ21vbmFjby1lZGl0b3InO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL21vZGVsL2xvZ2dlcic7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vbW9kZWwvY29uZmlnJztcbmltcG9ydCB7RWRpdG9yQ29uZmlnfSBmcm9tICcuLi8uLi9tb2RlbC9lZGl0b3JDb25maWcnO1xuaW1wb3J0IElTdGFuZGFsb25lQ29kZUVkaXRvciA9IGVkaXRvci5JU3RhbmRhbG9uZUNvZGVFZGl0b3I7XG5pbXBvcnQgc2V0VGhlbWUgPSBlZGl0b3Iuc2V0VGhlbWU7XG5pbXBvcnQgY3JlYXRlID0gZWRpdG9yLmNyZWF0ZTtcbmltcG9ydCBJRWRpdG9yT3B0aW9ucyA9IGVkaXRvci5JRWRpdG9yT3B0aW9ucztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcmF3LXJlc3VsdCcsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctcmF3LXJlc3VsdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1yYXctcmVzdWx0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3UmF3UmVzdWx0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnZWRpdG9yJywge3N0YXRpYzogdHJ1ZX0pIGVkaXRvcjogRWxlbWVudFJlZjtcblxuICBASW5wdXQoKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGRlYnVnID09PSAnc3RyaW5nJykge1xuICAgICAgZGVidWcgPSAndHJ1ZScgPT09IGRlYnVnO1xuICAgIH1cbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgdGhlbWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnV2FycFZpZXdSYXdSZXN1bHQnXSwgJ1RoZSBuZXcgdmFsdWUgb2YgdGhlbWUgaXM6ICcsIG5ld1ZhbHVlKTtcbiAgICBpZiAoJ2RhcmsnID09PSBuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5tb25hY29UaGVtZSA9ICd2cy1kYXJrJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb25hY29UaGVtZSA9ICd2cyc7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnV2FycFZpZXdSYXdSZXN1bHQnXSwgJ1RoZSBuZXcgdmFsdWUgb2YgdGhlbWUgaXM6ICcsIHRoaXMubW9uYWNvVGhlbWUpO1xuICAgIHRoaXMuX3RoZW1lID0gbmV3VmFsdWU7XG4gICAgc2V0VGhlbWUodGhpcy5tb25hY29UaGVtZSk7XG4gIH1cblxuICBnZXQgdGhlbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdGhlbWU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgcmVzdWx0KG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuX3Jlc3VsdCA9IG5ld1ZhbHVlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnV2FycFZpZXdSYXdSZXN1bHQnXSwgJ1RoZSBuZXcgdmFsdWUgb2YgcmVzdWx0IGlzOiAnLCBuZXdWYWx1ZSk7XG4gICAgdGhpcy5idWlsZEVkaXRvcih0aGlzLl9yZXN1bHQgfHwgJycpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHJlc3VsdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXN1bHQ7XG4gIH1cblxuICBASW5wdXQoJ2NvbmZpZycpIHNldCBjb25maWcoY29uZmlnOiBDb25maWcgfCBzdHJpbmcpIHtcbiAgICBsZXQgY29uZiA9ICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykgPyBKU09OLnBhcnNlKGNvbmZpZyB8fCAne30nKSA6IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLl9jb25maWcgPSBVdGlscy5tZXJnZURlZXAodGhpcy5fY29uZmlnLCBjb25mKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbmZpZyddLCB0aGlzLl9jb25maWcsIGNvbmYpO1xuICAgIGlmICh0aGlzLnJlc0VkKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbmZpZyddLCB0aGlzLl9jb25maWcpO1xuICAgICAgdGhpcy5yZXNFZC51cGRhdGVPcHRpb25zKHRoaXMuc2V0T3B0aW9ucygpKTtcbiAgICB9XG4gIH1cblxuICBnZXQgY29uZmlnKCk6IENvbmZpZyB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgfVxuXG4gIEBJbnB1dCgpIGhlaWdodExpbmU6IG51bWJlcjtcbiAgQElucHV0KCkgaGVpZ2h0UHg6IG51bWJlcjtcblxuICBsb2FkaW5nID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF90aGVtZSA9ICdsaWdodCc7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF9yZXN1bHQ6IHN0cmluZztcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX2NvbmZpZzogQ29uZmlnID0ge1xuICAgIGVkaXRvcjogbmV3IEVkaXRvckNvbmZpZygpLFxuICAgIG1lc3NhZ2VDbGFzczogJycsXG4gICAgZXJyb3JDbGFzczogJydcbiAgfTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX2RlYnVnID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcblxuICBwcml2YXRlIExJTkVfSEVJR0hUID0gMTg7XG4gIHByaXZhdGUgQ09OVEFJTkVSX0dVVFRFUiA9IDEwO1xuICBwcml2YXRlIHJlc0VkOiBJU3RhbmRhbG9uZUNvZGVFZGl0b3I7XG4gIHByaXZhdGUgbW9uYWNvVGhlbWUgPSAndnMnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1Jhd1Jlc3VsdENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fY29uZmlnID0gVXRpbHMubWVyZ2VEZWVwKHRoaXMuX2NvbmZpZywgdGhpcy5jb25maWcpO1xuICAgIGlmICgnZGFyaycgPT09IHRoaXMudGhlbWUpIHtcbiAgICAgIHRoaXMubW9uYWNvVGhlbWUgPSAndnMtZGFyayc7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdPbkluaXQnXSwgdGhpcy5yZXN1bHQpO1xuICB9XG5cbiAgYnVpbGRFZGl0b3IoanNvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydidWlsZEVkaXRvciddLCAnYnVpbGRFZGl0b3InLCBqc29uLCB0aGlzLl9jb25maWcpO1xuICAgIGlmICghdGhpcy5yZXNFZCAmJiBqc29uKSB7XG4gICAgICB0aGlzLnJlc0VkID0gY3JlYXRlKHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQsIHRoaXMuc2V0T3B0aW9ucygpKTtcbiAgICB9XG4gICAgaWYoISF0aGlzLnJlc0VkKSB7XG4gICAgICB0aGlzLnJlc0VkLnNldFZhbHVlKGpzb24gfHwgJycpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGFkanVzdEhlaWdodCgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgIGNvbnN0IGVsID0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGNvZGVDb250YWluZXIgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2aWV3LWxpbmVzJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBjb2RlQ29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgIGxldCBwcmV2TGluZUNvdW50ID0gMDtcbiAgICAgIGlmICghY29udGFpbmVySGVpZ2h0KSB7XG4gICAgICAgIC8vIGRvbSBoYXNuJ3QgZmluaXNoZWQgc2V0dGxpbmcgZG93bi4gd2FpdCBhIGJpdCBtb3JlLlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuYWRqdXN0SGVpZ2h0KCksIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGVpZ2h0ID1cbiAgICAgICAgICAgIGNvZGVDb250YWluZXIuY2hpbGRFbGVtZW50Q291bnQgPiBwcmV2TGluZUNvdW50XG4gICAgICAgICAgICAgID8gY29kZUNvbnRhaW5lci5vZmZzZXRIZWlnaHQgLy8gdW5mb2xkXG4gICAgICAgICAgICAgIDogY29kZUNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudCAqIHRoaXMuTElORV9IRUlHSFQgKyB0aGlzLkNPTlRBSU5FUl9HVVRURVI7IC8vIGZvbGRcbiAgICAgICAgICBwcmV2TGluZUNvdW50ID0gY29kZUNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcbiAgICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgICAgIHRoaXMucmVzRWQubGF5b3V0KCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCB0aGlzLl9yZXN1bHQpO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5idWlsZEVkaXRvcihKU09OLnN0cmluZ2lmeSh0aGlzLl9yZXN1bHQpKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucygpOiBJRWRpdG9yT3B0aW9ucyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiAnJyxcbiAgICAgIGxhbmd1YWdlOiAnanNvbicsXG4gICAgICBtaW5pbWFwOiB7ZW5hYmxlZDogdHJ1ZX0sXG4gICAgICBhdXRvbWF0aWNMYXlvdXQ6IHRydWUsXG4gICAgICBzY3JvbGxCZXlvbmRMYXN0TGluZTogZmFsc2UsXG4gICAgICB0aGVtZTogdGhpcy5tb25hY29UaGVtZSxcbiAgICAgIHJlYWRPbmx5OiAhIXRoaXMuX2NvbmZpZy5lZGl0b3IucmF3UmVzdWx0c1JlYWRPbmx5LFxuICAgICAgZml4ZWRPdmVyZmxvd1dpZGdldHM6IHRydWUsXG4gICAgICBsaW5lTnVtYmVyczogJ29uJyxcbiAgICAgIHdvcmRXcmFwOiAnb24nXG4gICAgfSBhcyBJRWRpdG9yT3B0aW9ucztcbiAgfVxufVxuIl19