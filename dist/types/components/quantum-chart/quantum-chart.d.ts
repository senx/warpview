import '../../stencil.core';
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
export declare class QuantumChart {
    data: string;
    options: string;
    hiddenData: string;
    theme: string;
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    standalone: boolean;
    el: HTMLElement;
    receivedData: EventEmitter;
    boundsDidChange: EventEmitter;
    pointHover: EventEmitter;
    private LOG;
    private static DEFAULT_WIDTH;
    private static DEFAULT_HEIGHT;
    private _chart;
    private _options;
    private _data;
    private onHideData;
    private onData;
    private onTheme;
    private onOptions;
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
