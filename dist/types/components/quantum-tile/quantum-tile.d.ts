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
    warpscript: string;
    graphs: {
        'scatter': string[];
        'chart': string[];
        'pie': string[];
        'polar': string[];
        'bar': string[];
    };
    componentDidLoad(): void;
    render(): JSX.Element;
}
