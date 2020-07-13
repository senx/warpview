import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import deepEqual from 'deep-equal';
import {ChartLib} from '../../utils/chart-lib';
import {Param} from '../../model/param';
import {DataModel} from '../../model/dataModel';
import {ColorLib} from '../../utils/color-lib';
import * as d3 from 'd3';
import eventDrops from 'event-drops';
import {GTSLib} from '../../utils/gts.lib';
import moment from 'moment-timezone';
import {select} from 'd3-selection';

@Component({
  selector: 'warpview-event-drop',
  templateUrl: './warp-view-event-drop.component.html',
  styleUrls: ['./warp-view-event-drop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewEventDropComponent extends WarpViewComponent implements OnInit, OnDestroy {
  @ViewChild('elemChart', {static: true}) elemChart: ElementRef;

  @Input('type') set type(type: string) {
    this._type = type;
    this.drawChart();
  }


  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    const previousVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
    this._hiddenData = hiddenData;
    this.visibility = [];
    this.visibleGtsId.forEach(id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)));
    this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
    const newVisibility = JSON.stringify(this.visibility);
    this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
    if (previousVisibility !== newVisibility) {
      this.drawChart();
      this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
    }
  }

  @Output('pointHover') pointHover = new EventEmitter<any>();
  @Output('warpViewChartResize') warpViewChartResize = new EventEmitter<any>();
  @Output('chartDraw') chartDraw = new EventEmitter<any>();
  @Output('boundsDidChange') boundsDidChange = new EventEmitter<any>();

  private visibility: boolean[] = [];
  private maxTick = Number.MIN_VALUE;
  private minTick = Number.MAX_VALUE;
  private visibleGtsId = [];
  private _type = 'drops';
  private eventConf = {
    d3,
    axis: {
      verticalGrid: true,
      tickPadding: 6,
    },
    indicator: false,
    label: {
      text: row => row.name,
    },
    drop: {
      date: d => new Date(d.date),
      color: d => d.color,
      onMouseOver: g => {
        this.LOG.debug(['onMouseOver'], g);
        this.pointHover.emit({
          x: d3.event.offsetX,
          y: d3.event.offsetY
        });
        const t = d3
          .select(this.toolTip.nativeElement);
        t.transition()
          .duration(200)
          .style('opacity', 1)
          .style('pointer-events', 'auto');
        t.html(`<div class="tooltip-body">
<b class="tooltip-date">${this._options.timeMode === 'timestamp'
          ? g.date
          : (moment(g.date.valueOf()).utc().toISOString() || '')}</b>
<div><i class="chip"  style="background-color: ${ColorLib.transparentize(g.color, 0.7)};border: 2px solid ${g.color};"></i>
${GTSLib.formatLabel(g.name)}: <span class="value">${g.value}</span>
</div></div>`
        )
          .style('left', `${d3.event.offsetX - 30}px`)
          .style('top', `${d3.event.offsetY + 20}px`);
      },
      onMouseOut: () => {
        select(this.toolTip.nativeElement)
          .transition()
          .duration(500)
          .style('opacity', 0)
          .style('pointer-events', 'none');
      },
    },
  };

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewEventDropComponent, this._debug);
  }


  ngOnInit(): void {
    this._options = this._options || this.defOptions;
  }

  ngOnDestroy(): void {
    if (!!this.elemChart) {
      select(this.elemChart.nativeElement).remove();
    }
  }

  update(options, refresh): void {
    this.LOG.debug(['onOptions', 'before'], this._options, options);
    if (!deepEqual(options, this._options)) {
      this.LOG.debug(['options', 'changed'], options);
      this._options = ChartLib.mergeDeep(this._options, options as Param) as Param;
    }
    this.drawChart();
  }

  updateBounds(min, max) {
    this.LOG.debug(['updateBounds'], min, max, this._options);
    this._options.bounds.minDate = min;
    this._options.bounds.maxDate = max;

    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
      this.eventConf['range'] = {start: min, end: max};
    } else {
      this.eventConf['range'] = {
        start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
        end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
      };
    }
    this.eventConf = {...this.eventConf};
    this.LOG.debug(['updateBounds'], this.eventConf);
  }

  drawChart() {
    if (!this.initChart(this.el)) {
      return;
    }
    this.loading = false;
    this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
    if (this.elemChart.nativeElement) {
      setTimeout(() => select(this.elemChart.nativeElement).data([this.plotlyData]).call(eventDrops(this.eventConf)));
      this.loading = false;
      this.chartDraw.emit();
    }
  }

  protected convert(data: DataModel): any[] {
    this.LOG.debug(['convert'], data);
    let labelsSize = 0;
    const gtsList = GTSLib.flatDeep(data.data as any[]);
    const dataList = [];
    this.LOG.debug(['convert', 'gtsList'], gtsList);
    if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
      return;
    }
    gtsList.forEach((gts, i) => {
      const c = ColorLib.getColor(gts.id || i, this._options.scheme);
      const color = ((data.params || [])[i] || {datasetColor: c}).datasetColor || c;
      const gtsName = GTSLib.serializeGtsMetadata(gts);
      labelsSize = Math.max(gtsName.length * 8);
      const dataSet = {name: gtsName, color, data: []};
      const size = (gts.v || []).length;
      for (let v = 0; v < size; v++) {
        const point = (gts.v || [])[v];
        const ts = point[0];
        this.minTick = Math.min(this.minTick, ts);
        this.maxTick = Math.max(this.maxTick, ts);
        let value = point[point.length - 1];
        if (isNaN(value)) {
          value = 1;
        }
        dataSet.data.push({
          date: moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toDate(),
          color,
          value,
          name: dataSet.name
        });
      }
      dataList.push(dataSet);
    });
    this.LOG.debug(['convert', 'dataList'], dataList);
    this.eventConf.label ['width'] = labelsSize;
    this.eventConf  ['range'] = {
      start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
      end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
    };
    return dataList;
  }
}
