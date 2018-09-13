import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  time.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export declare class QuantumChart {
    data: DataModel | GTS[];
    options: Param;
    hiddenData: string[];
    unit: string;
    type: string;
    chartTitle: string;
    responsive: boolean;
    standalone: boolean;
    el: HTMLElement;
    boundsDidChange: EventEmitter;
    pointHover: EventEmitter;
    private LOG;
    private static DEFAULT_WIDTH;
    private static DEFAULT_HEIGHT;
    private _chart;
    private _options;
    private uuid;
    private onHideData;
    private onData;
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
