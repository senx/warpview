import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumTreeView {
    gtsList: any;
    branch: boolean;
    theme: string;
    selected: EventEmitter;
    /**
     *
     * @param node
     * @returns {number}
     */
    getIndex(node: any): number;
    /**
     *
     */
    componentWillLoad(): void;
    /**
     *
     * @returns {any}
     */
    render(): JSX.Element;
}
