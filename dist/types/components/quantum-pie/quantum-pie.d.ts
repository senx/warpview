import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumPie {
    chartTitle: string;
    showLegend: boolean;
    data: string;
    options: string;
    theme: string;
    width: string;
    height: string;
    unit: string;
    responsive: boolean;
    el: HTMLElement;
    private LOG;
    private _options;
    private onData;
    private onOptions;
    private onTheme;
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
