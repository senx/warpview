import '../../stencil.core';
import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
/**
 * Display component
 */
export declare class WarpViewImage {
    imageTitle: string;
    responsive: boolean;
    data: DataModel | any[] | string;
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private toDisplay;
    private resizeTimer;
    onResize(): void;
    private onData;
    private onOptions;
    private drawChart;
    private getStyle;
    componentDidLoad(): void;
    render(): JSX.Element;
}
