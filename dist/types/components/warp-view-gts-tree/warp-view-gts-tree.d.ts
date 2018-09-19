import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class WarpViewGtsTree {
    data: DataModel | GTS[] | string;
    theme: string;
    private gtsList;
    private LOG;
    onData(newValue: any, oldValue: any): void;
    /**
     *
     */
    componentWillLoad(): void;
    private doRender;
    render(): JSX.Element;
}
export declare class Counter {
    static item: number;
}
