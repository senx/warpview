import '../../stencil.core';
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
export declare class WarpViewTile {
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
    private timer;
    private _autoRefresh;
    private onOptions;
    resize(): void;
    handleKeyDown(ev: KeyboardEvent): void;
    componentDidLoad(): void;
    private parseGTS;
    private execute;
    render(): JSX.Element;
}
