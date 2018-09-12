import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumAnnotation {
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    hiddenData: string;
    options: string;
    timeMin: number;
    timeMax: number;
    theme: string;
    width: string;
    height: string;
    pointHover: EventEmitter;
    el: HTMLElement;
    private legendOffset;
    private _chart;
    private _mapIndex;
    private LOG;
    private _options;
    private uuid;
    private onData;
    private onTheme;
    changeScale(newValue: string, oldValue: string): void;
    hideData(newValue: string, oldValue: string): void;
    minBoundChange(newValue: number, oldValue: number): void;
    maxBoundChange(newValue: number, oldValue: number): void;
    /**
     *
     */
    private drawChart;
    /**
     *
     * @param gts
     * @returns {any[]}
     */
    private parseData;
    componentDidLoad(): void;
    render(): JSX.Element;
}
