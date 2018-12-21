import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { DataModel } from "../../model/dataModel";
export declare class WarpViewGtsPopup {
    gtsList: DataModel;
    maxToShow: number;
    hiddenData: number[];
    warpViewSelectedGTS: EventEmitter;
    private show;
    private displayed;
    private current;
    componentDidLoad(): void;
    render(): JSX.Element;
}
