import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumHeatmapSliders {
    radiusValue: number;
    minRadiusValue: number;
    maxRadiusValue: number;
    blurValue: number;
    minBlurValue: number;
    maxBlurValue: number;
    el: HTMLElement;
    heatRadiusDidChange: EventEmitter;
    heatBlurDidChange: EventEmitter;
    heatOpacityDidChange: EventEmitter;
    radiusChanged(value: any): void;
    blurChanged(value: any): void;
    opacityChanged(value: any): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
