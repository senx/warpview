import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
/**
 *
 */
export declare class WarpViewDrillDown {
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | any[] | string;
    options: Param;
    width: string;
    height: string;
    debug: boolean;
    el: HTMLElement;
    private LOG;
    private _options;
    private resizeTimer;
    private parentWidth;
    private heatMapData;
    onResize(): void;
    private onData;
    private onOptions;
    private drawChart;
    private parseData;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
