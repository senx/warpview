import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class WarpViewScatter {
    unit: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | GTS[] | string;
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private _chart;
    private uuid;
    private resizeTimer;
    private parentWidth;
    onResize(): void;
    private onData;
    private onOptions;
    private drawChart;
    private gtsToScatter;
    componentDidLoad(): void;
    render(): JSX.Element;
}
