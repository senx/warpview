import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { Datum } from "./datum";
export declare class CalendarHeatmap {
    private static DEF_MIN_COLOR;
    private static DEF_MAX_COLOR;
    el: HTMLElement;
    data: Datum[];
    minColor: string;
    maxColor: string;
    overview: string;
    handler: EventEmitter;
    onChange: EventEmitter;
    private LOG;
    private gutter;
    private width;
    private height;
    private item_size;
    private label_padding;
    private transition_duration;
    private in_transition;
    private tooltip_width;
    private tooltip_padding;
    private history;
    private selected;
    private svg;
    private items;
    private labels;
    private buttons;
    private tooltip;
    private uuid;
    private parentWidth;
    private chart;
    private resizeTimer;
    private onData;
    private onMinColor;
    private onMaxColor;
    /**
     * Recalculate dimensions on window resize events
     */
    onResize(): void;
    /**
     * Utility function to get number of complete weeks in a year
     *
     * @returns {number}
     */
    static getNumberOfWeeks(): number;
    /**
     * Utility function to calculate chart dimensions
     */
    calculateDimensions(): void;
    private groupBy;
    /**
     * Helper function to check for data summary
     *
     * @returns {any}
     */
    updateDataSummary(): void;
    /**
     * Draw the chart based on the current overview type
     */
    drawChart(): void;
    /**
     * Draw global overview (multiple years)
     */
    drawGlobalOverview(): void;
    /**
     * Draw year overview
     */
    drawYearOverview(): void;
    /**
     * Draw month overview
     */
    drawMonthOverview(): void;
    /**
     * Draw week overview
     */
    drawWeekOverview(): void;
    /**
     * Draw day overview
     */
    drawDayOverview(): void;
    /**
     * Helper function to calculate item position on the x-axis
     * @param {Datum} d
     * @param {moment.Moment} start_of_year
     * @returns {number}
     */
    private calcItemX;
    /**
     *
     * @param {Datum} d
     * @param {moment.Moment} start
     * @param {number} offset
     * @returns {number}
     */
    private calcItemXMonth;
    /**
     * Helper function to calculate item position on the y-axis
     * @param {Datum} d
     * @returns {number}
     */
    private calcItemY;
    /**
     * Helper function to calculate item size
     * @param {Datum | Summary} d
     * @param {number} max
     * @returns {number}
     */
    private calcItemSize;
    /**
     * Draw the button for navigation purposes
     */
    private drawButton;
    /**
     * Transition and remove items and labels related to global overview
     */
    private removeGlobalOverview;
    /**
     * Transition and remove items and labels related to year overview
     */
    private removeYearOverview;
    /**
     * Transition and remove items and labels related to month overview
     */
    private removeMonthOverview;
    /**
     * Transition and remove items and labels related to week overview
     */
    private removeWeekOverview;
    /**
     * Transition and remove items and labels related to daily overview
     */
    private removeDayOverview;
    /**
     * Helper function to hide the tooltip
     */
    private hideTooltip;
    /**
     * Helper function to hide the back button
     */
    private hideBackButton;
    private getTooltip;
    componentDidLoad(): void;
    render(): JSX.Element;
}
