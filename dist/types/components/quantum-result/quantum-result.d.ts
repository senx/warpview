import '../../stencil.core';
import "@code-dimension/stencil-components";
export declare class QuantumResult {
    el: HTMLStencilElement;
    result: string;
    theme: string;
    config: string;
    displayMessages: boolean;
    private _result;
    private _config;
    private resEd;
    private monacoTheme;
    private resUid;
    themeHandler(newValue: string, _oldValue: string): void;
    resultHandler(newValue: any, _oldValue: any): void;
    /**
     *
     */
    componentWillLoad(): void;
    buildEditor(json: string): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
