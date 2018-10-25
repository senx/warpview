import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class WarpViewGtsTree {
    data: DataModel | GTS[] | string;
    theme: string;
    gtsFilter: string;
    hide: boolean;
    private gtsList;
    private LOG;
    onData(newValue: any, oldValue: any): void;
    private onGtsFilter;
    /**
     *
     */
    componentWillLoad(): void;
    private doRender;
    toggleVisibility(event: UIEvent): void;
    render(): JSX.Element;
}
export declare class Counter {
    static item: number;
}
