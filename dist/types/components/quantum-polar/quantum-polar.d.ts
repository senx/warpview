import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumPolar {
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    options: any;
    theme: string;
    width: string;
    height: string;
    el: HTMLElement;
    redraw(newValue: string, oldValue: string): void;
    static generateColors(num: any): any[];
    static generateTransparentColors(num: any): any[];
    parseData(gts: any): {
        labels: any[];
        data: any[];
    };
    drawChart(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
