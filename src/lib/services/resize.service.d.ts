import { EventEmitter } from '@angular/core';
export declare class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
}
export declare class SizeService {
    sizeChanged$: EventEmitter<Size>;
    constructor();
    change(size: Size): void;
}
