export declare class MapLib {
    private static BASE_RADIUS;
    private static LOG;
    /**
     *
     * @param data
     */
    static toLeafletMapPaths(data: {
        gts: any[];
        params: any[];
    }): any[];
    static annotationsToLeafletPositions(data: {
        gts: any[];
        params: any[];
    }): any[];
    private static extractCommonParameters;
    private static validateWeightedDotsPositionArray;
    static toLeafletMapPositionArray(data: {
        gts: any[];
        params: any[];
    }): any[];
    private static validateWeightedColoredDotsPositionArray;
    static getBoundsArray(paths: any, positionsData: any, annotationsData: any): any[];
    static pathDataToLeaflet(pathData: any, options: any): any[];
}
