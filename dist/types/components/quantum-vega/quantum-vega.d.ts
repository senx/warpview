import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import "vega";
export declare class QuantumVega {
    data: string;
    type: string;
    options: string;
    hiddenData: string;
    el: HTMLElement;
    receivedData: EventEmitter;
    private _mapIndex;
    private _data;
    private _classList;
    private _type;
    private _chart;
    private _chartMap;
    private _colorScheme;
    hideData(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    gtsToData(gts: any): {
        datasets: any[];
        ticks: any[];
    };
    isStepped(): string | false;
    drawChart(data: any, timeMode: any): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
