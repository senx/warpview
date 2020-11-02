import { AfterViewInit, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
/**
 *
 */
export declare class WarpViewResizeComponent implements AfterViewInit {
    private el;
    private renderer;
    handleDiv: ElementRef;
    wrapper: ElementRef;
    minHeight: string;
    initialHeight: number;
    set debug(debug: boolean);
    get debug(): boolean;
    resize: EventEmitter<any>;
    private dragging;
    private moveListener;
    private clickUpListener;
    private LOG;
    private _debug;
    constructor(el: ElementRef, renderer: Renderer2);
    ngAfterViewInit(): void;
    private handleDraggingEnd;
    private handleDraggingMove;
}
