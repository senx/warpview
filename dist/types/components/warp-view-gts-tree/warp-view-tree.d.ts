import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
export declare class WarpViewTreeView {
    gtsList: any;
    branch: boolean;
    theme: string;
    hidden: boolean;
    gtsFilter: string;
    ref: boolean;
    el: HTMLElement;
    hide: any;
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
     * @param {UIEvent} event
     * @param {number} index
     */
    toggleVisibility(event: UIEvent, index: number): void;
    private onGtsFilter;
    /**
     *
     * @param {number} index
     * @returns boolean
     */
    isHidden(index: number): any;
    /**
     *
     * @returns {any}
     */
    render(): JSX.Element;
}
