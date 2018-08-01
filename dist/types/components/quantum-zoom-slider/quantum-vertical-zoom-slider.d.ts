import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumVerticalZoomSlider {
    height: number;
    maxValue: number;
    minValue: number;
    cursorSize: string;
    config: string;
    el: HTMLElement;
    ySliderValueChanged: EventEmitter;
    yZoom: EventEmitter;
    private _rail;
    private _cursor;
    private _cursorHeight;
    private _cursorMinHeight;
    private _railMin;
    private _railMax;
    private _mouseCursorTopOffset;
    private _mouseCursorBottomOffset;
    changeCursorSize(newValue: string, oldValue: string): void;
    initSize(newValue: number, oldValue: number): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    dimsY(event: any): void;
    yWheel(event: any): void;
    render(): JSX.Element;
}
