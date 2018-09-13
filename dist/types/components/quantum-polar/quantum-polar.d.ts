import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
export declare class QuantumPolar {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | any[];
    options: Param;
    theme: string;
    width: string;
    height: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private uuid;
    private onData;
    private onOptions;
    private onTheme;
    private parseData;
    private drawChart;
    componentDidLoad(): void;
    render(): JSX.Element;
}
