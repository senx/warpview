import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumToggle {
    option: string;
    checked: boolean;
    state: boolean;
    text1: string;
    text2: string;
    timeSwitched: EventEmitter;
    private _option;
    componentWillLoad(): void;
    switched(): void;
    render(): JSX.Element;
}
