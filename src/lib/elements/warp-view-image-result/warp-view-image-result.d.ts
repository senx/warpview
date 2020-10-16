import { GTSLib } from '../../model/gts.lib';
export declare class WarpViewImageResult {
    private gtsLib;
    set debug(debug: boolean | string);
    get debug(): boolean | string;
    set result(res: string);
    get result(): string;
    set theme(newValue: string);
    get theme(): string;
    config: object;
    _result: any[];
    _res: string;
    _theme: string;
    _debug: boolean;
    loading: boolean;
    imageList: string[];
    private LOG;
    constructor(gtsLib: GTSLib);
    isArray(arr: any): boolean;
}
