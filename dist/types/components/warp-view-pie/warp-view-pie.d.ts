import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
export declare class WarpViewPie {
    showLegend: boolean;
    data: DataModel | any[] | string;
    options: Param;
    width: string;
    height: string;
    responsive: boolean;
    debug: boolean;
    el: HTMLElement;
    private LOG;
    private _options;
    private uuid;
    private _chart;
    private resizeTimer;
    private parentWidth;
    private parentHeight;
    onResize(): void;
    private onData;
    private onOptions;
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    private parseData;
    private drawChart;
    private getRotation;
    private getCirc;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
