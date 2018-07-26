import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumEditor {
    el: HTMLStencilElement;
    url: string;
    theme: string;
    warpscript: string;
    showDataviz: boolean;
    horizontalLayout: boolean;
    config: string;
    displayMessages: boolean;
    statusEvent: EventEmitter;
    errorEvent: EventEmitter;
    warpscriptChanged: EventEmitter;
    warpscriptResult: EventEmitter;
    datavizRequested: EventEmitter;
    result: string;
    status: string;
    error: string;
    private WARPSCRIPT_LANGUAGE;
    private ed;
    private edUid;
    private monacoTheme;
    private loading;
    private _config;
    /**
     *
     * @param {string} newValue
     * @param {string} _oldValue
     */
    themeHandler(newValue: string, _oldValue: string): void;
    warpscriptHandler(newValue: string, _oldValue: string): void;
    /**
     *
     */
    componentWillLoad(): void;
    /**
     *
     */
    componentDidUnload(): void;
    /**
     *
     */
    componentDidLoad(): void;
    /**
     *
     * @param {string[]} tags
     * @param {string} name
     * @returns {monaco.languages.CompletionItemKind}
     */
    private static getType;
    /**
     *
     * @param {UIEvent} _event
     * @param {string} theme
     */
    setTheme(_event: UIEvent, theme: string): void;
    /**
     *
     * @param {UIEvent} _event
     */
    execute(_event: UIEvent): void;
    /**
     *
     * @param {UIEvent} _event
     */
    requestDataviz(_event: UIEvent): void;
    /**
     *
     * @param {number} elapsed
     * @returns {string}
     */
    private static formatElapsedTime;
    render(): JSX.Element;
}
