import { ElementRef } from '@angular/core';
export declare class BubblingEvents {
    /**
     * Angular provides support for custom events via Output properties and the EventEmitter. Unlike DOM events Angular custom events do not bubble.
     * see : http://blog.davidjs.com/2018/02/angular-custom-event-bubbling/
     * This class allow to create events that can bubble up outside angular element webcomponents
     */
    static emitBubblingEvent(el: ElementRef, eventname: string, eventdetail?: any): void;
}
