import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class QuantumScatter {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | GTS[];
    options: Param;
    width: string;
    height: string;
    theme: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private chart;
    private uuid;
    private onData;
    private onOptions;
    private onTheme;
    private drawChart;
    private gtsToScatter;
    componentDidLoad(): void;
    render(): JSX.Element;
}
