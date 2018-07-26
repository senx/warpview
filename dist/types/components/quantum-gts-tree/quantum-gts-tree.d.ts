import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumGtsTree {
    data: string;
    selected: EventEmitter;
    gtsList: any;
    dataChanged(newValue: string, _oldValue: string): void;
    /**
     *
     * @param {CustomEvent} event
     */
    onSelected(event: CustomEvent): void;
    /**
     *
     */
    componentWillLoad(): void;
    render(): JSX.Element;
}
export declare class Counter {
    static item: number;
}
