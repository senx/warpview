import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumChart {
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    hiddenData: number;
    options: string;
    width: string;
    height: string;
    timeMin: number;
    timeMax: number;
    pointHover: EventEmitter;
    didHideOrShowData: EventEmitter;
    el: HTMLElement;
    private _chart;
    redraw(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    hideData(newValue: number): void;
    drawChart(): void;
    gtsToData(gts: any): {
        datasets: any[];
        ticks: any[];
    };
    isStepped(): string | false;
    componentDidLoad(): void;
    render(): JSX.Element;
}
