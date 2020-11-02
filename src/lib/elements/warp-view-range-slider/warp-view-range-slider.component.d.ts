import { AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { WarpViewSliderComponent } from '../warp-view-slider/warp-view-slider.component';
/**
 *
 */
export declare class WarpViewRangeSliderComponent extends WarpViewSliderComponent implements OnInit, AfterViewInit {
    slider: ElementRef<HTMLDivElement>;
    minValue: number;
    maxValue: number;
    constructor();
    ngOnInit(): void;
    ngAfterViewInit(): void;
    onChange(val: any): void;
    protected setOptions(): void;
}
