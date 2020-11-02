import { AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Datum } from '../model/datum';
export declare class CalendarHeatmapComponent implements AfterViewInit {
    private el;
    set debug(debug: boolean);
    get debug(): boolean;
    set data(data: Datum[]);
    get data(): Datum[];
    set minColor(minColor: string);
    get minColor(): string;
    set maxColor(maxColor: string);
    get maxColor(): string;
    private static DEF_MIN_COLOR;
    private static DEF_MAX_COLOR;
    constructor(el: ElementRef);
    div: ElementRef;
    width: number;
    height: number;
    overview: string;
    handler: EventEmitter<any>;
    change: EventEmitter<any>;
    private LOG;
    private _data;
    private _debug;
    private _minColor;
    private _maxColor;
    private gutter;
    private gWidth;
    private gHeight;
    private itemSize;
    private labelPadding;
    private transitionDuration;
    private inTransition;
    private tooltipWidth;
    private tooltipPadding;
    private history;
    private selected;
    private svg;
    private items;
    private labels;
    private buttons;
    private tooltip;
    private parentWidth;
    private chart;
    private resizeTimer;
    static getNumberOfWeeks(): number;
    onResize(): void;
    ngAfterViewInit(): void;
    calculateDimensions(): void;
    private groupBy;
    updateDataSummary(): void;
    drawChart(): void;
    drawGlobalOverview(): void;
    /**
     * Draw year overview
     */
    drawYearOverview(): void;
    drawMonthOverview(): void;
    drawWeekOverview(): void;
    drawDayOverview(): void;
    private calcItemX;
    private calcItemXMonth;
    private calcItemY;
    private calcItemSize;
    private drawButton;
    private removeGlobalOverview;
    private removeYearOverview;
    private removeMonthOverview;
    private removeWeekOverview;
    private removeDayOverview;
    private hideTooltip;
    /**
     * Helper function to hide the back button
     */
    private hideBackButton;
    private getTooltip;
}
