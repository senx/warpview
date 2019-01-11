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
    debug: boolean;
    el: HTMLElement;
    private LOG;
    private _options;
    private toDisplay;
    private resizeTimer;
    private parentWidth;
    onResize(): void;
    private onData;
    private onOptions;
    componentWillLoad(): void;
    private drawChart;
    private getStyle;
    componentDidLoad(): void;
    render(): JSX.Element;
}
