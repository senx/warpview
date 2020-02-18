/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  RendererStyleFlags2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Logger} from '../../utils/logger';

/**
 *
 */
@Component({
  selector: 'warpview-resize',
  templateUrl: './warp-view-resize.component.html',
  styleUrls: ['./warp-view-resize.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewResizeComponent implements AfterViewInit {
  @ViewChild('handleDiv', {static: true}) handleDiv: ElementRef;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;
  @Input('minHeight') minHeight = '10';
  @Input('initialHeight') initialHeight = 100;

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Output('resize') resize = new EventEmitter();

  private dragging = false;
  private moveListener: EventListener;
  private clickUpListener: EventListener;
  private LOG: Logger;
  private _debug = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.LOG = new Logger(WarpViewResizeComponent, this.debug);
  }

  ngAfterViewInit(): void {
    // if (this.firstDraw && this.initialHeight) {
    this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
    this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px', RendererStyleFlags2.Important);
    //  }
    // the click event on the handlebar attach mousemove and mouseup events to document.
    this.handleDiv.nativeElement.addEventListener('mousedown', (ev: MouseEvent) => {
      if (0 === ev.button) {
        // keep left click only
        this.moveListener = this.handleDraggingMove.bind(this);
        this.clickUpListener = this.handleDraggingEnd.bind(this);
        document.addEventListener('mousemove', this.moveListener, false);
        document.addEventListener('mouseup', this.clickUpListener, false);
      }
    });
  }

  private handleDraggingEnd() {
    this.dragging = false;
    // the mouseup detach mousemove and mouseup events from document.
    if (this.moveListener) {
      document.removeEventListener('mousemove', this.moveListener, false);
      this.moveListener = null;
    }
    if (this.clickUpListener) {
      document.removeEventListener('mouseup', this.clickUpListener, false);
      this.clickUpListener = null;
    }
  }

  private handleDraggingMove(ev: MouseEvent) {
    ev.preventDefault();
    this.LOG.debug(['handleDraggingMove'], ev);
    // compute Y of the parent div top relative to page
    const yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
      - document.body.getBoundingClientRect().top;
    // compute new parent height
    let h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
    if (h < parseInt(this.minHeight, 10)) {
      h = parseInt(this.minHeight, 10);
    }
    // apply new height
    this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
    this.LOG.debug(['handleDraggingMove'], h);
    this.resize.emit(h);
  }
}
