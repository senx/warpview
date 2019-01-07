import { Moment } from "moment";
export declare class Datum {
    date: Moment;
    summary?: Summary[];
    total?: number;
    details?: Detail[];
}
export declare class Summary {
    color?: string;
    id?: number;
    name: string;
    total: number;
    date?: Moment;
}
export declare class Detail {
    color?: string;
    date: number;
    id: number;
    name: string;
    value: number;
}
