import '../../stencil.core';
export declare class QuantumHeatmap {
    mapTitle: string;
    width: number;
    height: number;
    responsive: boolean;
    el: HTMLElement;
    private _map;
    drawMap(): void;
    componentDidLoad(): void;
    render(): JSX.Element;
}
