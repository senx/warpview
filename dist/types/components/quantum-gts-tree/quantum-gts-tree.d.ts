import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumGtsTree {
    data: string;
    selectedGTS: EventEmitter;
    gtsList: any;
    dataChanged(newValue: string, _oldValue: string): void;
    /**
     *
     */
    componentWillLoad(): void;
    render(): JSX.Element;
}
export declare class Counter {
    static item: number;
}
