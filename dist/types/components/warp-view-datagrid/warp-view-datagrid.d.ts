import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { Param } from "../../model/param";
export declare class WarpViewDatagrid {
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | any[] | string;
    options: Param;
    width: string;
    height: string;
    elemsCount: number;
    el: HTMLElement;
    page: number;
    private LOG;
    private _options;
    _data: {
        name: string;
        values: any[];
        headers: string[];
    }[];
    private onData;
    private onOptions;
    private drawChart;
    private getHeaderParam;
    private parseData;
    componentWillLoad(): void;
    render(): JSX.Element;
}
