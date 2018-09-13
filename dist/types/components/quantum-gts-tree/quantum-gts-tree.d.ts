import '../../stencil.core';
import { DataModel } from "../../model/dataModel";
import { GTS } from "../../model/GTS";
export declare class QuantumGtsTree {
    data: DataModel | GTS[];
    theme: string;
    private gtsList;
    private LOG;
    onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]): void;
    /**
     *
     */
    componentWillLoad(): void;
    render(): JSX.Element;
}
export declare class Counter {
    static item: number;
}
