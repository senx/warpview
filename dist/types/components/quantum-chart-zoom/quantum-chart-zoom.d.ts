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
    private _options;
    private _chart;
    private _xView;
    private _yView;
    private png;
    private _slider;
    changeScale(newValue: string, oldValue: string): void;
    chartInfosWatcher(event: CustomEvent): void;
    xSliderInit(): void;
    ySliderInit(): void;
    componentDidLoad(): void;
    download(): any;
    xZoomListener(event: CustomEvent): void;
    yZoomListener(event: CustomEvent): void;
    xSliderListener(event: CustomEvent): void;
    ySliderListener(event: CustomEvent): void;
    zoomReset(): void;
    render(): JSX.Element;
}