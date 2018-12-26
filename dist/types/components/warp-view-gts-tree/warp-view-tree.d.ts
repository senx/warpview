import '../../stencil.core';
export declare class WarpViewTreeView {
    gtsList: any[];
    branch: boolean;
    hidden: boolean;
    gtsFilter: string;
    hiddenData: number[];
    ref: boolean;
    el: HTMLElement;
    private hide;
    private LOG;
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
    private onHideData;
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
