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
    kbdLastKeyPressed: string[];
    hide: boolean;
    private gtsList;
    private _options;
    private LOG;
    private root;
    onData(newValue: any, oldValue: any): void;
    private onOptions;
    private onGtsFilter;
    private onHideData;
    componentWillLoad(): void;
    componentDidLoad(): void;
    private doRender;
    private foldAll;
    toggleVisibility(): void;
    render(): JSX.Element;
}
