export declare class MapLib {
    static BASE_RADIUS: number;
    private static LOG;
    /**
     *
     * @param {object} data
     * @returns {any[]}
     */
    static toLeafletMapPaths(data: {
        gts: any[];
        params: any[];
    }): any[];
    /**
     *
     * @param {data} data
     * @returns {any[]}
     */
    static annotationsToLeafletPositions(data: {
        gts: any[];
        params: any[];
    }): any[];
    /**
     *
     * @param obj
     * @param params
     * @param index
     */
    private static extractCommonParameters;
    /**
     *
     * @param posArray
     * @param params
     * @returns {boolean}
     */
    private static validateWeightedDotsPositionArray;
    /**
     *
     * @param {object} data
     * @returns {any[]}
     */
    static toLeafletMapPositionArray(data: {
        gts: any[];
        params: any[];
    }): any[];
    /**
     *
     * @param posArray
     * @param params
     */
    private static validateWeightedColoredDotsPositionArray;
    /**
     *
     * @param paths
     * @param positionsData
     * @param annotationsData
     * @returns {any}
     */
    static getBoundsArray(paths: any, positionsData: any, annotationsData: any): any[];
    /**
     *
     * @param pathData
     * @param options
     * @returns {any[]}
     */
    static pathDataToLeaflet(pathData: any, options: any): any[];
}
