import '../../stencil.core';
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
export declare class QuantumTile {
    LOG: Logger;
    data: any;
    options: Param;
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    url: string;
    wsElement: HTMLElement;
    private warpscript;
    private graphs;
    private loading;
    private gtsList;
    private _options;
    private onOptions;
    componentDidLoad(): void;
    private parseGTS;
    private execute;
    render(): JSX.Element;
}
