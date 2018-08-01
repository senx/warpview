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
    componentDidLoad(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    switched(): void;
    switchedListener(event: CustomEvent): void;
}
