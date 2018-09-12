import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumToggle {
    options: string;
    checked: boolean;
    state: boolean;
    text1: string;
    text2: string;
    timeSwitched: EventEmitter;
    private _options;
    componentWillLoad(): void;
    switched(): void;
    render(): JSX.Element;
}
