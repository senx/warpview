import '../../stencil.core';
import { EventEmitter } from "../../stencil.core";
import { DataModel } from "../../model/dataModel";
export declare class WarpViewGtsPopup {
    gtsList: DataModel;
    maxToShow: number;
    hiddenData: number[];
    debug: boolean;
    kbdLastKeyPressed: string[];
    warpViewSelectedGTS: EventEmitter;
    private displayed;
    current: number;
    private _gts;
    private modal;
    private modalOpenned;
    private LOG;
    onWarpViewModalOpen(): void;
    onWarpViewModalClose(): void;
    handleKeyDown(key: string[]): boolean;
    isOpened(): Promise<boolean>;
    private onHideData;
    private onData;
    private showPopup;
    private prepareData;
    componentWillLoad(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
