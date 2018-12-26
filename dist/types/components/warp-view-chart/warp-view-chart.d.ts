import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  timeMode.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
export declare class WarpViewChart {
    data: DataModel | GTS[] | string;
    options: Param;
    hiddenData: number[];
    unit: string;
    type: string;
    responsive: boolean;
    standalone: boolean;
    el: HTMLElement;
    boundsDidChange: EventEmitter;
    pointHover: EventEmitter;
    warpViewChartResize: EventEmitter;
    private LOG;
    private static DEFAULT_WIDTH;
    private static DEFAULT_HEIGHT;
    private resizeTimer;
    private _chart;
    private _options;
    private uuid;
    private ticks;
    private visibility;
    private initialHeight;
    private parentWidth;
    onResize(): void;
    private onHideData;
    private onData;
    private onOptions;
    getTimeClip(): number[];
    private handleMouseOut;
    private gtsToData;
    private isStepped;
    private isStacked;
    private static toFixed;
    /**
     *
     * @param {string} data
     * @returns {string}
     */
    private static formatLabel;
    private legendFormatter;
    private highlightCallback;
    private scroll;
    private static offsetToPercentage;
    private static adjustAxis;
    private static zoom;
    private drawCallback;
    private drawChart;
    private displayGraph;
    componentDidLoad(): void;
    render(): JSX.Element;
}
