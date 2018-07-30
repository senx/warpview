import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumChip {
    name: string;
    index: number;
    node: any;
    _node: any;
    quantumSelectedGTS: EventEmitter;
    el: HTMLElement;
    /**
     *
     * @param {boolean} state
     * @returns {string}
     */
    gtsColor(state: boolean): string;
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
    _lastIndex(index: any, obj: any): boolean;
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    _toArray(obj: any): {
        name: string;
        value: any;
    }[];
    /**
     *
     * @param {UIEvent} event
     */
    switchPlotState(event: UIEvent): void;
    render(): JSX.Element;
}
