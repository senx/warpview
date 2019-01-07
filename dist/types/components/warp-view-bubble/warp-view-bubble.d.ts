import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class WarpViewBubble {
    unit: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | DataModel[] | GTS[] | string;
    options: Param;
    width: string;
    height: string;
    debug: boolean;
    el: HTMLElement;
    private _options;
    private LOG;
    private uuid;
    private _chart;
    private resizeTimer;
    private parentWidth;
    onResize(): void;
    private onData;
    private onOptions;
    private drawChart;
    private parseData;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
