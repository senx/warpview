import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
import { Param } from "../../model/param";
export declare class WarpViewGtsTree {
    data: DataModel | DataModel[] | GTS[] | string;
    gtsFilter: string;
    options: Param;
    hiddenData: number[];
    hide: boolean;
    el: HTMLElement;
    private gtsList;
    private _options;
    private LOG;
    private _isFolded;
    onData(newValue: any, oldValue: any): void;
    private onOptions;
    private onGtsFilter;
    private onHideData;
    /**
     *
     */
    componentWillLoad(): void;
    private doRender;
    private foldAll;
    toggleVisibility(event: UIEvent): void;
    render(): JSX.Element;
}
