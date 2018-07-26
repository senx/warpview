import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumAnnotation {
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    hiddenData: number;
    options: string;
    timeMin: number;
    timeMax: number;
    width: string;
    height: string;
    pointHover: EventEmitter;
    didHideOrShowAnomaly: EventEmitter;
    el: HTMLElement;
    private legendOffset;
    private _chart;
    redraw(newValue: string, oldValue: string): void;
    changeScale(newValue: string, oldValue: string): void;
    hideData(newValue: number): void;
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
