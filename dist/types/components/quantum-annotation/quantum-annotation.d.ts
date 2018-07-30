import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumAnnotation {
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    hiddenData: string;
    options: string;
    timeMin: number;
    timeMax: number;
    width: string;
    height: string;
    pointHover: EventEmitter;
    el: HTMLElement;
    private legendOffset;
    private _chart;
    private _mapIndex;
    redraw(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    hideData(newValue: string, oldValue: string): void;
    minBoundChange(newValue: number, oldValue: number): void;
    maxBoundChange(newValue: number, oldValue: number): void;
    /**
     *
     */
    drawChart(): void;
    /**
     *
     * @param {number} w
     * @param {number} h
     * @param {string} color
     * @returns {HTMLImageElement}
     */
    buildImage(w: number, h: number, color: string): HTMLImageElement;
    /**
     *
     * @param gts
     * @returns {any[]}
     */
    gtsToScatter(gts: any): any[];
    componentDidLoad(): void;
    render(): JSX.Element;
}
