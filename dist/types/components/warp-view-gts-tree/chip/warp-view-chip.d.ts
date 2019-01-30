import '../../../stencil.core';
import { EventEmitter } from "../../../stencil.core";
export declare class WarpViewChip {
    name: string;
    node: any;
    gtsFilter: string;
    hiddenData: number[];
    debug: boolean;
    kbdLastKeyPressed: string[];
    refreshCounter: number;
    warpViewSelectedGTS: EventEmitter;
    private chip;
    private _node;
    private LOG;
    private onGtsFilter;
    private onHideData;
    handleKeyDown(key: string[]): void;
    private colorizeChip;
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
