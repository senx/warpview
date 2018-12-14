import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { Moment } from 'moment';
export declare class CalendarHeatmap {
    el: HTMLElement;
    data: any[];
    color: string;
    overview: string;
    handler: EventEmitter;
    onChange: EventEmitter;
    private LOG;
    private gutter;
    private item_gutter;
    private width;
    private height;
    private item_size;
    private label_padding;
    private max_block_height;
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
    private onData;
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
    groupBy(xs: any, key: any): any;
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
     *
     * @param d
     * @param {moment.Moment} start_of_year
     * @returns {number}
     */
    calcItemX(d: any, start_of_year: Moment): number;
    calcItemXMonth(d: any, start: Moment, offset: number): number;
    calcDayX(d: any, start: Moment): number;
    /**
     * Helper function to calculate item position on the y-axis
     * @param d object
     */
    calcItemY(d: any): number;
    /**
     * Helper function to calculate item size
     * @param d object
     * @param max number
     */
    calcItemSize(d: any, max: number): number;
    /**
     * Draw the button for navigation purposes
     */
    drawButton(): void;
    /**
     * Transition and remove items and labels related to global overview
     */
    removeGlobalOverview(): void;
    /**
     * Transition and remove items and labels related to year overview
     */
    removeYearOverview(): void;
    /**
     * Transition and remove items and labels related to month overview
     */
    removeMonthOverview(): void;
    /**
     * Transition and remove items and labels related to week overview
     */
    removeWeekOverview(): void;
    /**
     * Transition and remove items and labels related to daily overview
     */
    removeDayOverview(): void;
    /**
     * Helper function to hide the tooltip
     */
    hideTooltip(): void;
    /**
     * Helper function to hide the back button
     */
    hideBackButton(): void;
    /**
     * Helper function to convert seconds to a human readable format
     * @param seconds Integer
     */
    static formatTime(seconds: number): string;
    componentDidLoad(): void;
    render(): JSX.Element;
    private getTooltip;
    private static formatLabel;
}
