import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumChartZoom {
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    hiddenData: string;
    options: string;
    width: string;
    height: string;
    timeMin: number;
    timeMax: number;
    el: HTMLElement;
    wc: HTMLStencilElement;
    boundsDidChange: EventEmitter;
    private _chart;
    private _xView;
    private _yView;
    private _slider;
    chartInfosWatcher(event: CustomEvent): void;
    xSliderInit(): void;
    ySliderInit(): void;
    componentDidLoad(): void;
    xZoomListener(event: CustomEvent): void;
    yZoomListener(event: CustomEvent): void;
    render(): JSX.Element;
}
