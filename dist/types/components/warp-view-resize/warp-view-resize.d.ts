import '../../stencil.core';
export declare class WcResize {
    /**
     * Minimum height in pixel. default 10px.
     */
    minHeight: string;
    /**
     * If set, force the initial height to the given value in px.
     */
    initialHeight: string;
    private handleDiv;
    private dragging;
    private moveListener;
    private clickUpListener;
    private firstDraw;
    onResize(event: CustomEvent): void;
    private handleDraggingEnd;
    private handleDraggingMove;
    componentDidLoad(): void;
    render(): JSX.Element;
}
