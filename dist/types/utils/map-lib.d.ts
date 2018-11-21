export declare class MapLib {
    private static BASE_RADIUS;
    private static LOG;
    /**
     *
     * @param {{gts: any[]; params: any[]}} data
     * @returns {any[]}
     */
    static toLeafletMapPaths(data: {
        gts: any[];
        params: any[];
    }): any[];
    /**
     *
     * @param {{gts: any[]; params: any[]}} data
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
     * @param {{gts: any[]; params: any[]}} data
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
