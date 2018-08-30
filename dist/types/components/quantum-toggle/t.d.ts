import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class myComponent {
    option: string;
    checked: boolean;
    el: HTMLElement;
    stateChanged: EventEmitter;
    private _var;
    watchHandler(newValue: boolean, oldValue: boolean): void;
    listenHandler(event: CustomEvent): void;
    function(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentWillUpdate(): void;
    componentDidUpdate(): void;
    componentDidUnload(): void;
    render(): JSX.Element;
}
