import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class WarpViewToggle {
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
