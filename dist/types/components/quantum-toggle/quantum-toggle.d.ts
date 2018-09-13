import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Param } from "../../model/param";
export declare class QuantumToggle {
    options: Param;
    checked: boolean;
    text1: string;
    text2: string;
    state: boolean;
    timeSwitched: EventEmitter;
    private _options;
    componentWillLoad(): void;
    switched(): void;
    render(): JSX.Element;
}
