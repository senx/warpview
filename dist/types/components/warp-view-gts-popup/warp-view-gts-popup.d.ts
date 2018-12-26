import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { DataModel } from "../../model/dataModel";
export declare class WarpViewGtsPopup {
    gtsList: DataModel;
    maxToShow: number;
    hiddenData: number[];
    warpViewSelectedGTS: EventEmitter;
    private displayed;
    current: number;
    private _gts;
    private chips;
    private modal;
    private LOG;
    handleKeyDown(e: KeyboardEvent): boolean;
    handleKeyUp(ev: KeyboardEvent): boolean;
    private onHideData;
    private onData;
    private showPopup;
    private prepareData;
    private colorizeChips;
    componentDidLoad(): void;
    render(): JSX.Element;
}
