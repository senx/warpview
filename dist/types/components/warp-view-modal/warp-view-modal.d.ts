import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class WarpViewModal {
    modalTitle: string;
    el: HTMLElement;
    warpViewModalOpen: EventEmitter;
    warpViewModalClose: EventEmitter;
    open(): void;
    close(): void;
    handleKeyDown(ev: KeyboardEvent): boolean;
    handleKeyUp(ev: KeyboardEvent): boolean;
    componentDidLoad(): void;
    render(): JSX.Element;
}
