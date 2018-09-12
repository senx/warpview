import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumBubble {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    options: string;
    theme: string;
    width: string;
    height: string;
    el: HTMLElement;
    private _options;
    private LOG;
    private uuid;
    private onData;
    private onOptions;
    private onTheme;
    private drawChart;
    private parseData;
    componentDidLoad(): void;
    render(): JSX.Element;
}
