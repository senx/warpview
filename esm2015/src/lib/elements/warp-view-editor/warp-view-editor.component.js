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
/* tslint:disable:no-string-literal */
import { editor, Range } from 'monaco-editor';
import { Utils } from '../../model/utils';
import { Config } from '../../model/config';
import { Logger } from '../../model/logger';
import { BubblingEvents } from '../../model/bubblingEvent';
import WarpScriptParser from '../../model/warpScriptParser';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProviderRegistrar } from './providers/ProviderRegistrar';
import { EditorUtils } from './providers/editorUtils';
var create = editor.create;
export class WarpViewEditorComponent {
    constructor(el, http) {
        this.el = el;
        this.http = http;
        this.url = '';
        this.lang = 'warpscript';
        this._showExecute = true;
        this.warpViewEditorStatusEvent = new EventEmitter();
        this.warpViewEditorErrorEvent = new EventEmitter();
        this.warpViewEditorWarpscriptChanged = new EventEmitter();
        this.warpViewEditorWarpscriptResult = new EventEmitter();
        this.warpViewEditorLoaded = new EventEmitter();
        this.warpViewEditorSize = new EventEmitter();
        this.warpViewEditorBreakPoint = new EventEmitter();
        this.warpViewEditorCtrlClick = new EventEmitter();
        this.warpViewEditorDatavizRequested = new EventEmitter();
        this.loading = false;
        this.selectedResultTab = -1;
        this.headers = this.getItems();
        this.innerConfig = new Config();
        // tslint:disable-next-line:variable-name
        this._theme = 'light';
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this._displayMessages = true;
        this._showDataviz = false;
        this._showResult = true;
        this._imageTab = false;
        this.monacoTheme = 'vs';
        this.breakpoints = {};
        this.decoration = [];
        this.previousParentHeight = -1;
        this.previousParentWidth = -1;
        this.LOG = new Logger(WarpViewEditorComponent, this._debug);
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
        this.LOG.debug(['themeHandler'], 'The new value of theme is: ', newValue);
        if ('dark' === newValue) {
            this.monacoTheme = 'vs-dark';
        }
        else {
            this.monacoTheme = 'vs';
        }
        this.LOG.debug(['themeHandler'], 'The new value of theme is: ', this.monacoTheme);
        this._theme = newValue;
        if (editor) {
            editor.setTheme(this.monacoTheme);
        }
    }
    get theme() {
        return this._theme;
    }
    set warpscript(newValue) {
        this.LOG.debug(['warpscriptHandler'], 'The new value of warpscript is: ', newValue);
        if (this.ed) {
            this.ed.setValue(newValue);
        }
        this._warpscript = newValue;
        this.loading = false;
    }
    get warpscript() {
        return this._warpscript;
    }
    get showDataviz() {
        return this._showDataviz;
    }
    set showDataviz(value) {
        this._showDataviz = '' + value !== 'false';
    }
    get showExecute() {
        return this._showExecute;
    }
    set showExecute(value) {
        this._showExecute = '' + value !== 'false';
    }
    get showResult() {
        return this._showResult;
    }
    set showResult(value) {
        this._showResult = '' + value !== 'false';
    }
    set config(config) {
        let conf = (typeof config === 'string') ? JSON.parse(config || '{}') : config || {};
        this.innerConfig = Utils.mergeDeep(this.innerConfig, conf);
        this.LOG.debug(['config'], this.innerConfig, conf);
        if (this.ed) {
            this.LOG.debug(['config'], this.innerConfig);
            this.ed.updateOptions(this.setOptions());
        }
    }
    get config() {
        return this.innerConfig;
    }
    get displayMessages() {
        return this._displayMessages;
    }
    set displayMessages(value) {
        this._displayMessages = '' + value !== 'false';
    }
    get widthPx() {
        return this._widthPx;
    }
    set widthPx(value) {
        this._widthPx = parseInt('' + value, 10);
    }
    get heightLine() {
        return this._heightLine;
    }
    set heightLine(value) {
        this._heightLine = parseInt('' + value, 10);
    }
    get heightPx() {
        return this._heightPx;
    }
    set heightPx(value) {
        this._heightPx = parseInt('' + value, 10);
    }
    get imageTab() {
        return this._imageTab;
    }
    set imageTab(value) {
        this._imageTab = '' + value !== 'false';
    }
    get initialSize() {
        return this._initialSize;
    }
    set initialSize(value) {
        this._initialSize = typeof value === 'string' ? JSON.parse(value) : value;
    }
    // noinspection JSUnusedGlobalSymbols
    ngOnInit() {
        this.LOG.debug(['ngOnInit'], 'innerConfig: ', this.innerConfig);
        if ('dark' === this._theme) {
            this.monacoTheme = 'vs-dark';
        }
        this.LOG.debug(['ngOnInit'], 'ngOnInit theme is: ', this._theme);
        self.MonacoEnvironment = {
            getWorkerUrl: () => URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@0.18.1/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@0.18.1/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }))
        };
        ProviderRegistrar.register();
    }
    resizeWatcher() {
        const editorParentWidth = this.editor.nativeElement.parentElement.clientWidth;
        const editorParentHeight = this.editor.nativeElement.parentElement.clientHeight
            - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
            - parseInt(window.getComputedStyle(this.editor.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);
        let warpviewParentHeight = this.el.nativeElement.parentElement.clientHeight
            - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-top'), 10)
            - parseInt(window.getComputedStyle(this.el.nativeElement.parentElement).getPropertyValue('padding-bottom'), 10);
        warpviewParentHeight = Math.max(warpviewParentHeight, WarpViewEditorComponent.MIN_HEIGHT);
        // fix the 5px editor height in chrome by setting the wrapper height at element level
        if (Math.abs(this.wrapper.nativeElement.clientHeight - warpviewParentHeight) > 30) {
            this.wrapper.nativeElement.style.height = warpviewParentHeight + 'px';
        }
        // watch for editor parent' size change
        if (editorParentHeight !== this.previousParentHeight || editorParentWidth !== this.previousParentWidth) {
            this.previousParentHeight = editorParentHeight;
            this.previousParentWidth = editorParentWidth;
            const editorH = Math.floor(editorParentHeight) - (this.buttons ? this.buttons.nativeElement.clientHeight : 0);
            const editorW = Math.floor(this.editor.nativeElement.parentElement.clientWidth);
            this.ed.layout({ height: editorH, width: editorW });
            this.editor.nativeElement.style.overflow = 'hidden';
        }
    }
    setOptions() {
        return {
            quickSuggestionsDelay: this.innerConfig.editor.quickSuggestionsDelay,
            quickSuggestions: this.innerConfig.editor.quickSuggestions,
            suggestOnTriggerCharacters: this.innerConfig.editor.quickSuggestions,
            // monaco auto layout is ok if parent has a fixed size, not 100% or a calc ( % px ) formula.
            automaticLayout: !!this._heightPx,
            hover: { enabled: this.innerConfig.hover },
            readOnly: this.innerConfig.readOnly,
            fixedOverflowWidgets: true,
            folding: true,
            glyphMargin: this.innerConfig.editor.enableDebug
        };
    }
    ngAfterViewInit() {
        this.LOG.debug(['ngAfterViewInit'], 'height', this._heightPx);
        if (!!this._heightPx) {
            // if height-px is set, size is fixed.
            this.el.nativeElement.style.height = this._heightPx + 'px';
            this.wrapper.nativeElement.style.height = this._heightPx + 'px';
            this.resize(true);
        }
        else {
            // compute the layout manually in a 200ms timer
            this.resizeWatcherInt = setInterval(this.resizeWatcher.bind(this), 200);
        }
        try {
            this.innerCode = this.contentWrapper.nativeElement.textContent;
            // add blank lines when needed
            for (let i = this.innerCode.split('\n').length; i < this.innerConfig.editor.minLineNumber; i++) {
                this.innerCode += '\n';
            }
            // trim spaces and line breaks at the beginning (side effect of angular)
            let firstIndex = 0;
            while (this.innerCode[firstIndex] === ' ' || this.innerCode[firstIndex] === '\n') {
                firstIndex++;
            }
            this.innerCode = this.innerCode.substring(firstIndex);
            this.LOG.debug(['ngAfterViewInit'], 'warpscript', this._warpscript);
            this.LOG.debug(['ngAfterViewInit'], 'inner: ', this.innerCode.split('\n'));
            this.LOG.debug(['ngAfterViewInit'], 'innerConfig: ', this.innerConfig);
            const edOpts = this.setOptions();
            this.lastKnownWS = this._warpscript || this.innerCode;
            editor.setTheme(this.monacoTheme);
            this.LOG.debug(['ngAfterViewInit'], 'edOpts: ', edOpts);
            this.ed = create(this.editor.nativeElement, edOpts);
            this.ed.setValue(this.lastKnownWS);
            editor.setModelLanguage(this.ed.getModel(), this.lang);
            if (this.innerConfig.editor.enableDebug) {
                this.ed.onMouseDown(e => {
                    if (e.event.leftButton) {
                        if (e.target.type === 2 || e.target.type === 3 || e.target.type === 4) {
                            this.toggleBreakPoint(e.target.position.lineNumber);
                        }
                    }
                });
            }
            this.ed.getModel().updateOptions({ tabSize: this.innerConfig.editor.tabSize });
            if (this.ed) {
                this.warpViewEditorLoaded.emit('loaded');
                // angular events does not bubble up outside angular component.
                BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorLoaded', 'loaded');
                this.LOG.debug(['ngAfterViewInit'], 'loaded');
                this.ed.getModel().onDidChangeContent((event) => {
                    if (this.lastKnownWS !== this.ed.getValue()) {
                        this.LOG.debug(['ngAfterViewInit'], 'ws changed', event);
                        this.warpViewEditorWarpscriptChanged.emit(this.ed.getValue());
                        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorWarpscriptChanged', this.ed.getValue());
                    }
                });
                // manage the ctrl click, create an event with the statement, the endpoint, the warpfleet repos.
                this.ed.onMouseDown(e => {
                    if ((!this.isMac() && !!e.event.ctrlKey) || (this.isMac() && !!e.event.metaKey)) {
                        // ctrl click on which word ?
                        const name = (this.ed.getModel().getWordAtPosition(e.target.range.getStartPosition()) || { word: undefined }).word;
                        // parse the warpscript
                        const ws = this.ed.getValue();
                        const specialHeaders = WarpScriptParser.extractSpecialComments(ws);
                        const repos = [];
                        const statements = WarpScriptParser.parseWarpScriptStatements(ws);
                        statements.forEach((st, i) => {
                            if (st === 'WF.ADDREPO' && i > 0) {
                                const previousStatement = statements[i - 1];
                                if ((previousStatement.startsWith('"') && previousStatement.endsWith('"'))
                                    || (previousStatement.startsWith('\'') && previousStatement.endsWith('\''))) {
                                    // this is a valid string.
                                    repos.push(previousStatement.substring(1, previousStatement.length - 1));
                                }
                            }
                        });
                        const docParams = {
                            endpoint: specialHeaders.endpoint || this.url,
                            macroName: name,
                            wfRepos: repos
                        };
                        this.warpViewEditorCtrlClick.emit(docParams);
                        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorCtrlClick', docParams);
                    }
                });
            }
        }
        catch (e) {
            this.LOG.error(['ngAfterViewInit'], 'componentDidLoad', e);
        }
    }
    ngOnDestroy() {
        this.LOG.debug(['ngOnDestroy'], 'Component removed from the DOM');
        if (this.resizeWatcherInt) {
            clearInterval(this.resizeWatcherInt);
        }
        if (this.ed) {
            this.ed.dispose();
        }
        if (this.ro) {
            this.ro.disconnect();
        }
        if (this.request) {
            this.request.unsubscribe();
        }
    }
    abort(session) {
        if (this.request) {
            // BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorErrorEvent', this.error);
            if (!!session) {
                const specialHeaders = WarpScriptParser.extractSpecialComments(this.ed.getValue());
                const executionUrl = specialHeaders.endpoint || this.url;
                this.http.post(executionUrl, `<% '${session}' 'WSKILLSESSION' EVAL %> <% -1 %> <% %> TRY`, {
                    // @ts-ignore
                    observe: 'response',
                    // @ts-ignore
                    responseType: 'text',
                    'Accept': 'application/json',
                })
                    .pipe(catchError(this.handleError(undefined)))
                    .subscribe((res) => {
                    if (!!res) {
                        this.LOG.debug(['abort'], 'response', res.body);
                        const r = JSON.parse(res.body);
                        if (!!r[0]) {
                            if (r[0] === 0) {
                                this.sendError('It appears that your Warp 10 is running on multiple backend');
                            }
                            else if (r[0] === -1) {
                                this.sendError(`Unable to WSABORT on ${executionUrl}. Did you activate StackPSWarpScriptExtension?`);
                            }
                            this.sendStatus({
                                message: `${WarpViewEditorComponent.getLabel(this.lang)} aborted.`,
                                ops: parseInt(res.headers.get('x-warp10-ops'), 10),
                                elapsed: parseInt(res.headers.get('x-warp10-elapsed'), 10),
                                fetched: parseInt(res.headers.get('x-warp10-fetched'), 10),
                            });
                        }
                        else {
                            this.sendError(`An error occurs for session: ${session}`);
                        }
                    }
                    this.request.unsubscribe();
                    delete this.request;
                    this.loading = false;
                });
            }
            else {
                this.sendStatus({
                    message: `${WarpViewEditorComponent.getLabel(this.lang)} aborted.`,
                    ops: 0,
                    elapsed: 0,
                    fetched: 0,
                });
                this.request.unsubscribe();
                delete this.request;
                this.loading = false;
            }
        }
    }
    highlight(line) {
        const currentKey = 'hl-' + line;
        Object.keys(this.breakpoints).forEach(k => {
            if (k.startsWith('hl')) {
                delete this.breakpoints[k];
            }
        });
        this.breakpoints[currentKey] = {
            range: new Range(line, 1, line, 1),
            options: {
                isWholeLine: true,
                className: 'warpviewContentClass'
            }
        };
        this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
    }
    toggleBreakPoint(line) {
        const currentKey = 'bp-' + line;
        if (this.breakpoints[currentKey]) {
            delete this.breakpoints[currentKey];
        }
        else {
            this.breakpoints[currentKey] = {
                range: new Range(line, 1, line, 1),
                options: {
                    isWholeLine: true,
                    glyphMarginClassName: 'warpviewGlyphMarginClass'
                }
            };
        }
        this.warpViewEditorBreakPoint.emit(this.breakpoints);
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorBreakPoint', this.breakpoints);
        this.decoration = this.ed.deltaDecorations(this.decoration, Utils.toArray(this.breakpoints));
    }
    handleError(result) {
        return (error) => {
            this.LOG.error(['handleError'], { e: error });
            if (error.status === 0) {
                this.error = `Unable to reach ${error.url}`;
            }
            else {
                if (error.headers.get('X-Warp10-Error-Message') && error.headers.get('X-Warp10-Error-Line')) {
                    this.error = 'line #' + error.headers.get('X-Warp10-Error-Line') + ': ' + error.headers.get('X-Warp10-Error-Message');
                }
                else {
                    this.error = error.statusText;
                }
            }
            this.warpViewEditorErrorEvent.emit(this.error);
            BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorErrorEvent', this.error);
            this.loading = false;
            return of(result);
        };
    }
    execute(session) {
        if (this.ed) {
            this.result = undefined;
            this.status = undefined;
            this.error = undefined;
            this.LOG.debug(['execute'], 'this.ed.getValue()', session, this.ed.getValue());
            this.loading = true;
            // parse comments to look for inline url or preview modifiers
            const specialHeaders = WarpScriptParser.extractSpecialComments(this.ed.getValue());
            const previewType = specialHeaders.displayPreviewOpt || 'none';
            if (previewType === 'I') {
                this.selectedResultTab = 2; // select image tab.
            }
            else if (this.selectedResultTab === 2) {
                this.selectedResultTab = 0; // on next execution, select results tab.
            }
            const executionUrl = specialHeaders.endpoint || this.url;
            // Get Warp10 version
            // @ts-ignore
            let headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
            if (!!session) {
                headers['X-Warp10-WarpScriptSession'] = session;
            }
            let code = this.ed.getValue().replace(/ /gi, ' ');
            if (EditorUtils.FLOWS_LANGUAGE === this.lang) {
                code = `<'
${code}
'>
FLOWS
`;
            }
            this.request = this.http.post(executionUrl, code, {
                // @ts-ignore
                observe: 'response',
                // @ts-ignore
                responseType: 'text',
                headers
            })
                .pipe(catchError(this.handleError(undefined)))
                .subscribe((res) => {
                if (!!res) {
                    this.LOG.debug(['execute'], 'response', res.body);
                    this.warpViewEditorWarpscriptResult.emit(res.body);
                    BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorWarpscriptResult', res.body);
                    this.sendStatus({
                        message: `Your script execution took
 ${EditorUtils.formatElapsedTime(parseInt(res.headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${res.headers.get('x-warp10-fetched')} datapoints and performed
 ${res.headers.get('x-warp10-ops')}  ${WarpViewEditorComponent.getLabel(this.lang)} operations.`,
                        ops: parseInt(res.headers.get('x-warp10-ops'), 10),
                        elapsed: parseInt(res.headers.get('x-warp10-elapsed'), 10),
                        fetched: parseInt(res.headers.get('x-warp10-fetched'), 10),
                    });
                    try {
                        this.result = res.body;
                    }
                    catch (e) {
                        if (e.name && e.message && e.at && e.text) {
                            this.error = `${e.name}: ${e.message} at char ${e.at} => ${e.text}`;
                        }
                        else {
                            this.error = e.toString();
                        }
                        this.result = res.body;
                        this.LOG.error(['execute 1'], this.error);
                        this.sendError(this.error);
                    }
                }
                this.loading = false;
            });
        }
        else {
            this.loading = false;
            this.LOG.error(['execute'], 'no active editor');
        }
    }
    requestDataviz() {
        this.warpViewEditorDatavizRequested.emit(this.result);
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorDatavizRequested', this.result);
    }
    onResized($event) {
        this.LOG.debug(['onResized'], $event.detail.editor);
        this.warpViewEditorSize.emit($event.detail.editor);
    }
    isMac() {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    onKeyDown($event) {
        this.LOG.debug(['onKeyDown'], $event);
        if ((!this.isMac() && !!$event.ctrlKey) || (this.isMac() && !!$event.metaKey)) {
            Array.from(this.editor.nativeElement.getElementsByClassName('mtk8'))
                .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk22')))
                .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk23')))
                .forEach(e => {
                if (!e.textContent.startsWith('$')) {
                    e.classList.add('mouseOver');
                }
            });
        }
    }
    onKeyUp($event) {
        this.LOG.debug(['onKeyUp'], $event);
        Array.from(this.editor.nativeElement.getElementsByClassName('mtk8'))
            .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk22')))
            .concat(Array.from(this.editor.nativeElement.getElementsByClassName('mtk23')))
            .forEach(e => e.classList.remove('mouseOver'));
    }
    resize(initial) {
        window.setTimeout(() => {
            if (initial && (!!this._heightPx)) {
                this.editor.nativeElement.style.height = `calc(100% - ${this.buttons ?
                    this.buttons.nativeElement.clientHeight
                    : 100}px )`;
            }
            if (initial) {
                this.warpViewEditorLoaded.emit();
                BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorLoaded', 'loaded');
                this.LOG.debug(['resize'], 'loaded');
            }
        }, initial ? 500 : 100);
    }
    getItems() {
        const headers = [];
        if (this._showResult) {
            headers.push({ name: 'editor', size: this._initialSize ? this._initialSize.p || 50 : 50 });
            headers.push({ name: 'result', size: this._initialSize ? 100 - this._initialSize.p || 50 : 50 });
        }
        else {
            headers.push({ name: 'editor', size: 100 });
        }
        return headers;
    }
    responsiveStyle() {
        return { height: '100%', width: '100%', overflow: 'hidden' };
    }
    sendError(error) {
        this.error = error;
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorErrorEvent', this.error);
        this.warpViewEditorErrorEvent.emit(this.error);
    }
    sendStatus(status) {
        this.status = Object.assign({}, status);
        BubblingEvents.emitBubblingEvent(this.el, 'warpViewEditorStatusEvent', this.status);
        this.warpViewEditorStatusEvent.emit(this.status);
    }
    static getLabel(lang) {
        switch (lang) {
            case 'flows': return 'FLoWS';
            case 'warpscript': return 'WarpScript';
        }
    }
}
WarpViewEditorComponent.MIN_HEIGHT = 250;
WarpViewEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-editor',
                template: "<!--\n  ~  Copyright 2020 SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  -->\n<div [class]=\"'warp-view-editor wrapper-main ' + _theme\" #wrapper >\n  <div class=\"warpscript\" #content>\n    <ng-content ngProjectAs=\"input\"></ng-content>\n  </div>\n  <div class=\"loader\" *ngIf=\"loading\">\n    <div class=\"spinner\"></div>\n  </div>\n  <wc-split [items]=\"getItems()\" style=\"height: 100%\">\n    <div slot=\"editor\" class=\"editor-wrapper\" style=\"height: 100%\">\n      <div #editor (keydown)=\"onKeyDown($event)\" (keyup)=\"onKeyUp($event)\"></div>\n      <div [class]=\"'warpview-buttons ' + innerConfig.buttons.class\" #buttons>\n        <button type='button' [class]=\"innerConfig.datavizButton.class\"\n                *ngIf=\"showDataviz && result\"\n                (click)=\"requestDataviz()\" [innerHTML]=\"innerConfig.datavizButton.label\">\n        </button>\n        <button type='button' [class]=\"innerConfig.execButton.class\"\n                *ngIf=\"showExecute\"\n                (click)=\"execute()\" [innerHTML]=\"innerConfig.execButton.label\"></button>\n        <div class='messages' *ngIf=\"error || result || status\">\n          <div *ngIf=\"status && _displayMessages\" [class]=\"innerConfig.messageClass\" [innerHTML]=\"status.message\"></div>\n          <div *ngIf=\"error && _displayMessages\" [class]=\"innerConfig.errorClass\" [innerHTML]=\"error\"></div>\n        </div>\n      </div>\n    </div>\n    <div slot=\"result\" *ngIf=\"showResult\" style=\"height: 100%\">\n      <wc-tabs class='wctabs' [selection]=\"selectedResultTab\" style=\"height: 100%\">\n        <wc-tabs-header slot='header' name='tab1'>Results</wc-tabs-header>\n        <wc-tabs-header slot='header' name='tab2'>Raw JSON</wc-tabs-header>\n\n        <wc-tabs-header slot='header' name='tab3' *ngIf=\"imageTab\">Images</wc-tabs-header>\n\n        <wc-tabs-content slot='content' name='tab1'>\n          <div class=\"tab-wrapper\">\n            <warpview-result [theme]=\"theme\" [result]=\"result\" [config]='innerConfig'></warpview-result>\n          </div>\n        </wc-tabs-content>\n\n        <wc-tabs-content slot='content' name='tab2' [responsive]=\"true\">\n          <div class=\"tab-wrapper\" [ngStyle]=\"responsiveStyle()\">\n            <warpview-raw-result [theme]=\"theme\" [result]=\"result\" [config]=\"innerConfig\" [debug]=\"debug\"></warpview-raw-result>\n          </div>\n        </wc-tabs-content>\n\n        <wc-tabs-content slot='content' name='tab3' *ngIf=\"imageTab\">\n          <div class=\"tab-wrapper\">\n            <warpview-image-result [theme]=\"theme\" [result]=\"result\" [config]=\"innerConfig\" [debug]=\"_debug\"></warpview-image-result>\n          </div>\n        </wc-tabs-content>\n\n      </wc-tabs>\n    </div>\n  </wc-split>\n</div>\n",
                encapsulation: ViewEncapsulation.Emulated,
                styles: ["/*!\n *  Copyright 2020 SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n */:host{height:100%;width:100%}:host .warpview-buttons{align-items:flex-start;display:flex}:host>div{height:100%;width:100%}:host .warpscript{display:none}:host .editor-wrapper{height:100%;overflow:auto}:host .wctabs{height:100%}:host .editor{height:100%;left:0;margin:0;max-height:100%!important;padding:0;position:absolute;top:0;width:100%}:host .tab-wrapper,:host div[slot]{height:100%}:host .messages{padding:5px;width:100%}:host .messages>*{font-size:12px;margin:0;padding:5px}:host .warp-view-editor.wrapper-main{bottom:0;left:0;margin:10px;position:relative;right:0;top:0;width:calc(100% - 20px)}:host .warp-view-editor.wrapper-main .loader{background-color:rgba(0,0,0,.3);bottom:0;left:0;position:absolute;right:0;top:0;z-index:1}:host .warp-view-editor.wrapper-main .loader .spinner{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite;border-bottom-color:transparent;border-left-color:transparent;border-radius:50%;border-right-color:transparent;border-style:solid;border-top-color:var(--warp-view-spinner-color,#5899da);bottom:calc(50% - 25px);height:50px;left:calc(50% - 25px);margin:auto;overflow:visible;position:absolute;right:calc(50% - 25px);top:calc(50% - 25px);width:50px;z-index:999}:host .warp-view-editor.wrapper-main.dark{--warp-view-image-border-color:#a0a0a0;--warp-view-spinner-color:#f3f3f3;--wc-split-gutter-color:#343a40;--wc-tab-header-bg-color:transparent;--wc-tab-header-border-color:#343a40;--wc-tab-header-color:#f8f9fa;--wc-tab-header-disabled-bg-color:rgba(0,0,0,0.5);--wc-tab-header-disabled-color:hsla(0,0%,100%,0.5);--wc-tab-header-selected-bg-color:#f8f9fa;--wc-tab-header-selected-border-color:#343a40;--wc-tab-header-selected-color:#1e1e1e;background-color:#1e1e1e;color:#f8f9fa}:host .warp-view-editor.wrapper-main.light{background-color:#fff!important;color:#000}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(1turn)}}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}:host wc-tabs{height:100%}"]
            },] }
];
WarpViewEditorComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: HttpClient }
];
WarpViewEditorComponent.propDecorators = {
    url: [{ type: Input }],
    lang: [{ type: Input }],
    debug: [{ type: Input }],
    theme: [{ type: Input }],
    warpscript: [{ type: Input, args: ['warpscript',] }],
    showDataviz: [{ type: Input, args: ['showDataviz',] }],
    showExecute: [{ type: Input, args: ['showExecute',] }],
    showResult: [{ type: Input, args: ['showResult',] }],
    config: [{ type: Input, args: ['config',] }],
    displayMessages: [{ type: Input, args: ['displayMessages',] }],
    widthPx: [{ type: Input, args: ['widthPx',] }],
    heightLine: [{ type: Input, args: ['heightLine',] }],
    heightPx: [{ type: Input, args: ['heightPx',] }],
    imageTab: [{ type: Input, args: ['imageTab',] }],
    initialSize: [{ type: Input, args: ['initialSize',] }],
    warpViewEditorStatusEvent: [{ type: Output, args: ['warpViewEditorStatusEvent',] }],
    warpViewEditorErrorEvent: [{ type: Output, args: ['warpViewEditorErrorEvent',] }],
    warpViewEditorWarpscriptChanged: [{ type: Output, args: ['warpViewEditorWarpscriptChanged',] }],
    warpViewEditorWarpscriptResult: [{ type: Output, args: ['warpViewEditorWarpscriptResult',] }],
    warpViewEditorLoaded: [{ type: Output, args: ['warpViewEditorLoaded',] }],
    warpViewEditorSize: [{ type: Output, args: ['warpViewEditorSize',] }],
    warpViewEditorBreakPoint: [{ type: Output, args: ['warpViewEditorBreakPoint',] }],
    warpViewEditorCtrlClick: [{ type: Output, args: ['warpViewEditorCtrlClick',] }],
    warpViewEditorDatavizRequested: [{ type: Output, args: ['warpViewEditorDatavizRequested',] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    editor: [{ type: ViewChild, args: ['editor', { static: true },] }],
    buttons: [{ type: ViewChild, args: ['buttons', { static: true },] }],
    contentWrapper: [{ type: ViewChild, args: ['content', { static: true },] }],
    abort: [{ type: Input }],
    highlight: [{ type: Input }],
    execute: [{ type: Input }],
    onResized: [{ type: HostListener, args: ['document:resize', ['$event'],] }, { type: HostListener, args: ['resized', ['$event'],] }],
    resize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwdmlldy1lZGl0b3IvcHJvamVjdHMvd2FycHZpZXctZWRpdG9yLW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZWRpdG9yL3dhcnAtdmlldy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRUgsc0NBQXNDO0FBQ3RDLE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUV4QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUN6RCxPQUFPLGdCQUErRCxNQUFNLDhCQUE4QixDQUFDO0FBQzNHLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQWtDLE1BQU0sc0JBQXNCLENBQUM7QUFDakYsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBYSxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXBELElBQU8sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7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QUFvQjt1Q0FDM0IsTUFBTSxTQUFDLDBCQUEwQjtzQ0FDakMsTUFBTSxTQUFDLHlCQUF5Qjs2Q0FDaEMsTUFBTSxTQUFDLGdDQUFnQztzQkFFdkMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7cUJBQ25DLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3NCQUNsQyxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzs2QkFDbkMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0JBZ05uQyxLQUFLO3dCQXFETCxLQUFLO3NCQXVETCxLQUFLO3dCQWlGTCxZQUFZLFNBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FDMUMsWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztxQkFnQ2xDLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1zdHJpbmctbGl0ZXJhbCAqL1xuaW1wb3J0IHtlZGl0b3IsIFJhbmdlfSBmcm9tICdtb25hY28tZWRpdG9yJztcbmltcG9ydCB7VXRpbHN9IGZyb20gJy4uLy4uL21vZGVsL3V0aWxzJztcbmltcG9ydCBSZXNpemVPYnNlcnZlciBmcm9tICdyZXNpemUtb2JzZXJ2ZXItcG9seWZpbGwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL21vZGVsL2NvbmZpZyc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vbW9kZWwvbG9nZ2VyJztcbmltcG9ydCB7QnViYmxpbmdFdmVudHN9IGZyb20gJy4uLy4uL21vZGVsL2J1YmJsaW5nRXZlbnQnO1xuaW1wb3J0IFdhcnBTY3JpcHRQYXJzZXIsIHtEb2NHZW5lcmF0aW9uUGFyYW1zLCBTcGVjaWFsQ29tbWVudENvbW1hbmRzfSBmcm9tICcuLi8uLi9tb2RlbC93YXJwU2NyaXB0UGFyc2VyJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge2NhdGNoRXJyb3J9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1Byb3ZpZGVyUmVnaXN0cmFyfSBmcm9tICcuL3Byb3ZpZGVycy9Qcm92aWRlclJlZ2lzdHJhcic7XG5pbXBvcnQge0VkaXRvclV0aWxzfSBmcm9tICcuL3Byb3ZpZGVycy9lZGl0b3JVdGlscyc7XG5pbXBvcnQgSVN0YW5kYWxvbmVDb2RlRWRpdG9yID0gZWRpdG9yLklTdGFuZGFsb25lQ29kZUVkaXRvcjtcbmltcG9ydCBjcmVhdGUgPSBlZGl0b3IuY3JlYXRlO1xuaW1wb3J0IElFZGl0b3JPcHRpb25zID0gZWRpdG9yLklFZGl0b3JPcHRpb25zO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1lZGl0b3InLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWVkaXRvci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1lZGl0b3IuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWRcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgdXJsID0gJyc7XG4gIEBJbnB1dCgpIGxhbmc6ICd3YXJwc2NyaXB0JyB8ICdmbG93cycgPSAnd2FycHNjcmlwdCc7XG5cbiAgQElucHV0KCkgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1ZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRlYnVnID0gJ3RydWUnID09PSBkZWJ1ZztcbiAgICB9XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHRoZW1lKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RoZW1lSGFuZGxlciddLCAnVGhlIG5ldyB2YWx1ZSBvZiB0aGVtZSBpczogJywgbmV3VmFsdWUpO1xuICAgIGlmICgnZGFyaycgPT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLm1vbmFjb1RoZW1lID0gJ3ZzLWRhcmsnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vbmFjb1RoZW1lID0gJ3ZzJztcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWyd0aGVtZUhhbmRsZXInXSwgJ1RoZSBuZXcgdmFsdWUgb2YgdGhlbWUgaXM6ICcsIHRoaXMubW9uYWNvVGhlbWUpO1xuICAgIHRoaXMuX3RoZW1lID0gbmV3VmFsdWU7XG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgZWRpdG9yLnNldFRoZW1lKHRoaXMubW9uYWNvVGhlbWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0aGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90aGVtZTtcbiAgfVxuXG4gIEBJbnB1dCgnd2FycHNjcmlwdCcpXG4gIHNldCB3YXJwc2NyaXB0KG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3dhcnBzY3JpcHRIYW5kbGVyJ10sICdUaGUgbmV3IHZhbHVlIG9mIHdhcnBzY3JpcHQgaXM6ICcsIG5ld1ZhbHVlKTtcbiAgICBpZiAodGhpcy5lZCkge1xuICAgICAgdGhpcy5lZC5zZXRWYWx1ZShuZXdWYWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX3dhcnBzY3JpcHQgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCB3YXJwc2NyaXB0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3dhcnBzY3JpcHQ7XG4gIH1cblxuICBASW5wdXQoJ3Nob3dEYXRhdml6JylcbiAgZ2V0IHNob3dEYXRhdml6KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93RGF0YXZpejtcbiAgfVxuXG4gIHNldCBzaG93RGF0YXZpeih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dEYXRhdml6ID0gJycgKyB2YWx1ZSAhPT0gJ2ZhbHNlJztcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dFeGVjdXRlID0gdHJ1ZTtcbiAgQElucHV0KCdzaG93RXhlY3V0ZScpXG4gIGdldCBzaG93RXhlY3V0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0V4ZWN1dGU7XG4gIH1cblxuICBzZXQgc2hvd0V4ZWN1dGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93RXhlY3V0ZSA9ICcnICsgdmFsdWUgIT09ICdmYWxzZSc7XG4gIH1cblxuICBASW5wdXQoJ3Nob3dSZXN1bHQnKVxuICBnZXQgc2hvd1Jlc3VsdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd1Jlc3VsdDtcbiAgfVxuXG4gIHNldCBzaG93UmVzdWx0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1Jlc3VsdCA9ICcnICsgdmFsdWUgIT09ICdmYWxzZSc7XG4gIH1cblxuICBASW5wdXQoJ2NvbmZpZycpIHNldCBjb25maWcoY29uZmlnOiBDb25maWcgfCBzdHJpbmcpIHtcbiAgICBsZXQgY29uZiA9ICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykgPyBKU09OLnBhcnNlKGNvbmZpZyB8fCAne30nKSA6IGNvbmZpZyB8fCB7fTtcbiAgICB0aGlzLmlubmVyQ29uZmlnID0gVXRpbHMubWVyZ2VEZWVwKHRoaXMuaW5uZXJDb25maWcsIGNvbmYpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29uZmlnJ10sIHRoaXMuaW5uZXJDb25maWcsIGNvbmYpO1xuICAgIGlmICh0aGlzLmVkKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbmZpZyddLCB0aGlzLmlubmVyQ29uZmlnKTtcbiAgICAgIHRoaXMuZWQudXBkYXRlT3B0aW9ucyh0aGlzLnNldE9wdGlvbnMoKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNvbmZpZygpOiBDb25maWcgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlubmVyQ29uZmlnO1xuICB9XG5cbiAgQElucHV0KCdkaXNwbGF5TWVzc2FnZXMnKVxuICBnZXQgZGlzcGxheU1lc3NhZ2VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5TWVzc2FnZXM7XG4gIH1cblxuICBzZXQgZGlzcGxheU1lc3NhZ2VzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzcGxheU1lc3NhZ2VzID0gJycgKyB2YWx1ZSAhPT0gJ2ZhbHNlJztcbiAgfVxuXG4gIEBJbnB1dCgnd2lkdGhQeCcpXG4gIGdldCB3aWR0aFB4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoUHg7XG4gIH1cblxuICBzZXQgd2lkdGhQeCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fd2lkdGhQeCA9IHBhcnNlSW50KCcnICsgdmFsdWUsIDEwKTtcbiAgfVxuXG4gIEBJbnB1dCgnaGVpZ2h0TGluZScpXG4gIGdldCBoZWlnaHRMaW5lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodExpbmU7XG4gIH1cblxuICBzZXQgaGVpZ2h0TGluZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5faGVpZ2h0TGluZSA9IHBhcnNlSW50KCcnICsgdmFsdWUsIDEwKTtcbiAgfVxuXG4gIEBJbnB1dCgnaGVpZ2h0UHgnKVxuICBnZXQgaGVpZ2h0UHgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0UHg7XG4gIH1cblxuICBzZXQgaGVpZ2h0UHgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2hlaWdodFB4ID0gcGFyc2VJbnQoJycgKyB2YWx1ZSwgMTApO1xuICB9XG5cbiAgQElucHV0KCdpbWFnZVRhYicpXG4gIGdldCBpbWFnZVRhYigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VUYWI7XG4gIH1cblxuICBzZXQgaW1hZ2VUYWIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pbWFnZVRhYiA9ICcnICsgdmFsdWUgIT09ICdmYWxzZSc7XG4gIH1cblxuICBASW5wdXQoJ2luaXRpYWxTaXplJylcbiAgZ2V0IGluaXRpYWxTaXplKCk6IHsgdz86IG51bWJlciwgaD86IG51bWJlciwgbmFtZT86IHN0cmluZywgcD86IG51bWJlciB9IHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faW5pdGlhbFNpemU7XG4gIH1cblxuICBzZXQgaW5pdGlhbFNpemUodmFsdWU6IHsgdz86IG51bWJlciwgaD86IG51bWJlciwgbmFtZT86IHN0cmluZywgcD86IG51bWJlciB9IHwgc3RyaW5nKSB7XG4gICAgdGhpcy5faW5pdGlhbFNpemUgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfVxuXG4gIEBPdXRwdXQoJ3dhcnBWaWV3RWRpdG9yU3RhdHVzRXZlbnQnKSB3YXJwVmlld0VkaXRvclN0YXR1c0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3RWRpdG9yRXJyb3JFdmVudCcpIHdhcnBWaWV3RWRpdG9yRXJyb3JFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0VkaXRvcldhcnBzY3JpcHRDaGFuZ2VkJykgd2FycFZpZXdFZGl0b3JXYXJwc2NyaXB0Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0VkaXRvcldhcnBzY3JpcHRSZXN1bHQnKSB3YXJwVmlld0VkaXRvcldhcnBzY3JpcHRSZXN1bHQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdFZGl0b3JMb2FkZWQnKSB3YXJwVmlld0VkaXRvckxvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0VkaXRvclNpemUnKSB3YXJwVmlld0VkaXRvclNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdFZGl0b3JCcmVha1BvaW50Jykgd2FycFZpZXdFZGl0b3JCcmVha1BvaW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3RWRpdG9yQ3RybENsaWNrJykgd2FycFZpZXdFZGl0b3JDdHJsQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdFZGl0b3JEYXRhdml6UmVxdWVzdGVkJykgd2FycFZpZXdFZGl0b3JEYXRhdml6UmVxdWVzdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQFZpZXdDaGlsZCgnd3JhcHBlcicsIHtzdGF0aWM6IHRydWV9KSB3cmFwcGVyOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnZWRpdG9yJywge3N0YXRpYzogdHJ1ZX0pIGVkaXRvcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2J1dHRvbnMnLCB7c3RhdGljOiB0cnVlfSkgYnV0dG9uczogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7c3RhdGljOiB0cnVlfSkgY29udGVudFdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIHJlc3VsdDogc3RyaW5nO1xuICBzdGF0dXM6IHsgbWVzc2FnZTogc3RyaW5nLCBvcHM6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyLCBmZXRjaGVkOiBudW1iZXIgfTtcbiAgZXJyb3I6IHN0cmluZztcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzZWxlY3RlZFJlc3VsdFRhYiA9IC0xO1xuICBsYXN0S25vd25XUzogc3RyaW5nO1xuICBoZWFkZXJzID0gdGhpcy5nZXRJdGVtcygpO1xuICBpbm5lckNvbmZpZyA9IG5ldyBDb25maWcoKTtcbiAgcm86IFJlc2l6ZU9ic2VydmVyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfdGhlbWUgPSAnbGlnaHQnO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfd2FycHNjcmlwdDogc3RyaW5nO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfZGVidWcgPSBmYWxzZTtcbiAgX2Rpc3BsYXlNZXNzYWdlcyA9IHRydWU7XG4gIF9zaG93RGF0YXZpeiA9IGZhbHNlO1xuICBwcml2YXRlIF9oZWlnaHRQeDogbnVtYmVyO1xuICBwcml2YXRlIF9oZWlnaHRMaW5lOiBudW1iZXI7XG4gIHByaXZhdGUgX3Nob3dSZXN1bHQgPSB0cnVlO1xuICBwcml2YXRlIF9pbWFnZVRhYiA9IGZhbHNlO1xuICBwcml2YXRlIF93aWR0aFB4OiBudW1iZXI7XG4gIHByaXZhdGUgX2luaXRpYWxTaXplOiB7IHc/OiBudW1iZXIsIGg/OiBudW1iZXIsIG5hbWU/OiBzdHJpbmcsIHA/OiBudW1iZXIgfTtcbiAgcHJpdmF0ZSBzdGF0aWMgTUlOX0hFSUdIVCA9IDI1MDtcbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSBlZDogSVN0YW5kYWxvbmVDb2RlRWRpdG9yO1xuICBwcml2YXRlIG1vbmFjb1RoZW1lID0gJ3ZzJztcbiAgcHJpdmF0ZSBpbm5lckNvZGU6IHN0cmluZztcbiAgcHJpdmF0ZSBicmVha3BvaW50cyA9IHt9O1xuICBwcml2YXRlIGRlY29yYXRpb24gPSBbXTtcbiAgcHJpdmF0ZSBwcmV2aW91c1BhcmVudEhlaWdodCA9IC0xO1xuICBwcml2YXRlIHByZXZpb3VzUGFyZW50V2lkdGggPSAtMTtcbiAgcHJpdmF0ZSByZXF1ZXN0OiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgcmVzaXplV2F0Y2hlckludDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0VkaXRvckNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nT25Jbml0J10sICdpbm5lckNvbmZpZzogJywgdGhpcy5pbm5lckNvbmZpZyk7XG4gICAgaWYgKCdkYXJrJyA9PT0gdGhpcy5fdGhlbWUpIHtcbiAgICAgIHRoaXMubW9uYWNvVGhlbWUgPSAndnMtZGFyayc7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdPbkluaXQnXSwgJ25nT25Jbml0IHRoZW1lIGlzOiAnLCB0aGlzLl90aGVtZSk7XG4gICAgKHNlbGYgYXMgYW55KS5Nb25hY29FbnZpcm9ubWVudCA9IHtcbiAgICAgIGdldFdvcmtlclVybDogKCkgPT4gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYFxuXHRzZWxmLk1vbmFjb0Vudmlyb25tZW50ID0ge1xuXHRcdGJhc2VVcmw6ICdodHRwczovL3VucGtnLmNvbS9tb25hY28tZWRpdG9yQDAuMTguMS9taW4vJ1xuXHR9O1xuXHRpbXBvcnRTY3JpcHRzKCdodHRwczovL3VucGtnLmNvbS9tb25hY28tZWRpdG9yQDAuMTguMS9taW4vdnMvYmFzZS93b3JrZXIvd29ya2VyTWFpbi5qcycpO1xuYF0sIHt0eXBlOiAndGV4dC9qYXZhc2NyaXB0J30pKVxuICAgIH07XG4gICAgUHJvdmlkZXJSZWdpc3RyYXIucmVnaXN0ZXIoKTtcbiAgfVxuXG4gIHJlc2l6ZVdhdGNoZXIoKSB7XG4gICAgY29uc3QgZWRpdG9yUGFyZW50V2lkdGggPSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgZWRpdG9yUGFyZW50SGVpZ2h0ID0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgLSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctdG9wJyksIDEwKVxuICAgICAgLSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcblxuICAgIGxldCB3YXJwdmlld1BhcmVudEhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgLSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSwgMTApXG4gICAgICAtIHBhcnNlSW50KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG4gICAgd2FycHZpZXdQYXJlbnRIZWlnaHQgPSBNYXRoLm1heCh3YXJwdmlld1BhcmVudEhlaWdodCwgV2FycFZpZXdFZGl0b3JDb21wb25lbnQuTUlOX0hFSUdIVCk7XG4gICAgLy8gZml4IHRoZSA1cHggZWRpdG9yIGhlaWdodCBpbiBjaHJvbWUgYnkgc2V0dGluZyB0aGUgd3JhcHBlciBoZWlnaHQgYXQgZWxlbWVudCBsZXZlbFxuICAgIGlmIChNYXRoLmFicyh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQgLSB3YXJwdmlld1BhcmVudEhlaWdodCkgPiAzMCkge1xuICAgICAgdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gd2FycHZpZXdQYXJlbnRIZWlnaHQgKyAncHgnO1xuICAgIH1cbiAgICAvLyB3YXRjaCBmb3IgZWRpdG9yIHBhcmVudCcgc2l6ZSBjaGFuZ2VcbiAgICBpZiAoZWRpdG9yUGFyZW50SGVpZ2h0ICE9PSB0aGlzLnByZXZpb3VzUGFyZW50SGVpZ2h0IHx8IGVkaXRvclBhcmVudFdpZHRoICE9PSB0aGlzLnByZXZpb3VzUGFyZW50V2lkdGgpIHtcbiAgICAgIHRoaXMucHJldmlvdXNQYXJlbnRIZWlnaHQgPSBlZGl0b3JQYXJlbnRIZWlnaHQ7XG4gICAgICB0aGlzLnByZXZpb3VzUGFyZW50V2lkdGggPSBlZGl0b3JQYXJlbnRXaWR0aDtcbiAgICAgIGNvbnN0IGVkaXRvckggPSBNYXRoLmZsb29yKGVkaXRvclBhcmVudEhlaWdodCkgLSAodGhpcy5idXR0b25zID8gdGhpcy5idXR0b25zLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0IDogMCk7XG4gICAgICBjb25zdCBlZGl0b3JXID0gTWF0aC5mbG9vcih0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICAgICAgdGhpcy5lZC5sYXlvdXQoe2hlaWdodDogZWRpdG9ySCwgd2lkdGg6IGVkaXRvcld9KTtcbiAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb25zKCk6IElFZGl0b3JPcHRpb25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgcXVpY2tTdWdnZXN0aW9uc0RlbGF5OiB0aGlzLmlubmVyQ29uZmlnLmVkaXRvci5xdWlja1N1Z2dlc3Rpb25zRGVsYXksXG4gICAgICBxdWlja1N1Z2dlc3Rpb25zOiB0aGlzLmlubmVyQ29uZmlnLmVkaXRvci5xdWlja1N1Z2dlc3Rpb25zLFxuICAgICAgc3VnZ2VzdE9uVHJpZ2dlckNoYXJhY3RlcnM6IHRoaXMuaW5uZXJDb25maWcuZWRpdG9yLnF1aWNrU3VnZ2VzdGlvbnMsXG4gICAgICAvLyBtb25hY28gYXV0byBsYXlvdXQgaXMgb2sgaWYgcGFyZW50IGhhcyBhIGZpeGVkIHNpemUsIG5vdCAxMDAlIG9yIGEgY2FsYyAoICUgcHggKSBmb3JtdWxhLlxuICAgICAgYXV0b21hdGljTGF5b3V0OiAhIXRoaXMuX2hlaWdodFB4LFxuICAgICAgaG92ZXI6IHtlbmFibGVkOiB0aGlzLmlubmVyQ29uZmlnLmhvdmVyfSxcbiAgICAgIHJlYWRPbmx5OiB0aGlzLmlubmVyQ29uZmlnLnJlYWRPbmx5LFxuICAgICAgZml4ZWRPdmVyZmxvd1dpZGdldHM6IHRydWUsXG4gICAgICBmb2xkaW5nOiB0cnVlLFxuICAgICAgZ2x5cGhNYXJnaW46IHRoaXMuaW5uZXJDb25maWcuZWRpdG9yLmVuYWJsZURlYnVnXG4gICAgfTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCAnaGVpZ2h0JywgdGhpcy5faGVpZ2h0UHgpO1xuICAgIGlmICghIXRoaXMuX2hlaWdodFB4KSB7XG4gICAgICAvLyBpZiBoZWlnaHQtcHggaXMgc2V0LCBzaXplIGlzIGZpeGVkLlxuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuX2hlaWdodFB4ICsgJ3B4JztcbiAgICAgIHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuX2hlaWdodFB4ICsgJ3B4JztcbiAgICAgIHRoaXMucmVzaXplKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb21wdXRlIHRoZSBsYXlvdXQgbWFudWFsbHkgaW4gYSAyMDBtcyB0aW1lclxuICAgICAgdGhpcy5yZXNpemVXYXRjaGVySW50ID0gc2V0SW50ZXJ2YWwodGhpcy5yZXNpemVXYXRjaGVyLmJpbmQodGhpcyksIDIwMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmlubmVyQ29kZSA9IHRoaXMuY29udGVudFdyYXBwZXIubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcbiAgICAgIC8vIGFkZCBibGFuayBsaW5lcyB3aGVuIG5lZWRlZFxuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuaW5uZXJDb2RlLnNwbGl0KCdcXG4nKS5sZW5ndGg7IGkgPCB0aGlzLmlubmVyQ29uZmlnLmVkaXRvci5taW5MaW5lTnVtYmVyOyBpKyspIHtcbiAgICAgICAgdGhpcy5pbm5lckNvZGUgKz0gJ1xcbic7XG4gICAgICB9XG4gICAgICAvLyB0cmltIHNwYWNlcyBhbmQgbGluZSBicmVha3MgYXQgdGhlIGJlZ2lubmluZyAoc2lkZSBlZmZlY3Qgb2YgYW5ndWxhcilcbiAgICAgIGxldCBmaXJzdEluZGV4ID0gMDtcbiAgICAgIHdoaWxlICh0aGlzLmlubmVyQ29kZVtmaXJzdEluZGV4XSA9PT0gJyAnIHx8IHRoaXMuaW5uZXJDb2RlW2ZpcnN0SW5kZXhdID09PSAnXFxuJykge1xuICAgICAgICBmaXJzdEluZGV4Kys7XG4gICAgICB9XG4gICAgICB0aGlzLmlubmVyQ29kZSA9IHRoaXMuaW5uZXJDb2RlLnN1YnN0cmluZyhmaXJzdEluZGV4KTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdBZnRlclZpZXdJbml0J10sICd3YXJwc2NyaXB0JywgdGhpcy5fd2FycHNjcmlwdCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCAnaW5uZXI6ICcsIHRoaXMuaW5uZXJDb2RlLnNwbGl0KCdcXG4nKSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCAnaW5uZXJDb25maWc6ICcsIHRoaXMuaW5uZXJDb25maWcpO1xuICAgICAgY29uc3QgZWRPcHRzOiBJRWRpdG9yT3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucygpO1xuICAgICAgdGhpcy5sYXN0S25vd25XUyA9IHRoaXMuX3dhcnBzY3JpcHQgfHwgdGhpcy5pbm5lckNvZGU7XG4gICAgICBlZGl0b3Iuc2V0VGhlbWUodGhpcy5tb25hY29UaGVtZSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCAnZWRPcHRzOiAnLCBlZE9wdHMpO1xuICAgICAgdGhpcy5lZCA9IGNyZWF0ZSh0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LCBlZE9wdHMpO1xuICAgICAgdGhpcy5lZC5zZXRWYWx1ZSh0aGlzLmxhc3RLbm93bldTKTtcbiAgICAgIGVkaXRvci5zZXRNb2RlbExhbmd1YWdlKHRoaXMuZWQuZ2V0TW9kZWwoKSwgdGhpcy5sYW5nKTtcblxuICAgICAgaWYgKHRoaXMuaW5uZXJDb25maWcuZWRpdG9yLmVuYWJsZURlYnVnKSB7XG4gICAgICAgIHRoaXMuZWQub25Nb3VzZURvd24oZSA9PiB7XG4gICAgICAgICAgaWYgKGUuZXZlbnQubGVmdEJ1dHRvbikge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnR5cGUgPT09IDIgfHwgZS50YXJnZXQudHlwZSA9PT0gMyB8fCBlLnRhcmdldC50eXBlID09PSA0KSB7XG4gICAgICAgICAgICAgIHRoaXMudG9nZ2xlQnJlYWtQb2ludChlLnRhcmdldC5wb3NpdGlvbi5saW5lTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5lZC5nZXRNb2RlbCgpLnVwZGF0ZU9wdGlvbnMoe3RhYlNpemU6IHRoaXMuaW5uZXJDb25maWcuZWRpdG9yLnRhYlNpemV9KTtcbiAgICAgIGlmICh0aGlzLmVkKSB7XG4gICAgICAgIHRoaXMud2FycFZpZXdFZGl0b3JMb2FkZWQuZW1pdCgnbG9hZGVkJyk7XG4gICAgICAgIC8vIGFuZ3VsYXIgZXZlbnRzIGRvZXMgbm90IGJ1YmJsZSB1cCBvdXRzaWRlIGFuZ3VsYXIgY29tcG9uZW50LlxuICAgICAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JMb2FkZWQnLCAnbG9hZGVkJyk7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdBZnRlclZpZXdJbml0J10sICdsb2FkZWQnKTtcbiAgICAgICAgdGhpcy5lZC5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlQ29udGVudCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5sYXN0S25vd25XUyAhPT0gdGhpcy5lZC5nZXRWYWx1ZSgpKSB7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCAnd3MgY2hhbmdlZCcsIGV2ZW50KTtcbiAgICAgICAgICAgIHRoaXMud2FycFZpZXdFZGl0b3JXYXJwc2NyaXB0Q2hhbmdlZC5lbWl0KHRoaXMuZWQuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JXYXJwc2NyaXB0Q2hhbmdlZCcsIHRoaXMuZWQuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gbWFuYWdlIHRoZSBjdHJsIGNsaWNrLCBjcmVhdGUgYW4gZXZlbnQgd2l0aCB0aGUgc3RhdGVtZW50LCB0aGUgZW5kcG9pbnQsIHRoZSB3YXJwZmxlZXQgcmVwb3MuXG4gICAgICAgIHRoaXMuZWQub25Nb3VzZURvd24oZSA9PiB7XG4gICAgICAgICAgaWYgKCghdGhpcy5pc01hYygpICYmICEhZS5ldmVudC5jdHJsS2V5KSB8fCAodGhpcy5pc01hYygpICYmICEhZS5ldmVudC5tZXRhS2V5KSkge1xuICAgICAgICAgICAgLy8gY3RybCBjbGljayBvbiB3aGljaCB3b3JkID9cbiAgICAgICAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9ICh0aGlzLmVkLmdldE1vZGVsKCkuZ2V0V29yZEF0UG9zaXRpb24oZS50YXJnZXQucmFuZ2UuZ2V0U3RhcnRQb3NpdGlvbigpKSB8fCB7d29yZDogdW5kZWZpbmVkfSkud29yZDtcbiAgICAgICAgICAgIC8vIHBhcnNlIHRoZSB3YXJwc2NyaXB0XG4gICAgICAgICAgICBjb25zdCB3czogc3RyaW5nID0gdGhpcy5lZC5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgY29uc3Qgc3BlY2lhbEhlYWRlcnM6IFNwZWNpYWxDb21tZW50Q29tbWFuZHMgPSBXYXJwU2NyaXB0UGFyc2VyLmV4dHJhY3RTcGVjaWFsQ29tbWVudHMod3MpO1xuICAgICAgICAgICAgY29uc3QgcmVwb3M6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnRzOiBzdHJpbmdbXSA9IFdhcnBTY3JpcHRQYXJzZXIucGFyc2VXYXJwU2NyaXB0U3RhdGVtZW50cyh3cyk7XG4gICAgICAgICAgICBzdGF0ZW1lbnRzLmZvckVhY2goKHN0LCBpKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzdCA9PT0gJ1dGLkFERFJFUE8nICYmIGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNTdGF0ZW1lbnQgPSBzdGF0ZW1lbnRzW2kgLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAocHJldmlvdXNTdGF0ZW1lbnQuc3RhcnRzV2l0aCgnXCInKSAmJiBwcmV2aW91c1N0YXRlbWVudC5lbmRzV2l0aCgnXCInKSlcbiAgICAgICAgICAgICAgICAgIHx8IChwcmV2aW91c1N0YXRlbWVudC5zdGFydHNXaXRoKCdcXCcnKSAmJiBwcmV2aW91c1N0YXRlbWVudC5lbmRzV2l0aCgnXFwnJykpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGEgdmFsaWQgc3RyaW5nLlxuICAgICAgICAgICAgICAgICAgcmVwb3MucHVzaChwcmV2aW91c1N0YXRlbWVudC5zdWJzdHJpbmcoMSwgcHJldmlvdXNTdGF0ZW1lbnQubGVuZ3RoIC0gMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkb2NQYXJhbXM6IERvY0dlbmVyYXRpb25QYXJhbXMgPSB7XG4gICAgICAgICAgICAgIGVuZHBvaW50OiBzcGVjaWFsSGVhZGVycy5lbmRwb2ludCB8fCB0aGlzLnVybCxcbiAgICAgICAgICAgICAgbWFjcm9OYW1lOiBuYW1lLFxuICAgICAgICAgICAgICB3ZlJlcG9zOiByZXBvc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMud2FycFZpZXdFZGl0b3JDdHJsQ2xpY2suZW1pdChkb2NQYXJhbXMpO1xuICAgICAgICAgICAgQnViYmxpbmdFdmVudHMuZW1pdEJ1YmJsaW5nRXZlbnQodGhpcy5lbCwgJ3dhcnBWaWV3RWRpdG9yQ3RybENsaWNrJywgZG9jUGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuTE9HLmVycm9yKFsnbmdBZnRlclZpZXdJbml0J10sICdjb21wb25lbnREaWRMb2FkJywgZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyduZ09uRGVzdHJveSddLCAnQ29tcG9uZW50IHJlbW92ZWQgZnJvbSB0aGUgRE9NJyk7XG4gICAgaWYgKHRoaXMucmVzaXplV2F0Y2hlckludCkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJlc2l6ZVdhdGNoZXJJbnQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5lZCkge1xuICAgICAgdGhpcy5lZC5kaXNwb3NlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvKSB7XG4gICAgICB0aGlzLnJvLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVxdWVzdCkge1xuICAgICAgdGhpcy5yZXF1ZXN0LnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgcHVibGljIGFib3J0KHNlc3Npb24/OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5yZXF1ZXN0KSB7XG4gICAgICAvLyBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JFcnJvckV2ZW50JywgdGhpcy5lcnJvcik7XG4gICAgICBpZiAoISFzZXNzaW9uKSB7XG4gICAgICAgIGNvbnN0IHNwZWNpYWxIZWFkZXJzOiBTcGVjaWFsQ29tbWVudENvbW1hbmRzID0gV2FycFNjcmlwdFBhcnNlci5leHRyYWN0U3BlY2lhbENvbW1lbnRzKHRoaXMuZWQuZ2V0VmFsdWUoKSk7XG4gICAgICAgIGNvbnN0IGV4ZWN1dGlvblVybCA9IHNwZWNpYWxIZWFkZXJzLmVuZHBvaW50IHx8IHRoaXMudXJsO1xuICAgICAgICB0aGlzLmh0dHAucG9zdDxIdHRwUmVzcG9uc2U8c3RyaW5nPj4oZXhlY3V0aW9uVXJsLCBgPCUgJyR7c2Vzc2lvbn0nICdXU0tJTExTRVNTSU9OJyBFVkFMICU+IDwlIC0xICU+IDwlICU+IFRSWWAsIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCcsXG4gICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSlcbiAgICAgICAgICAucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3I8SHR0cFJlc3BvbnNlPHN0cmluZz4+KHVuZGVmaW5lZCkpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKHJlczogSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcbiAgICAgICAgICAgIGlmICghIXJlcykge1xuICAgICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Fib3J0J10sICdyZXNwb25zZScsIHJlcy5ib2R5KTtcbiAgICAgICAgICAgICAgY29uc3QgciA9IEpTT04ucGFyc2UocmVzLmJvZHkpO1xuICAgICAgICAgICAgICBpZiAoISFyWzBdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJbMF0gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEVycm9yKCdJdCBhcHBlYXJzIHRoYXQgeW91ciBXYXJwIDEwIGlzIHJ1bm5pbmcgb24gbXVsdGlwbGUgYmFja2VuZCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoclswXSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2VuZEVycm9yKGBVbmFibGUgdG8gV1NBQk9SVCBvbiAke2V4ZWN1dGlvblVybH0uIERpZCB5b3UgYWN0aXZhdGUgU3RhY2tQU1dhcnBTY3JpcHRFeHRlbnNpb24/YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFN0YXR1cyh7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgJHtXYXJwVmlld0VkaXRvckNvbXBvbmVudC5nZXRMYWJlbCh0aGlzLmxhbmcpfSBhYm9ydGVkLmAsXG4gICAgICAgICAgICAgICAgICBvcHM6IHBhcnNlSW50KHJlcy5oZWFkZXJzLmdldCgneC13YXJwMTAtb3BzJyksIDEwKSxcbiAgICAgICAgICAgICAgICAgIGVsYXBzZWQ6IHBhcnNlSW50KHJlcy5oZWFkZXJzLmdldCgneC13YXJwMTAtZWxhcHNlZCcpLCAxMCksXG4gICAgICAgICAgICAgICAgICBmZXRjaGVkOiBwYXJzZUludChyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKSwgMTApLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEVycm9yKGBBbiBlcnJvciBvY2N1cnMgZm9yIHNlc3Npb246ICR7c2Vzc2lvbn1gKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5yZXF1ZXN0O1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmRTdGF0dXMoe1xuICAgICAgICAgIG1lc3NhZ2U6IGAke1dhcnBWaWV3RWRpdG9yQ29tcG9uZW50LmdldExhYmVsKHRoaXMubGFuZyl9IGFib3J0ZWQuYCxcbiAgICAgICAgICBvcHM6IDAsXG4gICAgICAgICAgZWxhcHNlZDogMCxcbiAgICAgICAgICBmZXRjaGVkOiAwLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJlcXVlc3Q7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBoaWdobGlnaHQobGluZTogbnVtYmVyKSB7XG4gICAgY29uc3QgY3VycmVudEtleSA9ICdobC0nICsgbGluZTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmJyZWFrcG9pbnRzKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgaWYgKGsuc3RhcnRzV2l0aCgnaGwnKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5icmVha3BvaW50c1trXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmJyZWFrcG9pbnRzW2N1cnJlbnRLZXldID0ge1xuICAgICAgcmFuZ2U6IG5ldyBSYW5nZShsaW5lLCAxLCBsaW5lLCAxKSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgaXNXaG9sZUxpbmU6IHRydWUsXG4gICAgICAgIGNsYXNzTmFtZTogJ3dhcnB2aWV3Q29udGVudENsYXNzJ1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5kZWNvcmF0aW9uID0gdGhpcy5lZC5kZWx0YURlY29yYXRpb25zKHRoaXMuZGVjb3JhdGlvbiwgVXRpbHMudG9BcnJheSh0aGlzLmJyZWFrcG9pbnRzKSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUJyZWFrUG9pbnQobGluZTogbnVtYmVyKSB7XG4gICAgY29uc3QgY3VycmVudEtleSA9ICdicC0nICsgbGluZTtcbiAgICBpZiAodGhpcy5icmVha3BvaW50c1tjdXJyZW50S2V5XSkge1xuICAgICAgZGVsZXRlIHRoaXMuYnJlYWtwb2ludHNbY3VycmVudEtleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnJlYWtwb2ludHNbY3VycmVudEtleV0gPSB7XG4gICAgICAgIHJhbmdlOiBuZXcgUmFuZ2UobGluZSwgMSwgbGluZSwgMSksXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBpc1dob2xlTGluZTogdHJ1ZSxcbiAgICAgICAgICBnbHlwaE1hcmdpbkNsYXNzTmFtZTogJ3dhcnB2aWV3R2x5cGhNYXJnaW5DbGFzcydcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy53YXJwVmlld0VkaXRvckJyZWFrUG9pbnQuZW1pdCh0aGlzLmJyZWFrcG9pbnRzKTtcbiAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JCcmVha1BvaW50JywgdGhpcy5icmVha3BvaW50cyk7XG4gICAgdGhpcy5kZWNvcmF0aW9uID0gdGhpcy5lZC5kZWx0YURlY29yYXRpb25zKHRoaXMuZGVjb3JhdGlvbiwgVXRpbHMudG9BcnJheSh0aGlzLmJyZWFrcG9pbnRzKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVycm9yPFQ+KHJlc3VsdD86IFQpIHtcbiAgICByZXR1cm4gKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSk6IE9ic2VydmFibGU8VD4gPT4ge1xuICAgICAgdGhpcy5MT0cuZXJyb3IoWydoYW5kbGVFcnJvciddLCB7ZTogZXJyb3J9KTtcbiAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgdGhpcy5lcnJvciA9IGBVbmFibGUgdG8gcmVhY2ggJHtlcnJvci51cmx9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGVycm9yLmhlYWRlcnMuZ2V0KCdYLVdhcnAxMC1FcnJvci1NZXNzYWdlJykgJiYgZXJyb3IuaGVhZGVycy5nZXQoJ1gtV2FycDEwLUVycm9yLUxpbmUnKSkge1xuICAgICAgICAgIHRoaXMuZXJyb3IgPSAgJ2xpbmUgIycgKyBlcnJvci5oZWFkZXJzLmdldCgnWC1XYXJwMTAtRXJyb3ItTGluZScpICsgJzogJyArIGVycm9yLmhlYWRlcnMuZ2V0KCdYLVdhcnAxMC1FcnJvci1NZXNzYWdlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yLnN0YXR1c1RleHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMud2FycFZpZXdFZGl0b3JFcnJvckV2ZW50LmVtaXQodGhpcy5lcnJvcik7XG4gICAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JFcnJvckV2ZW50JywgdGhpcy5lcnJvcik7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiBvZihyZXN1bHQgYXMgVCk7XG4gICAgfTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBleGVjdXRlKHNlc3Npb24/KSB7XG4gICAgaWYgKHRoaXMuZWQpIHtcbiAgICAgIHRoaXMucmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zdGF0dXMgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydleGVjdXRlJ10sICd0aGlzLmVkLmdldFZhbHVlKCknLCBzZXNzaW9uLCB0aGlzLmVkLmdldFZhbHVlKCkpO1xuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIC8vIHBhcnNlIGNvbW1lbnRzIHRvIGxvb2sgZm9yIGlubGluZSB1cmwgb3IgcHJldmlldyBtb2RpZmllcnNcbiAgICAgIGNvbnN0IHNwZWNpYWxIZWFkZXJzOiBTcGVjaWFsQ29tbWVudENvbW1hbmRzID0gV2FycFNjcmlwdFBhcnNlci5leHRyYWN0U3BlY2lhbENvbW1lbnRzKHRoaXMuZWQuZ2V0VmFsdWUoKSk7XG4gICAgICBjb25zdCBwcmV2aWV3VHlwZSA9IHNwZWNpYWxIZWFkZXJzLmRpc3BsYXlQcmV2aWV3T3B0IHx8ICdub25lJztcbiAgICAgIGlmIChwcmV2aWV3VHlwZSA9PT0gJ0knKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSZXN1bHRUYWIgPSAyOyAvLyBzZWxlY3QgaW1hZ2UgdGFiLlxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkUmVzdWx0VGFiID09PSAyKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSZXN1bHRUYWIgPSAwOyAvLyBvbiBuZXh0IGV4ZWN1dGlvbiwgc2VsZWN0IHJlc3VsdHMgdGFiLlxuICAgICAgfVxuICAgICAgY29uc3QgZXhlY3V0aW9uVXJsID0gc3BlY2lhbEhlYWRlcnMuZW5kcG9pbnQgfHwgdGhpcy51cmw7XG4gICAgICAvLyBHZXQgV2FycDEwIHZlcnNpb25cbiAgICAgIC8vIEB0cy1pZ25vcmVcblxuICAgICAgbGV0IGhlYWRlcnMgPSB7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnfTtcbiAgICAgIGlmICghIXNlc3Npb24pIHtcbiAgICAgICAgaGVhZGVyc1snWC1XYXJwMTAtV2FycFNjcmlwdFNlc3Npb24nXSA9IHNlc3Npb247XG4gICAgICB9XG4gICAgICBsZXQgY29kZSA9IHRoaXMuZWQuZ2V0VmFsdWUoKS5yZXBsYWNlKC/CoC9naSwgJyAnKTtcbiAgICAgIGlmIChFZGl0b3JVdGlscy5GTE9XU19MQU5HVUFHRSA9PT0gdGhpcy5sYW5nKSB7XG4gICAgICAgIGNvZGUgPSBgPCdcbiR7Y29kZX1cbic+XG5GTE9XU1xuYDtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVxdWVzdCA9IHRoaXMuaHR0cC5wb3N0PEh0dHBSZXNwb25zZTxzdHJpbmc+PihleGVjdXRpb25VcmwsIGNvZGUsIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBvYnNlcnZlOiAncmVzcG9uc2UnLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnLFxuICAgICAgICBoZWFkZXJzXG4gICAgICB9KVxuICAgICAgICAucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3I8SHR0cFJlc3BvbnNlPHN0cmluZz4+KHVuZGVmaW5lZCkpKVxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IEh0dHBSZXNwb25zZTxzdHJpbmc+KSA9PiB7XG4gICAgICAgICAgaWYgKCEhcmVzKSB7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWN1dGUnXSwgJ3Jlc3BvbnNlJywgcmVzLmJvZHkpO1xuICAgICAgICAgICAgdGhpcy53YXJwVmlld0VkaXRvcldhcnBzY3JpcHRSZXN1bHQuZW1pdChyZXMuYm9keSk7XG4gICAgICAgICAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JXYXJwc2NyaXB0UmVzdWx0JywgcmVzLmJvZHkpO1xuICAgICAgICAgICAgdGhpcy5zZW5kU3RhdHVzKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFlvdXIgc2NyaXB0IGV4ZWN1dGlvbiB0b29rXG4gJHtFZGl0b3JVdGlscy5mb3JtYXRFbGFwc2VkVGltZShwYXJzZUludChyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLWVsYXBzZWQnKSwgMTApKX1cbiBzZXJ2ZXJzaWRlLCBmZXRjaGVkXG4gJHtyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKX0gZGF0YXBvaW50cyBhbmQgcGVyZm9ybWVkXG4gJHtyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLW9wcycpfSAgJHtXYXJwVmlld0VkaXRvckNvbXBvbmVudC5nZXRMYWJlbCh0aGlzLmxhbmcpfSBvcGVyYXRpb25zLmAsXG4gICAgICAgICAgICAgIG9wczogcGFyc2VJbnQocmVzLmhlYWRlcnMuZ2V0KCd4LXdhcnAxMC1vcHMnKSwgMTApLFxuICAgICAgICAgICAgICBlbGFwc2VkOiBwYXJzZUludChyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLWVsYXBzZWQnKSwgMTApLFxuICAgICAgICAgICAgICBmZXRjaGVkOiBwYXJzZUludChyZXMuaGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKSwgMTApLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IHJlcy5ib2R5O1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICBpZiAoZS5uYW1lICYmIGUubWVzc2FnZSAmJiBlLmF0ICYmIGUudGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBgJHtlLm5hbWV9OiAke2UubWVzc2FnZX0gYXQgY2hhciAke2UuYXR9ID0+ICR7ZS50ZXh0fWA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnJlc3VsdCA9IHJlcy5ib2R5O1xuICAgICAgICAgICAgICB0aGlzLkxPRy5lcnJvcihbJ2V4ZWN1dGUgMSddLCB0aGlzLmVycm9yKTtcbiAgICAgICAgICAgICAgdGhpcy5zZW5kRXJyb3IodGhpcy5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbJ2V4ZWN1dGUnXSwgJ25vIGFjdGl2ZSBlZGl0b3InKTtcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RGF0YXZpeigpIHtcbiAgICB0aGlzLndhcnBWaWV3RWRpdG9yRGF0YXZpelJlcXVlc3RlZC5lbWl0KHRoaXMucmVzdWx0KTtcbiAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JEYXRhdml6UmVxdWVzdGVkJywgdGhpcy5yZXN1bHQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6cmVzaXplJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcigncmVzaXplZCcsIFsnJGV2ZW50J10pXG4gIG9uUmVzaXplZCgkZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uUmVzaXplZCddLCAkZXZlbnQuZGV0YWlsLmVkaXRvcik7XG4gICAgdGhpcy53YXJwVmlld0VkaXRvclNpemUuZW1pdCgkZXZlbnQuZGV0YWlsLmVkaXRvcik7XG4gIH1cblxuICBpc01hYygpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnBsYXRmb3JtLnRvVXBwZXJDYXNlKCkuaW5kZXhPZignTUFDJykgPj0gMDtcbiAgfVxuXG4gIG9uS2V5RG93bigkZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uS2V5RG93biddLCAkZXZlbnQpO1xuICAgIGlmICgoIXRoaXMuaXNNYWMoKSAmJiAhISRldmVudC5jdHJsS2V5KSB8fCAodGhpcy5pc01hYygpICYmICEhJGV2ZW50Lm1ldGFLZXkpKSB7XG4gICAgICBBcnJheS5mcm9tKHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbXRrOCcpKVxuICAgICAgICAuY29uY2F0KEFycmF5LmZyb20odGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtdGsyMicpKSlcbiAgICAgICAgLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbXRrMjMnKSkpXG4gICAgICAgIC5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgIGlmICghZS50ZXh0Q29udGVudC5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgICAgIChlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuYWRkKCdtb3VzZU92ZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5VXAoJGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbktleVVwJ10sICRldmVudCk7XG4gICAgQXJyYXkuZnJvbSh0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ210azgnKSlcbiAgICAgIC5jb25jYXQoQXJyYXkuZnJvbSh0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ210azIyJykpKVxuICAgICAgLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbXRrMjMnKSkpXG4gICAgICAuZm9yRWFjaChlID0+IChlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QucmVtb3ZlKCdtb3VzZU92ZXInKSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVzaXplKGluaXRpYWw6IGJvb2xlYW4pIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoaW5pdGlhbCAmJiAoISF0aGlzLl9oZWlnaHRQeCkpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgY2FsYygxMDAlIC0gJHt0aGlzLmJ1dHRvbnMgP1xuICAgICAgICAgIHRoaXMuYnV0dG9ucy5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodFxuICAgICAgICAgIDogMTAwfXB4IClgO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwpIHtcbiAgICAgICAgdGhpcy53YXJwVmlld0VkaXRvckxvYWRlZC5lbWl0KCk7XG4gICAgICAgIEJ1YmJsaW5nRXZlbnRzLmVtaXRCdWJibGluZ0V2ZW50KHRoaXMuZWwsICd3YXJwVmlld0VkaXRvckxvYWRlZCcsICdsb2FkZWQnKTtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydyZXNpemUnXSwgJ2xvYWRlZCcpO1xuICAgICAgfVxuICAgIH0sIGluaXRpYWwgPyA1MDAgOiAxMDApO1xuICB9XG5cbiAgZ2V0SXRlbXMoKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IFtdO1xuICAgIGlmICh0aGlzLl9zaG93UmVzdWx0KSB7XG4gICAgICBoZWFkZXJzLnB1c2goe25hbWU6ICdlZGl0b3InLCBzaXplOiB0aGlzLl9pbml0aWFsU2l6ZSA/IHRoaXMuX2luaXRpYWxTaXplLnAgfHwgNTAgOiA1MH0pO1xuICAgICAgaGVhZGVycy5wdXNoKHtuYW1lOiAncmVzdWx0Jywgc2l6ZTogdGhpcy5faW5pdGlhbFNpemUgPyAxMDAgLSB0aGlzLl9pbml0aWFsU2l6ZS5wIHx8IDUwIDogNTB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVycy5wdXNoKHtuYW1lOiAnZWRpdG9yJywgc2l6ZTogMTAwfSk7XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgcmVzcG9uc2l2ZVN0eWxlKCkge1xuICAgIHJldHVybiB7aGVpZ2h0OiAnMTAwJScsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJ307XG4gIH1cblxuICBwcml2YXRlIHNlbmRFcnJvcihlcnJvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgIEJ1YmJsaW5nRXZlbnRzLmVtaXRCdWJibGluZ0V2ZW50KHRoaXMuZWwsICd3YXJwVmlld0VkaXRvckVycm9yRXZlbnQnLCB0aGlzLmVycm9yKTtcbiAgICB0aGlzLndhcnBWaWV3RWRpdG9yRXJyb3JFdmVudC5lbWl0KHRoaXMuZXJyb3IpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZW5kU3RhdHVzKHN0YXR1czogeyBlbGFwc2VkOiBudW1iZXI7IG9wczogbnVtYmVyOyBtZXNzYWdlOiBzdHJpbmc7IGZldGNoZWQ6IG51bWJlciB9KSB7XG4gICAgdGhpcy5zdGF0dXMgPSB7Li4uc3RhdHVzfTtcbiAgICBCdWJibGluZ0V2ZW50cy5lbWl0QnViYmxpbmdFdmVudCh0aGlzLmVsLCAnd2FycFZpZXdFZGl0b3JTdGF0dXNFdmVudCcsIHRoaXMuc3RhdHVzKTtcbiAgICB0aGlzLndhcnBWaWV3RWRpdG9yU3RhdHVzRXZlbnQuZW1pdCh0aGlzLnN0YXR1cyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXRMYWJlbChsYW5nOiAnd2FycHNjcmlwdCcgfCAnZmxvd3MnKSB7XG4gICAgc3dpdGNoIChsYW5nKSB7XG4gICAgICBjYXNlICdmbG93cyc6IHJldHVybiAnRkxvV1MnO1xuICAgICAgY2FzZSAnd2FycHNjcmlwdCc6IHJldHVybiAnV2FycFNjcmlwdCc7XG4gICAgfVxuICB9XG59XG4iXX0=