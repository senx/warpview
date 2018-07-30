import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumChart {
    alone: boolean;
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
    config: string;
    xView: string;
    yView: string;
    pointHover: EventEmitter;
    boundsDidChange: EventEmitter;
    chartInfos: EventEmitter;
    el: HTMLElement;
    private _chart;
    private _mapIndex;
    private _xSlider;
    private _ySlider;
    private _config;
    redraw(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    hideData(newValue: string, oldValue: string): void;
    changeXView(): void;
    changeYView(): void;
    drawChart(): void;
    xSliderInit(): void;
    ySliderInit(): void;
    gtsToData(gts: any): {
        datasets: any[];
        ticks: any[];
    };
    isStepped(): string | false;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
