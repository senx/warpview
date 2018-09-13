import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
export declare class QuantumTreeView {
    gtsList: any;
    branch: boolean;
    theme: string;
    selected: EventEmitter;
    private static LOG;
    /**
     *
     * @param node
     * @returns {number}
     */
    private static getIndex;
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
