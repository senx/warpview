export declare class MapLib {
    static BASE_RADIUS: number;
    private static LOG;
    static mapTypes: any;
    static toLeafletMapPaths(data: {
        gts: any[];
        params: any[];
    }, hiddenData: number[], scheme: string): any[];
    static gtsToPath(gts: any): any[];
    private static extractCommonParameters;
    private static validateWeightedDotsPositionArray;
    static toLeafletMapPositionArray(data: {
        gts: any[];
        params: any[];
    }, hiddenData: number[], scheme: string): any[];
    private static validateWeightedColoredDotsPositionArray;
    static getBoundsArray(paths: any, positionsData: any, annotationsData: any, geoJson: any): any[];
    static pathDataToLeaflet(pathData: any[]): any[];
    static toGeoJSON(data: {
        gts: any[];
        params: any[];
    }): any[];
    static updatePositionArrayToLeaflet(positionArray: any[]): any[];
}
