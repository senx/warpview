import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumToggle {
    checked: boolean;
    text1: string;
    text2: string;
    el: HTMLElement;
    state: boolean;
    stateChange: EventEmitter;
    componentWillLoad(): void;
    switched(): void;
    render(): JSX.Element;
}
