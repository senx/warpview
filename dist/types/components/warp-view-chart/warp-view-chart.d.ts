import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
import { ChartBounds } from "../../model/chartBounds";
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
    debug: boolean;
    el: HTMLElement;
    boundsDidChange: EventEmitter;
    pointHover: EventEmitter;
    warpViewChartResize: EventEmitter;
    resizeMyParent: EventEmitter;
    private LOG;
    private static DEFAULT_WIDTH;
    private static DEFAULT_HEIGHT;
    private resizeTimer;
    private _chart;
    private _options;
    private uuid;
    private visibility;
    /**
     * usefull for default zoom
     */
    private maxTick;
    /**
     * usefull for default zoom
     */
    private minTick;
    /**
     * table of gts id displayed in dygraph. array order is the one of dygraph series
     */
    private visibleGtsId;
    /**
     * key = timestamp. values = table of available points, filled by null.
     */
    private dataHashset;
    /**
     * the big matrix that dygraph expects
     */
    private dygraphdataSets;
    /**
     * the labels of each series. array order is the one of dygraph series
     */
    private dygraphLabels;
    /**
     * the colors of each series. array order is the one of dygraph series
     */
    private dygraphColors;
    /**
     * put this to true before creating a new dygraph to force a resize in the drawCallback
     */
    private initialResizeNeeded;
    /**
     * contains the bounds of current graph, in timestamp (platform time unit), and in millisecond.
     */
    private chartBounds;
    private previousParentHeight;
    private previousParentWidth;
    private visibilityStatus;
    private heightWithPlottableData;
    onResize(): void;
    private onHideData;
    private onData;
    private onOptions;
    private onTypeChange;
    private onUnitChange;
    getTimeClip(): Promise<ChartBounds>;
    private handleMouseOut;
    /**
     * this function build this.dataHashset (high computing cost), then it build this.dygraphdataSets  (high computing cost too)
     *
     * this function also refresh this.dygraphColors  this.dygraphLabels
     *
     * @param gtsList a flat array of gts
     */
    private gtsToData;
    /**
     * This function build this.dygraphdataSets from this.dataHashset
     *
     * It could be called independently from gtsToData, when only unit or timeMode change.
     */
    private rebuildDygraphDataSets;
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
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
