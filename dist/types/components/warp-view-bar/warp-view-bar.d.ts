import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class WarpViewBar {
    unit: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | GTS[];
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private uuid;
    private _chart;
    private _mapIndex;
    private resizeTimer;
    onResize(): void;
    private onData;
    private onOptions;
    private buildGraph;
    private drawChart;
    private gtsToData;
    componentDidLoad(): void;
    render(): JSX.Element;
}
