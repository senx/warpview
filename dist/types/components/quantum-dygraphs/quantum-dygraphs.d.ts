import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  time.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export declare class QuantumDygraphs {
    data: string;
    options: string;
    hiddenData: string;
    theme: string;
    unit: string;
    chartTitle: string;
    responsive: boolean;
    standalone: boolean;
    el: HTMLElement;
    receivedData: EventEmitter;
    boundsDidChange: EventEmitter;
    pointHover: EventEmitter;
    private static DEFAULT_WIDTH;
    private static DEFAULT_HEIGHT;
    private _chart;
    private _option;
    private _data;
    hideData(newValue: string, oldValue: string): void;
    onData(newValue: string, oldValue: string): void;
    onTheme(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    private gtsToData;
    private isStepped;
    private isStacked;
    private legendFormatter;
    private highlightCallback;
    private zoomCallback;
    private drawChart;
    componentDidLoad(): void;
    render(): JSX.Element;
}
