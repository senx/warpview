import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class WarpViewChip {
    name: string;
    node: any;
    gtsFilter: string;
    _node: any;
    warpViewSelectedGTS: EventEmitter;
    el: HTMLElement;
    private LOG;
    private onGtsFilter;
    handleKeyDown(ev: KeyboardEvent): void;
    private colorizeChip;
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
    switchPlotState(event: UIEvent): boolean;
    private setState;
    render(): JSX.Element;
}
