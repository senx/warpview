import '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
export declare class QuantumPie {
    chartTitle: string;
    showLegend: boolean;
    data: DataModel | any[];
    options: Param;
    width: string;
    height: string;
    unit: string;
    responsive: boolean;
    el: HTMLElement;
    private LOG;
    private _options;
    private uuid;
    private _chart;
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
    componentDidLoad(): void;
    render(): JSX.Element;
}
