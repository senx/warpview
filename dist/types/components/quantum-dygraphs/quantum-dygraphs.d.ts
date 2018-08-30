import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumDygraphs {
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
    private _chartColors;
    hideData(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    gtsToData(gts: any): void;
    isStepped(): string | false;
    drawChart(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
