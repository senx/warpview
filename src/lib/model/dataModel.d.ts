import { Param } from './param';
export declare class DataModel {
    data: any[] | string;
    params?: Param[];
    globalParams?: Param;
    bounds?: {
        xmin?: number;
        xmax?: number;
        ymin?: number;
        ymax?: number;
    };
}
