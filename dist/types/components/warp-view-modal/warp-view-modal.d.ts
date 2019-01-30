import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class WarpViewModal {
    modalTitle: string;
    kbdLastKeyPressed: string[];
    el: HTMLElement;
    warpViewModalOpen: EventEmitter;
    warpViewModalClose: EventEmitter;
    private opened;
    open(): void;
    close(): void;
    isOpened(): Promise<boolean>;
    handleKeyDown(key: string[]): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
