import '../../stencil.core';
export declare class QuantumPie {
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
    onTheme(newValue: string, oldValue: string): void;
    /**
     *
     * @param num
     * @returns {any[]}
     */
    static generateColors(num: any): any[];
    /**
     *
     * @param num
     */
    static generateTransparentColors(num: any): any[];
    /**
     *
     * @param data
     * @returns {{labels: any[]; data: any[]}}
     */
    parseData(data: any): {
        labels: any[];
        data: any[];
    };
    drawChart(): void;
    getRotation(): number;
    getCirc(): number;
    componentDidLoad(): void;
    render(): JSX.Element;
}
