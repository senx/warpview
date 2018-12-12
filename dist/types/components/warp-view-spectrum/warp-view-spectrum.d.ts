import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
/**
 *
 */
export declare class WarpViewSpectrumParam {
    range: string;
    granularity: string;
    scale: number;
    interval: 6;
}
export declare class WarpViewSpectrum {
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | any[] | string;
    options: Param;
    width: string;
    height: string;
    el: HTMLElement;
    private uuid;
    private LOG;
    private _options;
    private resizeTimer;
    private parentWidth;
    private heatMapData;
    onResize(): void;
    private onData;
    private onOptions;
    private drawChart;
    static buildLabels(): any[];
    formatAxis(labels: string[]): any[];
    private parseData;
    componentDidLoad(): void;
    render(): JSX.Element;
}
