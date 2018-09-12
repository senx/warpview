import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
export declare class QuantumScatter {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    options: string;
    width: string;
    height: string;
    theme: string;
    el: HTMLElement;
    private LOG;
    private _options;
    private chart;
    private uuid;
    private onData;
    private onOptions;
    private onTheme;
    private drawChart;
    private gtsToScatter;
    customTooltips(tooltip: any): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
