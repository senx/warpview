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
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as Plotlyjs from 'plotly.js/dist/plotly';
import {Config, Data, Layout, PlotlyHTMLElement, Plots} from 'plotly.js';
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
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  protected defaultClassName = 'js-plotly-plot';
  protected LOG: Logger;

  public plotlyInstance: PlotlyHTMLElement;
  public resizeHandler?: (instance: PlotlyHTMLElement) => void;
  public layoutDiffer: KeyValueDiffer<string, any>;
  public dataDiffer: IterableDiffer<Partial<any>>;

  @ViewChild('plot', {static: true}) plotEl: ElementRef;

  @Input() data?: Partial<any>[];
  @Input() layout?: Partial<any>;
  @Input() config?: Partial<Config>;
  @Input() frames?: Partial<any>[];
  @Input() style?: { [key: string]: string };

  @Input() divId?: string;
  @Input() revision = 0;
  @Input() className?: string | string[];
  @Input() debug = false;
  @Input() useResizeHandler = false;

  @Input() updateOnLayoutChange = true;
  @Input() updateOnDataChange = true;
  @Input() updateOnlyWithRevision = true;

  @Output() initialized = new EventEmitter<PlotlyHTMLElement>();
  @Output() update = new EventEmitter<Figure>();
  @Output() purge = new EventEmitter<Figure>();
  @Output() error = new EventEmitter<Error>();

  @Output() afterExport = new EventEmitter();
  @Output() afterPlot = new EventEmitter();
  @Output() animated = new EventEmitter();
  @Output() animatingFrame = new EventEmitter();
  @Output() animationInterrupted = new EventEmitter();
  @Output() autoSize = new EventEmitter();
  @Output() beforeExport = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();
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

  public eventNames = ['afterExport', 'afterPlot', 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
    'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework', 'hover',
    'legendClick', 'legendDoubleClick', 'relayout', 'restyle', 'redraw', 'selected', 'selecting', 'sliderChange',
    'sliderEnd', 'sliderStart', 'transitioning', 'transitionInterrupted', 'unhover', 'relayouting'];

  constructor(
    public iterableDiffers: IterableDiffers,
    public keyValueDiffers: KeyValueDiffers
  ) {
    this.LOG = new Logger(PlotlyComponent, this.debug);
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

  ngOnChanges(changes: SimpleChanges) {
    this.LOG.debug(['ngOnChanges'], changes);
    const revision: SimpleChange = changes.revision;
    if (changes.debug) {
      this.debug = changes.debug.currentValue;
    }
    if ((revision && !revision.isFirstChange()) || !!changes.layout || !!changes.data || !!changes.config) {
      this.updatePlot();
    }
    if (!!changes.debug) {
      this.LOG.setDebug(changes.debug.currentValue);
    }
    this.updateWindowResizeHandler();
    this.LOG.debug(['ngOnChanges'], changes);
  }

  ngDoCheck() {
    if (this.updateOnlyWithRevision) {
      return false;
    }
    let shouldUpdate = false;
    if (this.updateOnLayoutChange) {
      if (this.layoutDiffer) {
        const layoutHasDiff = this.layoutDiffer.diff(this.layout);
        if (layoutHasDiff) {
          shouldUpdate = true;
        }
      } else if (this.layout) {
        this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
      } else {
        this.layoutDiffer = undefined;
      }
    }

    if (this.updateOnDataChange) {
      if (this.dataDiffer) {
        const dataHasDiff = this.dataDiffer.diff(this.data);
        if (dataHasDiff) {
          shouldUpdate = true;
        }
      } else if (Array.isArray(this.data)) {
        this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
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

  getClassName(): string {
    let classes = [this.defaultClassName];
    if (Array.isArray(this.className)) {
      classes = classes.concat(this.className);
    } else if (this.className) {
      classes.push(this.className);
    }

    return classes.join(' ');
  }

  restyleChart(propertie: any, curves: any[]) {
    Plotlyjs.restyle(this.plotlyInstance, propertie, curves);
  }

  createPlot(): Promise<void> {
    this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
    let drawFn = Plotlyjs.newPlot;
    if (this.plotlyInstance) {
      drawFn = Plotlyjs.react;
    }
    return drawFn(this.plotEl.nativeElement, this.data, this.layout, this.config).then(plotlyInstance => {
      this.plotlyInstance = plotlyInstance;
      this.LOG.debug(['plotlyInstance'], plotlyInstance);
      this.getWindow().gd = this.debug ? plotlyInstance : undefined;

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
    this.LOG.debug(['updatePlot'], this.data, this.layout, {...this.config});
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

  updateWindowResizeHandler() {
    if (this.useResizeHandler) {
      if (this.resizeHandler === undefined) {
        this.resizeHandler = () => Plots.resize(this.plotlyInstance);
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
}
