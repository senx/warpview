export declare class ChartLib {
    /**
     * Generate a guid
     * @returns {string}
     */
    static guid(): string;
    /**
     *
     * @param sources
     * @returns {{}}
     */
    static mergeDeep(...sources: any[]): {};
    /**
     *
     * @param obj
     * @param extended
     * @param deep
     */
    static merge(obj: any, extended: any, deep: any): void;
    /**
     *
     * @param item
     */
    static isObject(item: any): boolean;
    /**
     *
     * @returns {{title: (tooltipItem) => any; label: (tooltipItem, data) => string}}
     */
    static getTooltipCallbacks(): {
        title: (tooltipItem: any) => any;
        label: (tooltipItem: any, data: any) => any;
    };
    /**
     *
     * @param {number} w
     * @param {number} h
     * @param {string} color
     * @returns {HTMLImageElement}
     */
    static buildImage(w: number, h: number, color: string): HTMLImageElement;
    /**
     * Watch the parent resize of an element.
     * @param el The component Element
     * @param redrawfunction The resize or redraw function to call if container size change. don't forget to .bind(this)
     * @param period Timer component By default, 2 s
     */
    static resizeWatchTimer(el: HTMLElement, redrawfunction: Function, period?: number): number;
}
