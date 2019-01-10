import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
import { Param } from "../../model/param";
export declare class WarpViewGtsTree {
    data: DataModel | DataModel[] | GTS[] | string;
    gtsFilter: string;
    options: Param;
    hiddenData: number[];
    debug: boolean;
    hide: boolean;
    private gtsList;
    private _options;
    private LOG;
    private _isFolded;
    private root;
    private initialized;
    onData(newValue: any, oldValue: any): void;
    private onOptions;
    private onGtsFilter;
    private onHideData;
    componentDidLoad(): void;
    private doRender;
    private foldAll;
    toggleVisibility(event: UIEvent): void;
    render(): JSX.Element;
}
