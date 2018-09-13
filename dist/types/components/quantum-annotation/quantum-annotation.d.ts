import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class QuantumAnnotation {
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: DataModel | GTS[];
    options: Param;
    hiddenData: string[];
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
    changeScale(newValue: Param, oldValue: Param): void;
    hideData(newValue: string[], oldValue: string[]): void;
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
