import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {VisibilityState, WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {DataModel} from '../../model/dataModel';
import {Param} from '../../model/param';
import {ColorLib} from '../../utils/color-lib';
import {GTSLib} from '../../utils/gts.lib';
import {GTS} from '../../model/GTS';
import * as moment from 'moment-timezone';

@Component({
  selector: 'warpview-spectrum',
  templateUrl: './warp-view-spectrum.component.html',
  styleUrls: ['./warp-view-spectrum.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewSpectrumComponent extends WarpViewComponent implements OnInit, OnDestroy {

  @ViewChild('graph', { static: true }) graph: ElementRef;
  @ViewChild('toolTip', { static: true }) toolTip: ElementRef;
  @Output() chartDraw = new EventEmitter<any>();

  @Input() set type(type: string) {
    this._type = type;
    this.drawChart();
  }

  protected layout: Partial<any> = {
    showlegend: false,
    xaxis: {},
    yaxis: {},
  };
  private _type = 'histogram2d';
  private visibility: boolean[] = [];
  private visibilityStatus: VisibilityState = 'unknown';
  private maxTick = 0;
  private minTick = 0;
  private visibleGtsId = [];

  constructor(private el: ElementRef, private sizeService: SizeService) {
    super();
    this.LOG = new Logger(WarpViewSpectrumComponent, this._debug);
    this.sizeService.sizeChanged$.subscribe(() => {
      if (this._chart) {
        this.layout.width = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().width;
        this.layout.height = (el.nativeElement as HTMLElement).parentElement.getBoundingClientRect().height;
        Plotly.relayout(this.graph.nativeElement, {
          height: this.layout.height,
          width: this.layout.width
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this._chart) {
      Plotly.purge(this._chart);
    }
  }

  update(options: Param): void {
    this.drawChart();
  }

  private drawChart() {
    if (!this.initiChart(this.el)) {
      return;
    }
    this.plotlyConfig.scrollZoom = true;
    this.buildGraph();
  }

  protected convert(data: DataModel): Partial<any>[] {
    const type = this._options.histo || {histnorm: 'density', histfunc: 'count'};
    const dataset: Partial<any>[] = [];
    this.LOG.debug(['convert'], this._options);
    this.visibility = [];
    let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data as any[], 0).res);
    this.maxTick = Number.NEGATIVE_INFINITY;
    this.minTick = Number.POSITIVE_INFINITY;
    this.visibleGtsId = [];
    const nonPlottable = gtsList.filter(g => {
      this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
      return (g.v && !GTSLib.isGtsToPlot(g));
    });
    gtsList = gtsList.filter(g => {
      return (g.v && GTSLib.isGtsToPlot(g));
    });
    // initialize visibility status
    if (this.visibilityStatus === 'unknown') {
      this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
    }

    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.layout.xaxis.type = 'linear';
    } else {
      this.layout.xaxis.type = 'date';
    }
    gtsList.forEach((gts: GTS) => {
      if (gts.v && GTSLib.isGtsToPlot(gts)) {
        const label = GTSLib.serializeGtsMetadata(gts);
        const color = ColorLib.getColor(gts.id, this._options.scheme);
        const series: Partial<any> = {
          type: this._type,
          histnorm: type.histnorm || 'density',
          histfunc: type.histfunc || 'count',
          contours: {
            showlabels: true,
            labelfont: {
              color: 'white'
            }
          },
          colorbar: {
            tickcolor: this.getGridColor(this.el.nativeElement),
            thickness: 0,
            tickfont: {
              color: this.getLabelColor(this.el.nativeElement)
            },
            x: 1 + gts.id / 20,
            xpad: 0
          },
          showscale: this.showLegend,
          colorscale: ColorLib.getColorGradient(gts.id, this._options.scheme),
          autocolorscale: false,
          name: label,
          text: label,
          x: [],
          y: [],
          line: {color},
          hoverinfo: 'none',
          connectgaps: false,
          visible: this._hiddenData.filter(h => h === gts.id).length >= 0,
        };
        gts.v.forEach(value => {
          const ts = value[0];
          (series.y as any[]).push(value[value.length - 1]);
          if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            (series.x as any).push(ts);
          } else {
            (series.x as any).push(moment(Math.floor(ts / this.divider)).utc(true).toDate());
          }
        });
        dataset.push(series);
      }
    });
    this.LOG.debug(['convert', 'dataset'], dataset);

    return dataset;
  }

  private buildGraph() {
    this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
    this.LOG.debug(['drawChart', 'this.layout'], this.layout);
    this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
    this.layout.showlegend = this.showLegend;
    this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
    this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
    Plotly.newPlot(this.graph.nativeElement, this.plotlyData, this.layout, this.plotlyConfig).then(plot => {
      this._chart = plot;
      this.manageTooltip(this.toolTip.nativeElement, this.graph.nativeElement);
      this.chartDraw.emit();
      this.loading = false;
    });
  }
}
