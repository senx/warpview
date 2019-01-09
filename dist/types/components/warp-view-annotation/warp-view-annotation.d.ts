import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
/**
 * @prop --warp-view-chart-width: Fixed width if not responsive
 * @prop --warp-view-chart-height: Fixed height if not responsive
 */
export declare class WarpViewAnnotation {
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | DataModel[] | GTS[] | string;
    options: Param;
    hiddenData: number[];
    timeMin: number;
    timeMax: number;
    width: string;
    height: string;
    standalone: boolean;
    debug: boolean;
    displayExpander: boolean;
    pointHover: EventEmitter;
    el: HTMLElement;
    private _chart;
    private _mapIndex;
    private LOG;
    private _options;
    private canvas;
    private tooltip;
    private date;
    private resizeTimer;
    private parentWidth;
    private _height;
    private expanded;
    onResize(): void;
    private onData;
    onOptions(newValue: Param, oldValue: Param): void;
    hideData(newValue: any, oldValue: any): void;
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
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
    private toggle;
}
