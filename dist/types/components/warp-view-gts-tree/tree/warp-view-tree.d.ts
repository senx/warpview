import '../../../stencil.core';
export declare class WarpViewTreeView {
    gtsList: any[];
    branch: boolean;
    hidden: boolean;
    gtsFilter: string;
    hiddenData: number[];
    debug: boolean;
    ref: boolean;
    el: HTMLElement;
    private hide;
    private LOG;
    /**
     *
     * @param {UIEvent} event
     * @param {number} index
     */
    toggleVisibility(event: UIEvent, index: number): void;
    private onGtsFilter;
    private onHideData;
    /**
     *
     * @param {number} index
     * @returns boolean
     */
    isHidden(index: number): any;
    componentWillLoad(): void;
    /**
     *
     * @returns {any}
     */
    render(): JSX.Element;
}
