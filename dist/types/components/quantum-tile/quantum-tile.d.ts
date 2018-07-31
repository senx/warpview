import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumTile {
    warpscript: string;
    data: string;
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    url: string;
    wsElement: HTMLElement;
    graphs: {
        'scatter': string[];
        'chart': string[];
        'pie': string[];
        'polar': string[];
    };
    componentDidLoad(): void;
    getParams(gtsList: any): any[];
    render(): JSX.Element;
}
