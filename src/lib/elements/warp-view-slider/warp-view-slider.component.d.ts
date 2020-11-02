import { AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Logger } from '../../utils/logger';
/**
 *
 */
export declare class WarpViewSliderComponent implements AfterViewInit {
    slider: ElementRef<HTMLDivElement>;
    set min(m: number);
    get min(): number;
    set max(m: number);
    get max(): number;
    value: number;
    set step(step: number);
    get step(): number;
    mode: string;
    set debug(debug: boolean);
    get debug(): boolean;
    change: EventEmitter<any>;
    _min: number;
    _max: number;
    show: boolean;
    protected _uiSlider: any;
    protected _step: number;
    protected LOG: Logger;
    loaded: boolean;
    protected manualRefresh: EventEmitter<void>;
    protected _debug: boolean;
    constructor();
    ngAfterViewInit(): void;
    protected setOptions(): void;
    protected updateSliderOptions(): void;
    format(value: number): string;
    protected getFormat(): {
        to: (value: any) => string;
        from: (value: any) => any;
    };
}
