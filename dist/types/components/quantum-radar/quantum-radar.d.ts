import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumRadar {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    options: object;
    width: string;
    height: string;
    el: HTMLElement;
    redraw(newValue: string, oldValue: string): void;
    generateColors(num: any): any[];
    parseData(gts: any): {
        labels: any[];
        datas: any[];
    };
    drawChart(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
