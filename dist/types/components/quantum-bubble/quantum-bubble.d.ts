import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumBubble {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    standalone: boolean;
    data: string;
    options: {
        gridLineColor?: string;
    };
    theme: string;
    width: string;
    height: string;
    timeMin: number;
    timeMax: number;
    pointHover: EventEmitter;
    el: HTMLElement;
    redraw(newValue: string, oldValue: string): void;
    drawChart(): void;
    parseData(gts: any): any[];
    componentDidLoad(): void;
    render(): JSX.Element;
}
