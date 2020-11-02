import { EventEmitter } from '@angular/core';
export declare class WarpViewHeatmapSlidersComponent {
    radiusValue: number;
    minRadiusValue: number;
    maxRadiusValue: number;
    blurValue: number;
    minBlurValue: number;
    maxBlurValue: number;
    heatRadiusDidChange: EventEmitter<any>;
    heatBlurDidChange: EventEmitter<any>;
    heatOpacityDidChange: EventEmitter<any>;
    radiusChanged(value: any): void;
    blurChanged(value: any): void;
    opacityChanged(value: any): void;
}
