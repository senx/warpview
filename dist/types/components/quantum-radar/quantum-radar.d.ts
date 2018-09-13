import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
export declare class QuantumRadar {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | any[];
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private uuid;
    private onData;
    private onOptions;
    private parseData;
    private drawChart;
    componentDidLoad(): void;
    render(): JSX.Element;
}
