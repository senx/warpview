import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class WarpViewChip {
    name: string;
    index: number;
    node: any;
    _node: any;
    warpViewSelectedGTS: EventEmitter;
    el: HTMLElement;
    private LOG;
    handleKeyDown(ev: KeyboardEvent): void;
    /**
     *
     * @param state
     * @param index
     */
    private gtsColor;
    /**
     *
     */
    componentWillLoad(): void;
    /**
     *
     */
    componentDidLoad(): void;
    /**
     *
     * @param index
     * @param obj
     * @returns {boolean}
     * @private
     */
    private lastIndex;
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    private toArray;
    /**
     *
     * @param {UIEvent} event
     */
    switchPlotState(event: UIEvent): void;
    private setState;
    render(): JSX.Element;
}
