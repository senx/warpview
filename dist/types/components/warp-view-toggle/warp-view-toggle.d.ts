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
    private onchecked;
    switched(): void;
    render(): JSX.Element;
}
