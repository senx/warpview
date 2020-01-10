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
"use strict";
import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Logger} from '../../../utils/logger';
import {Datum, Detail, Summary} from '../model/datum';
import {ChartLib} from '../../../utils/chart-lib';
import {easeLinear, max, range, scaleBand, scaleLinear, Selection, sum, timeDays} from 'd3';
import {event, select} from 'd3-selection';
import {ColorLib} from '../../../utils/color-lib';
import {GTSLib} from '../../../utils/gts.lib';
import moment, {Moment} from 'moment';

@Component({
  selector: 'calendar-heatmap',
  templateUrl: './calendar-heatmap.component.html',
  styleUrls: ['./calendar-heatmap.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CalendarHeatmapComponent implements AfterViewInit {

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('data') set data(data: Datum[]) {
    this.LOG.debug(['data'], data);
    if (data) {
      this._data = data;
      this.calculateDimensions();
    }
  }

  get data(): Datum[] {
    return this._data;
  }

  @Input('minColor') set minColor(minColor: string) {
    this._minColor = minColor;
    this.calculateDimensions();
  }

  get minColor() {
    return this._minColor;
  }

  @Input('maxColor') set maxColor(maxColor: string) {
    this._maxColor = maxColor;
    this.calculateDimensions();
  }

  get maxColor() {
    return this._maxColor;
  }

  private static DEF_MIN_COLOR = '#ffffff';
  private static DEF_MAX_COLOR = '#333333';
  constructor(private el: ElementRef) {
    this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
  }


  @ViewChild('chart', { static: true }) div: ElementRef;

  @Input('width') width = ChartLib.DEFAULT_WIDTH;
  @Input('height') height = ChartLib.DEFAULT_HEIGHT;
  @Input('overview') overview = 'global';

  @Output('handler') handler = new EventEmitter<any>();
  @Output('change') change = new EventEmitter<any>();

  private LOG: Logger;
  // tslint:disable-next-line:variable-name
  private _data: Datum[];
  // tslint:disable-next-line:variable-name
  private _debug = false;
  // tslint:disable-next-line:variable-name
  private _minColor: string = CalendarHeatmapComponent.DEF_MIN_COLOR;
  // tslint:disable-next-line:variable-name
  private _maxColor: string = CalendarHeatmapComponent.DEF_MAX_COLOR;
// Defaults
  private gutter = 5;
  private gWidth = 1000;
  private gHeight = 200;
  private itemSize = 10;
  private labelPadding = 40;
  private transitionDuration = 250;
  private inTransition = false;
  // Tooltip defaults
  private tooltipWidth = 450;
  private tooltipPadding = 15;
  // Overview defaults
  private history = ['global'];
  private selected: Datum = new Datum();
  // D3 related variables
  private svg: Selection<SVGElement, {}, null, undefined>;
  private items: Selection<SVGElement, {}, null, undefined>;
  private labels: Selection<SVGElement, {}, null, undefined>;
  private buttons: Selection<SVGElement, {}, null, undefined>;
  private tooltip: Selection<HTMLDivElement, {}, null, undefined>;
  private parentWidth = -1;
  private chart: HTMLElement;
  private resizeTimer;

  static getNumberOfWeeks(): number {
    const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
    return Math.trunc(dayIndex / 7) + 1;
  }

  @HostListener('window:resize')
  onResize() {
    if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
      this.calculateDimensions();
    }
  }

  ngAfterViewInit() {
    this.chart = this.div.nativeElement as HTMLElement;
    // Initialize svg element
    this.svg = select(this.chart).append('svg').attr('class', 'svg');
    // Initialize main svg elements
    this.items = this.svg.append('g');
    this.labels = this.svg.append('g');
    this.buttons = this.svg.append('g');
    // Add tooltip to the same element as main svg
    this.tooltip = select(this.chart)
      .append('div')
      .attr('class', 'heatmap-tooltip')
      .style('opacity', 0);
    // Calculate chart dimensions
    this.calculateDimensions();
    //  this.drawChart();
  }

  calculateDimensions() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      if (this.el.nativeElement.parentElement.clientWidth !== 0) {
        this.gWidth = this.chart.clientWidth < 1000 ? 1000 : this.chart.clientWidth;
        this.itemSize = ((this.gWidth - this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - this.gutter);
        this.gHeight = this.labelPadding + 7 * (this.itemSize + this.gutter);
        this.svg.attr('width', this.gWidth).attr('height', this.gHeight);
        this.LOG.debug(['calculateDimensions'], this._data);
        if (!!this._data && !!this._data[0] && !!this._data[0].summary) {
          this.drawChart();
        }
      } else {
        this.calculateDimensions();
      }
    }, 250);
  }


  private groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  updateDataSummary() {
    // Get daily summary if that was not provided
    if (!this._data[0].summary) {
      this._data.map((d: Datum) => {
        const summary = d.details.reduce((uniques: any, project: any) => {
          if (!uniques[project.name]) {
            uniques[project.name] = {value: project.value};
          } else {
            uniques[project.name].value += project.value;
          }
          return uniques;
        }, {});
        const unsortedSummary = Object.keys(summary).map((key) => {
          return {
            name: key,
            total: summary[key].value
          };
        });
        d.summary = unsortedSummary.sort((a, b) => {
          return b.total - a.total;
        });
        return d;
      });
    }
  }

  drawChart() {
    if (!this.svg || !this._data) {
      return;
    }
    this.LOG.debug(['drawChart'], [this.overview, this.selected]);
    switch (this.overview) {
      case 'global':
        this.drawGlobalOverview();
        this.change.emit({
          overview: this.overview,
          start: moment(this._data[0].date),
          end: moment(this._data[this._data.length - 1].date),
        });
        break;
      case 'year':
        this.drawYearOverview();
        this.change.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('year'),
          end: moment(this.selected.date).endOf('year'),
        });
        break;
      case 'month':
        this.drawMonthOverview();
        this.change.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('month'),
          end: moment(this.selected.date).endOf('month'),
        });
        break;
      case 'week':
        this.drawWeekOverview();
        this.change.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('week'),
          end: moment(this.selected.date).endOf('week'),
        });
        break;
      case 'day':
        this.drawDayOverview();
        this.change.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('day'),
          end: moment(this.selected.date).endOf('day'),
        });
        break;
      default:
        break;
    }
  }

  drawGlobalOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define start and end of the dataset
    const startPeriod: Moment = moment.utc(this._data[0].date.startOf('y'));
    const endPeriod: Moment = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
    // Define array of years and total values
    const yData: Datum[] = this._data.filter((d: Datum) => d.date.isBetween(startPeriod, endPeriod, null, '[]'));
    yData.forEach((d: Datum) => {
      const summary: Summary[] = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach(k => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => {
            return acc + o.value;
          }, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    const duration = Math.ceil(moment.duration(endPeriod.diff(startPeriod)).asYears());
    const scale = [];
    for (let i = 0; i < duration; i++) {
      const d = moment.utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
      scale.push(d);
    }
    let yearData: Datum[] = yData.map((d: Datum) => {
      const date: Moment = d.date;
      return {
        date,
        total: yData.reduce((prev: number, current: any) => {
          if ((current.date as Moment).year() === date.year()) {
            prev += current.total;
          }
          return prev;
        }, 0),
        summary: (() => {
          const summary: Summary = yData.reduce((s: any, data: any) => {
            if ((data.date as Moment).year() === date.year()) {
              data.summary.forEach(_summary => {
                if (!summary[_summary.name]) {
                  summary[_summary.name] = {
                    total: _summary.total,
                    color: _summary.color,
                  };
                } else {
                  summary[_summary.name].total += _summary.total;
                }
              });
            }
            return summary;
          }, {});
          const unsortedSummary: Summary[] = Object.keys(summary).map((key) => {
            return {
              name: key,
              total: summary[key].total,
              color: summary[key].color,
            };
          });
          return unsortedSummary.sort((a, b) => b.total - a.total);
        })(),
      };
    });
    // Calculate max value of all the years in the dataset
    yearData = GTSLib.cleanArray(yearData);
    const maxValue = max(yearData, (d: Datum) => d.total);
    // Define year labels and axis
    const yearLabels = scale.map((d: Moment) => d);
    const yearScale = scaleBand()
      .rangeRound([0, this.gWidth])
      .padding(0.05)
      .domain(yearLabels.map((d: Moment) => d.year().toString()));

    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
      .domain([-0.15 * maxValue, maxValue]);
    // Add global data items to the overview
    this.items.selectAll('.item-block-year').remove();
    this.items.selectAll('.item-block-year')
      .data(yearData)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-year')
      .attr('width', () => (this.gWidth - this.labelPadding) / yearLabels.length - this.gutter * 5)
      .attr('height', () => this.gHeight - this.labelPadding)
      .attr('transform', (d: Datum) => 'translate(' + yearScale((d.date as Moment).year().toString()) + ',' + this.tooltipPadding * 2 + ')')
      .attr('fill', (d: Datum) => color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR)
      .on('click', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Set in_transition flag
        this.inTransition = true;
        // Set selected date to the one clicked on
        this.selected = d;
        // Hide tooltip
        this.hideTooltip();
        // Remove all global overview related items and labels
        this.removeGlobalOverview();
        // Redraw the chart
        this.overview = 'year';
        this.drawChart();
      })
      .style('opacity', 0)
      .on('mouseover', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Calculate tooltip position
        let x = yearScale(d.date.year().toString()) + this.tooltipPadding * 2;
        while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 5)) {
          x -= 10;
        }
        const y = this.tooltipPadding * 4;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transitionDuration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay((d: any, i: number) => this.transitionDuration * (i + 1) / 10)
      .duration(() => this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1)
      .call((transition: any, callback: any) => {
        if (transition.empty()) {
          callback();
        }
        let n = 0;
        transition.each(() => ++n).on('end', function () {
          if (!--n) {
            callback.apply(this, arguments);
          }
        });
      }, () => this.inTransition = false);
    // Add year labels
    this.labels.selectAll('.label-year').remove();
    this.labels.selectAll('.label-year')
      .data(yearLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-year')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Moment) => d.year())
      .attr('x', (d: Moment) => yearScale(d.year().toString()))
      .attr('y', this.labelPadding / 2)
      .on('mouseenter', (yearLabel: Moment) => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (d.date.year() === yearLabel.year()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', () => {
        if (this.inTransition) {
          return;
        }
        // Set in_transition flag
        this.inTransition = true;
        // Set selected year to the one clicked on
        this.selected = yearData[0];
        // Hide tooltip
        this.hideTooltip();
        // Remove all global overview related items and labels
        this.removeGlobalOverview();
        // Redraw the chart
        this.overview = 'year';
        this.drawChart();
      });
  }


  /**
   * Draw year overview
   */
  drawYearOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define start and end date of the selected year
    const startOfYear: Moment = moment(this.selected.date).startOf('year');
    const endOfYear: Moment = moment(this.selected.date).endOf('year');
    // Filter data down to the selected year
    let yearData: Datum[] = this._data.filter((d: Datum) => d.date.isBetween(startOfYear, endOfYear, null, '[]'));
    yearData.forEach((d: Datum) => {
      const summary: Summary[] = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach(k => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => {
            return acc + o.value;
          }, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    yearData = GTSLib.cleanArray(yearData);
    // Calculate max value of the year data
    const maxValue = max(yearData, (d: Datum) => d.total);
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
      .domain([-0.15 * maxValue, maxValue]);
    this.items.selectAll('.item-circle').remove();
    this.items.selectAll('.item-circle')
      .data(yearData)
      .enter()
      .append('rect')
      .attr('class', 'item item-circle').style('opacity', 0)
      .attr('x', (d: Datum) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('y', (d: Datum) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('ry', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('width', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('height', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.inTransition = true;
        // Set selected date to the one clicked on
        this.selected = d;
        // Hide tooltip
        this.hideTooltip();
        // Remove all year overview related items and labels
        this.removeYearOverview();
        // Redraw the chart
        this.overview = 'day';
        this.drawChart();
      })
      .on('mouseover', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Pulsating animation
        const circle = select(event.currentTarget);
        const repeat = () => {
          circle.transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .attr('x', (data: Datum) => this.calcItemX(data, startOfYear) - (this.itemSize * 1.1 - this.itemSize) / 2)
            .attr('y', (data: Datum) => this.calcItemY(data) - (this.itemSize * 1.1 - this.itemSize) / 2)
            .attr('width', this.itemSize * 1.1)
            .attr('height', this.itemSize * 1.1)
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .attr('x', (data: Datum) => this.calcItemX(data, startOfYear) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2)
            .attr('y', (data: Datum) => this.calcItemY(data) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2)
            .attr('width', (data: Datum) => this.calcItemSize(data, maxValue))
            .attr('height', (data: Datum) => this.calcItemSize(data, maxValue))
            .on('end', repeat);
        };
        repeat();
        // Construct tooltip
        // Calculate tooltip position
        let x = this.calcItemX(d, startOfYear) + this.itemSize / 2;
        if (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
          x -= this.tooltipWidth + this.tooltipPadding * 2;
        }
        const y = this.calcItemY(d) + this.itemSize / 2;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transitionDuration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        // Set circle radius back to what it's supposed to be
        select(event.currentTarget).transition()
          .duration(this.transitionDuration / 2)
          .ease(easeLinear)
          .attr('x', (d: Datum) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
          .attr('y', (d: Datum) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
          .attr('width', (d: Datum) => this.calcItemSize(d, maxValue))
          .attr('height', (d: Datum) => this.calcItemSize(d, maxValue));
        // Hide tooltip
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
      .duration(() => this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1)
      .call((transition: any, callback: any) => {
        if (transition.empty()) {
          callback();
        }
        let n = 0;
        transition.each(() => ++n).on('end', function () {
          if (!--n) {
            callback.apply(this, arguments);
          }
        });
      }, () => this.inTransition = false);
    // Add month labels
    const duration = Math.ceil(moment.duration(endOfYear.diff(startOfYear)).asMonths());
    const monthLabels: Moment[] = [];
    for (let i = 1; i < duration; i++) {
      monthLabels.push(moment(this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
    }
    const monthScale = scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
    this.labels.selectAll('.label-month').remove();
    this.labels.selectAll('.label-month')
      .data(monthLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-month')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Moment) => d.format('MMM'))
      .attr('x', (d: Moment, i: number) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2)
      .attr('y', this.labelPadding / 2)
      .on('mouseenter', (d: Moment) => {
        if (this.inTransition) {
          return;
        }
        const selectedMonth = moment(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (data: Datum) => moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', (d: Moment) => {
        if (this.inTransition) {
          return;
        }
        // Check month data
        const monthData = this._data.filter((e: Datum) => e.date.isBetween(
          moment(d).startOf('month'),
          moment(d).endOf('month'),
          null, '[]'
        ));
        // Don't transition if there is no data to show
        if (!monthData.length) {
          return;
        }
        // Set selected month to the one clicked on
        this.selected = {date: d};
        this.inTransition = true;
        // Hide tooltip
        this.hideTooltip();
        // Remove all year overview related items and labels
        this.removeYearOverview();
        // Redraw the chart
        this.overview = 'month';
        this.drawChart();
      });

    // Add day labels
    const dayLabels: Date[] = timeDays(
      moment.utc().startOf('week').toDate(),
      moment.utc().endOf('week').toDate()
    );
    const dayScale = scaleBand()
      .rangeRound([this.labelPadding, this.gHeight])
      .domain(dayLabels.map((d: Date) => moment.utc(d).weekday().toString()));
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(dayLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.labelPadding / 3)
      .attr('y', (d: Date, i: number) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.inTransition) {
          return;
        }
        const selectedDay = moment.utc(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (data: Datum) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  }

  drawMonthOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define beginning and end of the month
    const startOfMonth: Moment = moment(this.selected.date).startOf('month');
    const endOfMonth: Moment = moment(this.selected.date).endOf('month');
    // Filter data down to the selected month
    let monthData: Datum[] = [];
    this._data.filter((data: Datum) => data.date.isBetween(startOfMonth, endOfMonth, null, '[]'))
      .map((d: Datum) => {
        const scale: Datum[] = [];
        d.details.forEach((det: Detail) => {
          const date: Moment = moment.utc(det.date);
          const i = Math.floor(date.hours() / 3);
          if (!scale[i]) {
            scale[i] = {
              date: date.startOf('hour'),
              total: 0,
              details: [],
              summary: []
            };
          }
          scale[i].total += det.value;
          scale[i].details.push(det);
        });
        scale.forEach((s: Datum) => {
          const group = this.groupBy(s.details, 'name');
          Object.keys(group).forEach((k: string) => {
            s.summary.push({
              name: k,
              total: sum(group[k], (data: any) => data.total),
              color: group[k][0].color
            });
          });
        });
        monthData = monthData.concat(scale);
      });
    monthData = GTSLib.cleanArray(monthData);
    this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
    const maxValue: number = max(monthData, (d: any) => d.total);
    // Define day labels and axis
    const dayLabels: Date[] = timeDays(
      moment(this.selected.date).startOf('week').toDate(),
      moment(this.selected.date).endOf('week').toDate()
    );
    const dayScale = scaleBand()
      .rangeRound([this.labelPadding, this.gHeight])
      .domain(dayLabels.map((d: Date) => moment.utc(d).weekday().toString()));

    // Define week labels and axis
    const weekLabels: Moment[] = [startOfMonth];
    const incWeek = moment(startOfMonth);
    while (incWeek.week() !== endOfMonth.week()) {
      weekLabels.push(moment(incWeek.add(1, 'week')));
    }
    monthData.forEach((d: Datum) => {
      const summary = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach((k: string) => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => acc + o.value, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    const weekScale = scaleBand()
      .rangeRound([this.labelPadding, this.gWidth])
      .padding(0.05)
      .domain(weekLabels.map((weekday) => weekday.week() + ''));
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
      .domain([-0.15 * maxValue, maxValue]);
    // Add month data items to the overview
    this.items.selectAll('.item-block-month').remove();
    this.items.selectAll('.item-block-month')
      .data(monthData)
      .enter().append('rect')
      .style('opacity', 0)
      .attr('class', 'item item-block-month')
      .attr('y', (d: Datum) => this.calcItemY(d)
        + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('x', (d: Datum) => this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
        + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('ry', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('width', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('height', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.inTransition = true;
        // Set selected date to the one clicked on
        this.selected = d;
        // Hide tooltip
        this.hideTooltip();
        // Remove all month overview related items and labels
        this.removeMonthOverview();
        // Redraw the chart
        this.overview = 'day';
        this.drawChart();
      })
      .on('mouseover', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Construct tooltip
        // Calculate tooltip position
        let x = weekScale(d.date.week().toString()) + this.tooltipPadding;
        while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
          x -= 10;
        }
        const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transitionDuration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
      .duration(() => this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1)
      .call((transition: any, callback: any) => {
        if (transition.empty()) {
          callback();
        }
        let n = 0;
        transition.each(() => ++n).on('end', function () {
          if (!--n) {
            callback.apply(this, arguments);
          }
        });
      }, () => this.inTransition = false);
    // Add week labels
    this.labels.selectAll('.label-week').remove();
    this.labels.selectAll('.label-week')
      .data(weekLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Moment) => 'Week ' + d.week())
      .attr('x', (d: Moment) => weekScale(d.week().toString()))
      .attr('y', this.labelPadding / 2)
      .on('mouseenter', (weekday: Moment) => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => {
            return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
          });
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', (d: Moment) => {
        if (this.inTransition) {
          return;
        }
        this.inTransition = true;
        // Set selected month to the one clicked on
        this.selected = {date: d};
        // Hide tooltip
        this.hideTooltip();
        // Remove all year overview related items and labels
        this.removeMonthOverview();
        // Redraw the chart
        this.overview = 'week';
        this.drawChart();
      });
    // Add day labels
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(dayLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.labelPadding / 3)
      .attr('y', (d: Date, i: any) => dayScale(i) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.inTransition) {
          return;
        }
        const selectedDay = moment.utc(d);
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (data: Datum) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  }

  drawWeekOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define beginning and end of the week
    const startOfWeek: Moment = moment(this.selected.date).startOf('week');
    const endOfWeek: Moment = moment(this.selected.date).endOf('week');
    // Filter data down to the selected week
    let weekData: Datum[] = [];
    this._data.filter((d: Datum) => {
      return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
    }).map((d: Datum) => {
      const scale: Datum[] = [];
      d.details.forEach((det: Detail) => {
        const date: Moment = moment(det.date);
        const i = date.hours();
        if (!scale[i]) {
          scale[i] = {
            date: date.startOf('hour'),
            total: 0,
            details: [],
            summary: []
          };
        }
        scale[i].total += det.value;
        scale[i].details.push(det);
      });
      scale.forEach(s => {
        const group = this.groupBy(s.details, 'name');
        Object.keys(group).forEach(k =>
          s.summary.push({
            name: k,
            total: sum(group[k], (data: any) => data.value),
            color: group[k][0].color
          }));
      });
      weekData = weekData.concat(scale);
    });
    weekData = GTSLib.cleanArray(weekData);
    const maxValue: number = max(weekData, (d: Datum) => d.total);
    // Define day labels and axis
    const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
    const dayScale = scaleBand()
      .rangeRound([this.labelPadding, this.gHeight])
      .domain(dayLabels.map((d: Date) => moment.utc(d).weekday().toString()));
    // Define hours labels and axis
    const hoursLabels: string[] = [];
    range(0, 24).forEach(h => hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
    const hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
      .domain([-0.15 * maxValue, maxValue]);
    // Add week data items to the overview
    this.items.selectAll('.item-block-week').remove();
    this.items.selectAll('.item-block-week')
      .data(weekData)
      .enter()
      .append('rect')
      .style('opacity', 0)
      .attr('class', 'item item-block-week')
      .attr('y', (d: Datum) => this.calcItemY(d)
        + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('x', (d: Datum) => this.gutter
        + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
        + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('ry', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('width', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('height', (d: Datum) => this.calcItemSize(d, maxValue))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.inTransition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.inTransition = true;
        // Set selected date to the one clicked on
        this.selected = d;
        // Hide tooltip
        this.hideTooltip();
        // Remove all week overview related items and labels
        this.removeWeekOverview();
        // Redraw the chart
        this.overview = 'day';
        this.drawChart();
      }).on('mouseover', (d: Datum) => {
      if (this.inTransition) {
        return;
      }
      // Calculate tooltip position
      let x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
      while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
        x -= 10;
      }
      const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
      // Show tooltip
      this.tooltip.html(this.getTooltip(d))
        .style('left', x + 'px')
        .style('top', y + 'px')
        .transition()
        .duration(this.transitionDuration / 2)
        .ease(easeLinear)
        .style('opacity', 1);
    })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
      .duration(() => this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1)
      .call((transition: any, callback: any) => {
        if (transition.empty()) {
          callback();
        }
        let n = 0;
        transition.each(() => ++n).on('end', function () {
          if (!--n) {
            callback.apply(this, arguments);
          }
        });
      }, () => this.inTransition = false);

    // Add week labels
    this.labels.selectAll('.label-week').remove();
    this.labels.selectAll('.label-week')
      .data(hoursLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: string) => d)
      .attr('x', (d: string) => hourScale(d))
      .attr('y', this.labelPadding / 2)
      .on('mouseenter', (hour: string) => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add day labels
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(dayLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.labelPadding / 3)
      .attr('y', (d: Date, i: number) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.inTransition) {
          return;
        }
        const selectedDay = moment.utc(d);
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (data: Datum) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });

    // Add button to switch back to previous overview
    this.drawButton();
  }

  drawDayOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Initialize selected date to today if it was not set
    if (!Object.keys(this.selected).length) {
      this.selected = this._data[this._data.length - 1];
    }
    const startOfDay: Moment = moment(this.selected.date).startOf('day');
    const endOfDay: Moment = moment(this.selected.date).endOf('day');
    // Filter data down to the selected month
    let dayData: Datum[] = [];
    this._data.filter((d: Datum) => {
      return d.date.isBetween(startOfDay, endOfDay, null, '[]');
    }).map((d: Datum) => {
      const scale = [];
      d.details.forEach((det: Detail) => {
        const date: Moment = moment(det.date);
        const i = date.hours();
        if (!scale[i]) {
          scale[i] = {
            date: date.startOf('hour'),
            total: 0,
            details: [],
            summary: []
          };
        }
        scale[i].total += det.value;
        scale[i].details.push(det);
      });
      scale.forEach(s => {
        const group = this.groupBy(s.details, 'name');
        Object.keys(group).forEach(k => {
          s.summary.push({
            name: k,
            total: sum(group[k], (item: any) => item.value),
            color: group[k][0].color
          });
        });
      });
      dayData = dayData.concat(scale);
    });
    const data: Summary[] = [];
    dayData.forEach((d: Datum) => {
      const date = d.date;
      d.summary.forEach((s: Summary) => {
        s.date = date;
        data.push(s);
      });
    });
    dayData = GTSLib.cleanArray(dayData);
    const maxValue: number = max(data, (d: Summary) => d.total);
    const gtsNames = this.selected.summary.map((summary: Summary) => summary.name);
    const gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
    const hourLabels: string[] = [];
    range(0, 24).forEach(h => hourLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
    const dayScale = scaleBand()
      .rangeRound([this.labelPadding, this.gWidth])
      .padding(0.01)
      .domain(hourLabels);
    this.items.selectAll('.item-block').remove();
    this.items.selectAll('.item-block')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block')
      .attr('x', (d: Summary) => this.gutter
        + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
        + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
      .attr('y', (d: Summary) => {
        return (gtsNameScale(d.name) || 1) - (this.itemSize - this.calcItemSize(d, maxValue)) / 2;
      })
      .attr('rx', (d: Summary) => this.calcItemSize(d, maxValue))
      .attr('ry', (d: Summary) => this.calcItemSize(d, maxValue))
      .attr('width', (d: Summary) => this.calcItemSize(d, maxValue))
      .attr('height', (d: Summary) => this.calcItemSize(d, maxValue))
      .attr('fill', (d: Summary) => {
        const color = scaleLinear<string>()
          .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
          .domain([-0.5 * maxValue, maxValue]);
        return color(d.total);
      })
      .style('opacity', 0)
      .on('mouseover', (d: Summary) => {
        if (this.inTransition) {
          return;
        }
        // Calculate tooltip position
        let x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
        while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
          x -= 10;
        }
        const y = gtsNameScale(d.name) + this.tooltipPadding;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transitionDuration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.hideTooltip();
      })
      .on('click', (d: Summary) => {
        if (this.handler) {
          this.handler.emit(d);
        }
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
      .duration(() => this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1)
      .call((transition: any, callback: any) => {
        if (transition.empty()) {
          callback();
        }
        let n = 0;
        transition.each(() => ++n).on('end', function () {
          if (!--n) {
            callback.apply(this, arguments);
          }
        });
      }, () => this.inTransition = false);

    // Add time labels
    this.labels.selectAll('.label-time').remove();
    this.labels.selectAll('.label-time')
      .data(hourLabels)
      .enter()
      .append('text')
      .attr('class', 'label label-time')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: string) => d)
      .attr('x', (d: string) => dayScale(d))
      .attr('y', this.labelPadding / 2)
      .on('mouseenter', (d: string) => {
        if (this.inTransition) {
          return;
        }
        const selected = d;
        // const selected = itemScale(moment.utc(d));
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (item: any) => (item.date.format('HH:mm') === selected) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add project labels
    const labelPadding = this.labelPadding;
    this.labels.selectAll('.label-project').remove();
    this.labels.selectAll('.label-project')
      .data(gtsNames)
      .enter()
      .append('text')
      .attr('class', 'label label-project')
      .attr('x', this.gutter)
      .attr('y', (d: string) => gtsNameScale(d) + this.itemSize / 2)
      .attr('min-height', () => gtsNameScale.bandwidth())
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
      .text((d: string) => d)
      .each(function () {
        const obj = select(this);
        let textLength = obj.node().getComputedTextLength();
        let text = obj.text();
        while (textLength > (labelPadding * 1.5) && text.length > 0) {
          text = text.slice(0, -1);
          obj.text(text + '...');
          textLength = obj.node().getComputedTextLength();
        }
      })
      .on('mouseenter', (gtsName: string) => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', (d: Summary) => (d.name === gtsName) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.inTransition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transitionDuration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  }

  private calcItemX(d: Datum, startOfYear: Moment) {
    const dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
    const colIndex = Math.trunc(dayIndex / 7);
    return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
  }

  private calcItemXMonth(d: Datum, start: Moment, offset: number) {
    const hourIndex = moment(d.date).hours();
    const colIndex = Math.trunc(hourIndex / 3);
    return colIndex * (this.itemSize + this.gutter) + offset;
  }

  private calcItemY(d: Datum) {
    return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
  }

  private calcItemSize(d: Datum | Summary, m: number) {
    if (m <= 0) {
      return this.itemSize;
    }
    return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
  }

  private drawButton() {
    this.buttons.selectAll('.button').remove();
    const button = this.buttons.append('g')
      .attr('class', 'button button-back')
      .style('opacity', 0)
      .on('click', () => {
        if (this.inTransition) {
          return;
        }
        // Set transition boolean
        this.inTransition = true;
        // Clean the canvas from whichever overview type was on
        if (this.overview === 'year') {
          this.removeYearOverview();
        } else if (this.overview === 'month') {
          this.removeMonthOverview();
        } else if (this.overview === 'week') {
          this.removeWeekOverview();
        } else if (this.overview === 'day') {
          this.removeDayOverview();
        }
        // Redraw the chart
        this.history.pop();
        this.overview = this.history.pop();
        this.drawChart();
      });
    button.append('circle')
      .attr('cx', this.labelPadding / 2.25)
      .attr('cy', this.labelPadding / 2.5)
      .attr('r', this.itemSize / 2);
    button.append('text')
      .attr('x', this.labelPadding / 2.25)
      .attr('y', this.labelPadding / 2.5)
      .attr('dy', () => {
        return Math.floor(this.gWidth / 100) / 3;
      })
      .attr('font-size', () => {
        return Math.floor(this.labelPadding / 3) + 'px';
      })
      .html('&#x2190;');
    button.transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 1);
  }

  private removeGlobalOverview() {
    this.items.selectAll('.item-block-year')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-year').remove();
  }

  private removeYearOverview() {
    this.items.selectAll('.item-circle')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-month').remove();
    this.hideBackButton();
  }

  private removeMonthOverview() {
    this.items.selectAll('.item-block-month')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  }

  private removeWeekOverview() {
    this.items.selectAll('.item-block-week')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  }

  private removeDayOverview() {
    this.items.selectAll('.item-block')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3)
      .remove();
    this.labels.selectAll('.label-time').remove();
    this.labels.selectAll('.label-project').remove();
    this.hideBackButton();
  }

  private hideTooltip() {
    this.tooltip.transition()
      .duration(this.transitionDuration / 2)
      .ease(easeLinear)
      .style('opacity', 0);
  }

  /**
   * Helper function to hide the back button
   */
  private hideBackButton() {
    this.buttons.selectAll('.button')
      .transition()
      .duration(this.transitionDuration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
  }

  private getTooltip = (d: any) => {
    let tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
    (d.summary || []).forEach(s => {
      tooltipHtml += `<li>
  <div class="round" style="background-color:${ColorLib.transparentize(s.color)}; border-color:${s.color}"></div>
${GTSLib.formatLabel(s.name)}: ${s.total}</li>`;
    });
    if (d.total !== undefined && d.name) {
      tooltipHtml += `<li><div class="round"
style="background-color: ${ColorLib.transparentize(d.color)}; border-color: ${d.color}"
></div> ${GTSLib.formatLabel(d.name)}: ${d.total}</li>`;
    }
    tooltipHtml += '</ul>';
    return tooltipHtml;
  }
}
