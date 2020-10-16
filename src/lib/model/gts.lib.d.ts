export declare class GTSLib {
    color: string[];
    getColor(i: any): string;
    unique(arr: any): any[];
    hexToRgb(hex: any): number[];
    transparentize(color: any, alpha: number): string;
    isArray(value: any): boolean;
    isEmbeddedImage(item: any): boolean;
    isEmbeddedImageObject(item: any): boolean;
    gtsFromJSON(json: any, id: any): {
        gts: {
            c: any;
            l: any;
            a: any;
            v: any;
            id: any;
        };
    };
    gtsFromJSONList(jsonList: any, prefixId: any): {
        content: any[];
    };
    flatDeep(arr1: any): any;
    isGts(item: any): boolean;
    isObject(item: any): boolean;
}
