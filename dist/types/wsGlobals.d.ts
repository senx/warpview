export interface IEntry {
    description?: string;
    signature?: string;
    tags?: string[];
    since: string;
}
export interface IEntries {
    [name: string]: IEntry;
}
export declare var globalfunctions: IEntries;
