import '../../stencil.core';
export declare class WarpViewModal {
    modalTitle: string;
    el: HTMLElement;
    open(): void;
    close(): void;
    handleKeyDown(ev: KeyboardEvent): boolean;
    handleKeyUp(ev: KeyboardEvent): boolean;
    componentDidLoad(): void;
    render(): JSX.Element;
}
