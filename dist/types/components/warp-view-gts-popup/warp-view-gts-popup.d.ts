import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { DataModel } from "../../model/dataModel";
export declare class WarpViewGtsPopup {
    gtsList: DataModel;
    maxToShow: number;
    hiddenData: number[];
    debug: boolean;
    warpViewSelectedGTS: EventEmitter;
    private displayed;
    current: number;
    private _gts;
    private chips;
    private modal;
    private modalOpenned;
    private LOG;
    onWarpViewModalOpen(): void;
    onWarpViewModalClose(): void;
    onKeyDown(e: KeyboardEvent): boolean;
    onKeyUp(ev: KeyboardEvent): boolean;
    private onHideData;
    private onData;
    private showPopup;
    private prepareData;
    private colorizeChips;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
