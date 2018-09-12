import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { Logger } from "../../utils/logger";
export declare class QuantumTile {
    LOG: Logger;
    data: string;
    options: string;
    unit: string;
    theme: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    url: string;
    wsElement: HTMLElement;
    private warpscript;
    private graphs;
    private loading;
    componentDidLoad(): void;
    private execute;
    render(): JSX.Element;
}
