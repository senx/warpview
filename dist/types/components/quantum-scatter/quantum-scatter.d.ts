import '../../stencil.core';
import '../../stencil.core';
import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class QuantumScatter {
    unit: string;
    chartTitle: string;
    responsive: boolean;
    showLegend: boolean;
    data: string;
    options: {
        gridLineColor?: string;
    };
    width: string;
    height: string;
    timeMin: number;
    timeMax: number;
    theme: string;
    standalone: boolean;
    pointHover: EventEmitter;
    el: HTMLElement;
    redraw(newValue: string, oldValue: string): void;
    onTheme(newValue: string, oldValue: string): void;
    drawChart(): void;
    gtsToScatter(gts: any): any[];
    componentDidLoad(): void;
    render(): JSX.Element;
}
