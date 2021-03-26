/*
 *  Copyright 2021  SenX S.A.S.
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
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as Plotlyjs from 'plotly.js-dist';
import {Config, Data, Layout, PlotlyHTMLElement, Plots} from 'plotly.js-dist';
import {Logger} from '../utils/logger';

export interface Figure {
  data: Data[];
  layout: Partial<Layout>;
  frames: Partial<Config>;
}

@Component({
  selector: 'warpview-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PlotlyComponent implements OnInit, OnDestroy, DoCheck {
  protected defaultClassName = 'js-plotly-plot';
  protected LOG: Logger;
  private _data;
  private _layout;
  private _config;
  private _debug = false;
  public plotlyInstance: PlotlyHTMLElement;
  public resizeHandler?: (instance: PlotlyHTMLElement) => void;
  public layoutDiffer: KeyValueDiffer<string, any>;
  public dataDiffer: IterableDiffer<Partial<any>>;

  @ViewChild('plot', {static: true}) plotEl: ElementRef;

  @Input() set data(data: Partial<any>[]) {
    this._data = data;
    this.LOG.debug(['PlotlyComponent'], data);
    this.updatePlot();
    this.LOG.debug(['PlotlyComponent'], 'after updatePlot');
    this.updateWindowResizeHandler();
    this.LOG.debug(['PlotlyComponent'], 'after updateWindowResizeHandler');
  }

  get data(): Partial<any>[] {
    return this._data;
  }

  @Input() set layout(layout: Partial<any>) {
    this._layout = {...layout};
    if (!!this._data && !!this.plotEl.nativeElement) {
      try {
        Plotlyjs.relayout(this.plotEl.nativeElement, this._layout);
        this.updateWindowResizeHandler();
      } catch (e) {
        //
      }
    }
  }

  get layout(): Partial<any> {
    return this._layout;
  }

  @Input() set config(config: Partial<Config>) {
    this._config = config;
    this.updatePlot();
    this.updateWindowResizeHandler();
  }

  get config(): Partial<Config> {
    return this._config;
  }

  @Input('debug') set debug(debug: boolean | string) {
    if (typeof debug === 'string') {
      debug = 'true' === debug;
    }
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input() frames?: Partial<any>[];
  @Input() style?: { [key: string]: string };

  @Input() divId?: string;
  @Input() revision = 0;
  @Input() className?: string | string[];
  @Input() useResizeHandler = false;

  @Input() updateOnLayoutChange = true;
  @Input() updateOnDataChange = true;
  @Input() updateOnlyWithRevision = true;

  @Output() initialized = new EventEmitter<PlotlyHTMLElement>();
  @Output() update = new EventEmitter<Figure>();
  @Output() purge = new EventEmitter<Figure>();
  // tslint:disable-next-line:no-output-native
  @Output() error = new EventEmitter<Error>();

  @Output() afterExport = new EventEmitter();
  @Output() afterPlot = new EventEmitter();
  @Output() animated = new EventEmitter();
  @Output() animatingFrame = new EventEmitter();
  @Output() animationInterrupted = new EventEmitter();
  @Output() autoSize = new EventEmitter();
  @Output() beforeExport = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
  // tslint:disable-next-line:no-output-native
  @Output() click = new EventEmitter();
  @Output() plotly_click = new EventEmitter();
  @Output() clickAnnotation = new EventEmitter();
  @Output() deselect = new EventEmitter();
  @Output() doubleClick = new EventEmitter();
  @Output() framework = new EventEmitter();
  @Output() hover = new EventEmitter();
  @Output() legendClick = new EventEmitter();
  @Output() legendDoubleClick = new EventEmitter();
  @Output() relayout = new EventEmitter();
  @Output() restyle = new EventEmitter();
  @Output() redraw = new EventEmitter();
  @Output() selected = new EventEmitter();
  @Output() selecting = new EventEmitter();
  @Output() sliderChange = new EventEmitter();
  @Output() sliderEnd = new EventEmitter();
  @Output() sliderStart = new EventEmitter();
  @Output() transitioning = new EventEmitter();
  @Output() transitionInterrupted = new EventEmitter();
  @Output() unhover = new EventEmitter();
  @Output() relayouting = new EventEmitter();

  public eventNames = [
    // 'afterExport',
    //   'afterPlot', // 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
    // 'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework',
    'hover', 'unhover',
    // 'legendClick', 'legendDoubleClick',
    'relayout',
    // 'restyle', 'redraw', 'selected', 'selecting', 'sliderChange',
    // 'sliderEnd', 'sliderStart', 'transitioning', 'transitionInterrupted', 'relayouting'
  ];
  rect: any;

  constructor(
    public iterableDiffers: IterableDiffers,
    public el: ElementRef,
    public keyValueDiffers: KeyValueDiffers
  ) {
    this.LOG = new Logger(PlotlyComponent, this._debug);
  }

  ngOnInit() {
    this.createPlot().then(() => {
      const figure = this.createFigure();
      this.LOG.debug(['figure'], figure);
      this.initialized.emit(this.plotlyInstance);
    });
  }

  ngOnDestroy() {
    if (typeof this.resizeHandler === 'function') {
      this.getWindow().removeEventListener('resize', this.resizeHandler as any);
      this.resizeHandler = undefined;
    }

    const figure = this.createFigure();
    this.purge.emit(figure);
    this.remove(this.plotlyInstance);
  }

  ngDoCheck() {
    if (this.updateOnlyWithRevision) {
      return false;
    }
    let shouldUpdate = false;
    if (this.updateOnLayoutChange) {
      if (this.layoutDiffer) {
        const layoutHasDiff = this.layoutDiffer.diff(this._layout);
        if (layoutHasDiff) {
          shouldUpdate = true;
        }
      } else if (this._layout) {
        this.layoutDiffer = this.keyValueDiffers.find(this._layout).create();
      } else {
        this.layoutDiffer = undefined;
      }
    }

    if (this.updateOnDataChange) {
      if (this.dataDiffer) {
        const dataHasDiff = this.dataDiffer.diff(this._data);
        if (dataHasDiff) {
          shouldUpdate = true;
        }
      } else if (Array.isArray(this._data)) {
        this.dataDiffer = this.iterableDiffers.find(this._data).create(this.dataDifferTrackBy);
      } else {
        this.dataDiffer = undefined;
      }
    }
    if (shouldUpdate && this.plotlyInstance) {
      this.updatePlot();
    }
  }

  getWindow(): any {
    return window;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  getClassName(): string {
    let classes = [this.defaultClassName];
    if (Array.isArray(this.className)) {
      classes = classes.concat(this.className);
    } else if (!!this.className) {
      classes.push(this.className);
    }
    return classes.join(' ');
  }

  restyleChart(properties: any, curves: any[]) {
    Plotlyjs.restyle(this.plotlyInstance, properties, curves);
  }

  createPlot(): Promise<void> {
    this.LOG.debug(['createPlot']);
    return Plotlyjs.react(this.plotEl.nativeElement, this._data, this._layout, this._config)
      .then(plotlyInstance => {
        this.LOG.debug(['plotlyInstance'], plotlyInstance);
        this.rect = this.el.nativeElement.getBoundingClientRect();
        this.plotlyInstance = plotlyInstance;
        this.getWindow().gd = this._debug ? plotlyInstance : undefined;

        this.eventNames.forEach(name => {
          const eventName = `plotly_${name.toLowerCase()}`;
          // @ts-ignore
          plotlyInstance.on(eventName, (data: any) => {
            this.LOG.debug(['plotlyEvent', eventName], data);
            (this[name] as EventEmitter<any>).emit(data);
          });
        });

        plotlyInstance.on('plotly_click', (data: any) => {
          this.click.emit(data);
          this.plotly_click.emit(data);
        });

        this.updateWindowResizeHandler();
        this.afterPlot.emit(plotlyInstance);
      }, err => {
        console.error('Error while plotting:', err);
        this.error.emit(err);
      });
  }

  createFigure(): Figure {
    const p: any = this.plotlyInstance;
    return {
      data: p.data,
      layout: p.layout,
      frames: p._transitionData ? p._transitionData._frames : null
    };
  }

  updatePlot() {
    this.LOG.debug(['updatePlot'], this._data, this._layout, {...this._config});
    if (!this.plotlyInstance) {
      const error = new Error(`Plotly component wasn't initialized`);
      this.error.emit(error);
      return;
    }
    Plotlyjs.purge(this.plotlyInstance);
    this.createPlot().then(() => {
      const figure = this.createFigure();
      this.update.emit(figure);
    }, err => {
      console.error('Error while updating plot:', err);
      this.error.emit(err);
    });
  }

  relayoutPlot(field: string, update: any) {
    if (!this.plotlyInstance) {
      const error = new Error(`Plotly component wasn't initialized`);
      this.error.emit(error);
      return;
    }
    Plotlyjs.relayout(this.plotlyInstance, field, update);
  }

  updateWindowResizeHandler() {
    if (this.useResizeHandler) {
      if (this.resizeHandler === undefined) {
        this.resizeHandler = () => setTimeout(() => Plots.resize(this.plotlyInstance));
        this.getWindow().addEventListener('resize', this.resizeHandler as any);
      }
    } else {
      if (typeof this.resizeHandler === 'function') {
        this.getWindow().removeEventListener('resize', this.resizeHandler as any);
        this.resizeHandler = undefined;
      }
    }
  }

  dataDifferTrackBy(_: number, item: any): any {
    const obj = Object.assign({}, item, {uid: ''});
    return JSON.stringify(obj);
  }


  remove(div: PlotlyHTMLElement) {
    Plotlyjs.purge(div);
    delete this.plotlyInstance;
  }

  resize(layout: { width: number; height: any }) {
    Plotlyjs.relayout(this.plotEl.nativeElement, layout);
  }

  getElement(s: string) {
    return this.plotEl.nativeElement.querySelectorAll(s);
  }
}
