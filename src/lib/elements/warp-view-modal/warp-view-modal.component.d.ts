import { AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
export declare class WarpViewModalComponent implements AfterViewInit {
    el: ElementRef;
    modalTitle: string;
    kbdLastKeyPressed: string[];
    warpViewModalOpen: EventEmitter<any>;
    warpViewModalClose: EventEmitter<any>;
    private opened;
    open(): void;
    close(): void;
    isOpened(): Promise<boolean>;
    handleKeyDown($event: string[]): void;
    constructor(el: ElementRef);
    ngAfterViewInit(): void;
}
