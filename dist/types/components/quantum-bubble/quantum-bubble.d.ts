import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class QuantumBubble {
    unit: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | GTS[];
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private _options;
    private LOG;
    private uuid;
    private _chart;
    private onData;
    private onOptions;
    private drawChart;
    private parseData;
    componentDidLoad(): void;
    render(): JSX.Element;
}
