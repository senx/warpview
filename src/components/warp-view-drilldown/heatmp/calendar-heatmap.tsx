/*
 *  Copyright 2018  SenX S.A.S.
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

import {Component, Element, Event, EventEmitter, Listen, Prop, Watch} from "@stencil/core";
import {DataModel} from "../../../model/dataModel";
import {Logger} from "../../../utils/logger";
import {ChartLib} from "../../../utils/chart-lib";
import moment, {Moment} from 'moment';
import {easeLinear, max, range, scaleBand, scaleLinear, Selection, sum, timeDays} from "d3";
import {event, select} from 'd3-selection';
import {ColorLib} from "../../../utils/color-lib";
import {Datum, Detail, Summary} from "../model/datum";
import {GTSLib} from "../../../utils/gts.lib";

@Component({
  tag: 'calendar-heatmap',
  styleUrl: 'calendar-heatmap.scss',
  shadow: true
})
export class CalendarHeatmap {
  private static DEF_MIN_COLOR: string = '#ffffff';
  private static DEF_MAX_COLOR: string = '#333333';
  @Element() el: HTMLElement;

  @Prop() data: Datum[];
  @Prop() minColor: string = CalendarHeatmap.DEF_MIN_COLOR;
  @Prop() maxColor: string = CalendarHeatmap.DEF_MAX_COLOR;
  @Prop({mutable: true}) overview: string = 'global';
  @Prop() debug = false;

  @Event() handler: EventEmitter;
  @Event() onChange: EventEmitter;

  private LOG: Logger;
  // Defaults
  private gutter: number = 5;
  private width: number = 1000;
  private height: number = 200;
  private item_size: number = 10;
  private label_padding: number = 40;
  private transition_duration: number = 250;
  private in_transition: boolean = false;
  // Tooltip defaults
  private tooltip_width: number = 450;
  private tooltip_padding: number = 15;
  // Overview defaults
  private history = ['global'];
  private selected: Datum = new Datum();
  // D3 related variables
  private svg: Selection<SVGElement, {}, null, undefined>;
  private items: Selection<SVGElement, {}, null, undefined>;
  private labels: Selection<SVGElement, {}, null, undefined>;
  private buttons: Selection<SVGElement, {}, null, undefined>;
  private tooltip: Selection<HTMLDivElement, {}, null, undefined>;
  private uuid = 'spectrum-' + ChartLib.guid().split('-').join('');
  private parentWidth = -1;
  private chart: HTMLElement;
  private resizeTimer;

  @Watch('data')
  private onData(newValue: DataModel | any[], oldValue: DataModel | any[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('minColor')
  private onMinColor(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('maxColor')
  private onMaxColor(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  /**
   * Recalculate dimensions on window resize events
   */
  @Listen('window:resize')
  onResize() {
    if (this.el.parentElement.clientWidth !== this.parentWidth) {
      this.calculateDimensions();
    }
  };


  /**
   * Utility function to get number of complete weeks in a year
   *
   * @returns {number}
   */
  static getNumberOfWeeks(): number {
    const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
    return Math.trunc(dayIndex / 7) + 1;
  }

  /**
   * Utility function to calculate chart dimensions
   */
  calculateDimensions() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      if (this.el.parentElement.clientWidth != 0) {
        this.width = this.chart.clientWidth < 1000 ? 1000 : this.chart.clientWidth;
        this.item_size = ((this.width - this.label_padding) / CalendarHeatmap.getNumberOfWeeks() - this.gutter);
        this.height = this.label_padding + 7 * (this.item_size + this.gutter);
        this.svg.attr('width', this.width).attr('height', this.height);
        if (!!this.data && !!this.data[0].summary) {
          this.drawChart();
        }
      } else {
        this.calculateDimensions();
      }
    }, 250);
  }


  private groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  /**
   * Helper function to check for data summary
   *
   * @returns {any}
   */
  updateDataSummary() {
    // Get daily summary if that was not provided
    if (!this.data[0].summary) {
      this.data.map((d: Datum) => {
        const summary = d['details'].reduce((uniques: any, project: any) => {
          if (!uniques[project.name]) {
            uniques[project.name] = {value: project.value};
          } else {
            uniques[project.name].value += project.value;
          }
          return uniques;
        }, {});
        const unsorted_summary = Object.keys(summary).map((key) => {
          return {
            name: key,
            total: summary[key].value
          };
        });
        d.summary = unsorted_summary.sort((a, b) => {
          return b.total - a.total;
        });
        return d;
      });
    }
  }

  /**
   * Draw the chart based on the current overview type
   */
  drawChart() {
    if (!this.svg || !this.data) {
      return;
    }
    this.LOG.debug(['drawChart'], [this.overview, this.selected]);
    switch (this.overview) {
      case 'global':
        this.drawGlobalOverview();
        this.onChange.emit({
          overview: this.overview,
          start: moment(this.data[0].date),
          end: moment(this.data[this.data.length - 1].date),
        });
        break;
      case 'year':
        this.drawYearOverview();
        this.onChange.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('year'),
          end: moment(this.selected.date).endOf('year'),
        });
        break;
      case 'month':
        this.drawMonthOverview();
        this.onChange.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('month'),
          end: moment(this.selected.date).endOf('month'),
        });
        break;
      case 'week':
        this.drawWeekOverview();
        this.onChange.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('week'),
          end: moment(this.selected.date).endOf('week'),
        });
        break;
      case 'day':
        this.drawDayOverview();
        this.onChange.emit({
          overview: this.overview,
          start: moment(this.selected.date).startOf('day'),
          end: moment(this.selected.date).endOf('day'),
        });
        break;
      default:
        break;
    }
  }

  /**
   * Draw global overview (multiple years)
   */
  drawGlobalOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define start and end of the dataset
    const start_period: Moment = moment.utc(this.data[0].date.startOf('y'));
    const end_period: Moment = moment.utc(this.data[this.data.length - 1].date.endOf('y'));
    // Define array of years and total values
    const yData: Datum[] = this.data.filter((d: Datum) => d.date.isBetween(start_period, end_period, null, '[]'));
    yData.forEach((d: Datum) => {
      const summary: Summary[] = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach(k => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => {
            return acc + o.value
          }, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    const duration = Math.ceil(moment.duration(end_period.diff(start_period)).asYears());
    const scale = [];
    for (let i = 0; i < duration; i++) {
      const d = moment.utc().year(start_period.year() + i).month(0).date(1).startOf('y');
      scale.push(d);
    }
    let year_data: Datum[] = yData.map((d: Datum) => {
      const date: Moment = d.date;
      return {
        date: date,
        total: yData.reduce((prev: number, current: any) => {
          if ((current.date as Moment).year() === date.year()) {
            prev += current.total;
          }
          return prev;
        }, 0),
        summary: (() => {
          const summary: Summary = yData.reduce((summary: any, d: any) => {
            if ((d.date as Moment).year() === date.year()) {
              for (let i = 0; i < d.summary.length; i++) {
                if (!summary[d.summary[i].name]) {
                  summary[d.summary[i].name] = {
                    total: d.summary[i].total,
                    color: d.summary[i].color,
                  };
                } else {
                  summary[d.summary[i].name].total += d.summary[i].total;
                }
              }
            }
            return summary;
          }, {});
          const unsorted_summary: Summary[] = Object.keys(summary).map((key) => {
            return {
              name: key,
              total: summary[key].total,
              color: summary[key].color,
            };
          });
          return unsorted_summary.sort((a, b) => {
            return b.total - a.total;
          });
        })(),
      };
    });
    // Calculate max value of all the years in the dataset
    year_data = GTSLib.cleanArray(year_data);
    const max_value = max(year_data, (d: Datum) => d.total);
    // Define year labels and axis
    const year_labels = scale.map((d: Moment) => d);
    const yearScale = scaleBand()
      .rangeRound([0, this.width])
      .padding(0.05)
      .domain(year_labels.map((d: Moment) => d.year().toString()));

    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
      .domain([-0.15 * max_value, max_value]);
    // Add global data items to the overview
    this.items.selectAll('.item-block-year').remove();
    this.items.selectAll('.item-block-year')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block-year')
      .attr('width', () => (this.width - this.label_padding) / year_labels.length - this.gutter * 5)
      .attr('height', () => this.height - this.label_padding)
      .attr('transform', (d: Datum) => 'translate(' + yearScale((d.date as Moment).year().toString()) + ',' + this.tooltip_padding * 2 + ')')
      .attr('fill', (d: Datum) => color(d.total) || CalendarHeatmap.DEF_MAX_COLOR)
      .on('click', (d: Datum) => {
        if (this.in_transition) {
          return;
        }
        // Set in_transition flag
        this.in_transition = true;
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
        if (this.in_transition) {
          return;
        }
        // Calculate tooltip position
        let x = yearScale(d.date.year().toString()) + this.tooltip_padding * 2;
        while (this.width - x < (this.tooltip_width + this.tooltip_padding * 5)) {
          x -= 10;
        }
        const y = this.tooltip_padding * 4;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transition_duration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay((d: any, i: number) => this.transition_duration * (i + 1) / 10)
      .duration(() => this.transition_duration)
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
      }, () => this.in_transition = false);
    // Add year labels
    this.labels.selectAll('.label-year').remove();
    this.labels.selectAll('.label-year')
      .data(year_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-year')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Moment) => d.year())
      .attr('x', (d: Moment) => yearScale(d.year().toString()))
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (year_label: Moment) => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (d.date.year() === year_label.year()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-year')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', () => {
        if (this.in_transition) {
          return;
        }
        // Set in_transition flag
        this.in_transition = true;
        // Set selected year to the one clicked on
        this.selected = year_data[0];
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
    const start_of_year: Moment = moment(this.selected.date).startOf('year');
    const end_of_year: Moment = moment(this.selected.date).endOf('year');
    // Filter data down to the selected year
    let year_data: Datum[] = this.data.filter((d: Datum) => {
      return d.date.isBetween(start_of_year, end_of_year, null, '[]');
    });
    year_data.forEach((d: Datum) => {
      const summary: Summary[] = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach(k => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => {
            return acc + o.value
          }, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    year_data = GTSLib.cleanArray(year_data);
    // Calculate max value of the year data
    const max_value = max(year_data, (d: Datum) => d.total);
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
      .domain([-0.15 * max_value, max_value]);
    this.items.selectAll('.item-circle').remove();
    this.items.selectAll('.item-circle')
      .data(year_data)
      .enter()
      .append('rect')
      .attr('class', 'item item-circle').style('opacity', 0)
      .attr('x', (d: Datum) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('y', (d: Datum) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('ry', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('width', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('height', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.in_transition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.in_transition = true;
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
        if (this.in_transition) {
          return;
        }
        // Pulsating animation
        const circle = select(event.currentTarget);
        const repeat = () => {
          circle.transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .attr('x', (d: Datum) => this.calcItemX(d, start_of_year) - (this.item_size * 1.1 - this.item_size) / 2)
            .attr('y', (d: Datum) => this.calcItemY(d) - (this.item_size * 1.1 - this.item_size) / 2)
            .attr('width', this.item_size * 1.1)
            .attr('height', this.item_size * 1.1)
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .attr('x', (d: Datum) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('y', (d: Datum) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('width', (d: Datum) => this.calcItemSize(d, max_value))
            .attr('height', (d: Datum) => this.calcItemSize(d, max_value))
            .on('end', repeat);
        };
        repeat();
        // Construct tooltip
        // Calculate tooltip position
        let x = this.calcItemX(d, start_of_year) + this.item_size / 2;
        if (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
          x -= this.tooltip_width + this.tooltip_padding * 2;
        }
        const y = this.calcItemY(d) + this.item_size / 2;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transition_duration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        // Set circle radius back to what it's supposed to be
        select(event.currentTarget).transition()
          .duration(this.transition_duration / 2)
          .ease(easeLinear)
          .attr('x', (d: Datum) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
          .attr('y', (d: Datum) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
          .attr('width', (d: Datum) => this.calcItemSize(d, max_value))
          .attr('height', (d: Datum) => this.calcItemSize(d, max_value));
        // Hide tooltip
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
      .duration(() => this.transition_duration)
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
      }, () => this.in_transition = false);
    // Add month labels
    const duration = Math.ceil(moment.duration(end_of_year.diff(start_of_year)).asMonths());
    const month_labels: Moment[] = [];
    for (let i = 1; i < duration; i++) {
      month_labels.push(moment(this.selected.date).month((start_of_year.month() + i) % 12).startOf('month'));
    }
    const monthScale = scaleLinear().range([0, this.width]).domain([0, month_labels.length]);
    this.labels.selectAll('.label-month').remove();
    this.labels.selectAll('.label-month')
      .data(month_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-month')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Moment) => d.format('MMM'))
      .attr('x', (d: Moment, i: number) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2)
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (d: Moment) => {
        if (this.in_transition) {
          return;
        }
        const selected_month = moment(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', (d: Moment) => {
        if (this.in_transition) {
          return;
        }
        // Check month data
        const month_data = this.data.filter((e: Datum) => e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]'));
        // Don't transition if there is no data to show
        if (!month_data.length) {
          return;
        }
        // Set selected month to the one clicked on
        this.selected = {date: d};
        this.in_transition = true;
        // Hide tooltip
        this.hideTooltip();
        // Remove all year overview related items and labels
        this.removeYearOverview();
        // Redraw the chart
        this.overview = 'month';
        this.drawChart();
      });

    // Add day labels
    const day_labels: Date[] = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
    const dayScale = scaleBand()
      .rangeRound([this.label_padding, this.height])
      .domain(day_labels.map((d: Date) => moment.utc(d).weekday().toString()));
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.label_padding / 3)
      .attr('y', (d: Date, i: number) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.in_transition) {
          return;
        }
        const selected_day = moment.utc(d);
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-circle')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  };

  /**
   * Draw month overview
   */
  drawMonthOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define beginning and end of the month
    const start_of_month: Moment = moment(this.selected.date).startOf('month');
    const end_of_month: Moment = moment(this.selected.date).endOf('month');
    // Filter data down to the selected month
    let month_data: Datum[] = [];
    this.data.filter((d: Datum) => d.date.isBetween(start_of_month, end_of_month, null, '[]'))
      .map((d: Datum) => {
        let scale: Datum[] = [];
        d.details.forEach((det: Detail) => {
          const date: Moment = moment.utc(det.date);
          const i = Math.floor(date.hours() / 3);
          if (!scale[i]) {
            scale[i] = {
              date: date.startOf('hour'),
              total: 0,
              details: [],
              summary: []
            }
          }
          scale[i].total += det.value;
          scale[i].details.push(det);
        });
        scale.forEach((s: Datum) => {
          const group = this.groupBy(s.details, 'name');
          Object.keys(group).forEach((k: string) => {
            s.summary.push({
              name: k,
              total: sum(group[k], (d: any) => {
                return d.total;
              }),
              color: group[k][0].color
            });
          });
        });
        month_data = month_data.concat(scale)
      });
    month_data = GTSLib.cleanArray(month_data);
    this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, month_data]);
    const max_value: number = max(month_data, (d: any) => d.total);
    // Define day labels and axis
    const day_labels: Date[] = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
    const dayScale = scaleBand()
      .rangeRound([this.label_padding, this.height])
      .domain(day_labels.map((d: Date) => moment.utc(d).weekday().toString()));

    // Define week labels and axis
    const week_labels: Moment[] = [start_of_month];
    const incWeek = moment(start_of_month);
    while (incWeek.week() !== end_of_month.week()) {
      week_labels.push(moment(incWeek.add(1, 'week')));
    }
    month_data.forEach((d: Datum) => {
      const summary = [];
      const group = this.groupBy(d.details, 'name');
      Object.keys(group).forEach((k: string) => {
        summary.push({
          name: k,
          total: group[k].reduce((acc, o) => {
            return acc + o.value
          }, 0),
          color: group[k][0].color,
          id: group[k][0].id,
        });
      });
      d.summary = summary;
    });
    const weekScale = scaleBand()
      .rangeRound([this.label_padding, this.width])
      .padding(0.05)
      .domain(week_labels.map((weekday) => weekday.week() + ''));
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
      .domain([-0.15 * max_value, max_value]);
    // Add month data items to the overview
    this.items.selectAll('.item-block-month').remove();
    this.items.selectAll('.item-block-month')
      .data(month_data)
      .enter().append('rect')
      .style('opacity', 0)
      .attr('class', 'item item-block-month')
      .attr('y', (d: Datum) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('x', (d: Datum) => this.calcItemXMonth(d, start_of_month, weekScale(d.date.week().toString())) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('ry', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('width', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('height', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.in_transition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.in_transition = true;
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
        if (this.in_transition) {
          return;
        }
        // Construct tooltip
        // Calculate tooltip position
        let x = weekScale(d.date.week().toString()) + this.tooltip_padding;
        while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
          x -= 10;
        }
        const y = dayScale(d.date.weekday().toString()) + this.tooltip_padding;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transition_duration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
      .duration(() => this.transition_duration)
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
      }, () => this.in_transition = false);
    // Add week labels
    this.labels.selectAll('.label-week').remove();
    this.labels.selectAll('.label-week')
      .data(week_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Moment) => 'Week ' + d.week())
      .attr('x', (d: Moment) => weekScale(d.week().toString()))
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (weekday: Moment) => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => {
            return (moment(d.date).week() === weekday.week()) ? 1 : 0.1
          });
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('click', (d: Moment) => {
        if (this.in_transition) {
          return;
        }
        this.in_transition = true;
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
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.label_padding / 3)
      .attr('y', (d: Date, i: any) => dayScale(i) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.in_transition) {
          return;
        }
        const selected_day = moment.utc(d);
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-month')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  };


  /**
   * Draw week overview
   */
  drawWeekOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Define beginning and end of the week
    const start_of_week: Moment = moment(this.selected.date).startOf('week');
    const end_of_week: Moment = moment(this.selected.date).endOf('week');
    // Filter data down to the selected week
    let week_data: Datum[] = [];
    this.data.filter((d: Datum) => {
      return d.date.isBetween(start_of_week, end_of_week, null, '[]');
    }).map((d: Datum) => {
      let scale: Datum[] = [];
      d.details.forEach((det: Detail) => {
        const date: Moment = moment(det.date);
        const i = date.hours();
        if (!scale[i]) {
          scale[i] = {
            date: date.startOf('hour'),
            total: 0,
            details: [],
            summary: []
          }
        }
        scale[i].total += det.value;
        scale[i].details.push(det);
      });
      scale.forEach(s => {
        const group = this.groupBy(s.details, 'name');
        Object.keys(group).forEach(k => {
          s.summary.push({
            name: k,
            total: sum(group[k], (d: any) => {
              return d.value;
            }),
            color: group[k][0].color
          });
        });
      });
      week_data = week_data.concat(scale)
    });
    week_data = GTSLib.cleanArray(week_data);
    const max_value: number = max(week_data, (d: Datum) => d.total);
    // Define day labels and axis
    const day_labels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
    const dayScale = scaleBand()
      .rangeRound([this.label_padding, this.height])
      .domain(day_labels.map((d: Date) => moment.utc(d).weekday().toString()));
    // Define hours labels and axis
    let hours_labels: string[] = [];
    range(0, 24).forEach(h => hours_labels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
    const hourScale = scaleBand().rangeRound([this.label_padding, this.width]).padding(0.01).domain(hours_labels);
    const color = scaleLinear<string>()
      .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
      .domain([-0.15 * max_value, max_value]);
    // Add week data items to the overview
    this.items.selectAll('.item-block-week').remove();
    this.items.selectAll('.item-block-week')
      .data(week_data)
      .enter()
      .append('rect')
      .style('opacity', 0)
      .attr('class', 'item item-block-week')
      .attr('y', (d: Datum) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('x', (d: Datum) => this.gutter + hourScale(moment(d.date).startOf('hour').format('HH:mm')) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('rx', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('ry', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('width', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('height', (d: Datum) => this.calcItemSize(d, max_value))
      .attr('fill', (d: Datum) => (d.total > 0) ? color(d.total) : 'transparent')
      .on('click', (d: Datum) => {
        if (this.in_transition) {
          return;
        }
        // Don't transition if there is no data to show
        if (d.total === 0) {
          return;
        }
        this.in_transition = true;
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
      if (this.in_transition) {
        return;
      }
      // Calculate tooltip position
      let x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltip_padding;
      while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
        x -= 10;
      }
      const y = dayScale(d.date.weekday().toString()) + this.tooltip_padding;
      // Show tooltip
      this.tooltip.html(this.getTooltip(d))
        .style('left', x + 'px')
        .style('top', y + 'px')
        .transition()
        .duration(this.transition_duration / 2)
        .ease(easeLinear)
        .style('opacity', 1);
    })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.hideTooltip();
      })
      .transition()
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
      .duration(() => this.transition_duration)
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
      }, () => this.in_transition = false);

    // Add week labels
    this.labels.selectAll('.label-week').remove();
    this.labels.selectAll('.label-week')
      .data(hours_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-week')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: string) => d)
      .attr('x', (d: string) => hourScale(d))
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (hour: string) => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add day labels
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-day')
      .data(day_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-day')
      .attr('x', this.label_padding / 3)
      .attr('y', (d: Date, i: number) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: Date) => moment.utc(d).format('dddd')[0])
      .on('mouseenter', (d: Date) => {
        if (this.in_transition) {
          return;
        }
        const selected_day = moment.utc(d);
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Datum) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block-week')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });

    // Add button to switch back to previous overview
    this.drawButton();
  };


  /**
   * Draw day overview
   */
  drawDayOverview() {
    // Add current overview to the history
    if (this.history[this.history.length - 1] !== this.overview) {
      this.history.push(this.overview);
    }
    // Initialize selected date to today if it was not set
    if (!Object.keys(this.selected).length) {
      this.selected = this.data[this.data.length - 1];
    }
    const start_of_day: Moment = moment(this.selected.date).startOf('day');
    const end_of_day: Moment = moment(this.selected.date).endOf('day');
    // Filter data down to the selected month
    let day_data: Datum[] = [];
    this.data.filter((d: Datum) => {
      return d.date.isBetween(start_of_day, end_of_day, null, '[]');
    }).map((d: Datum) => {
      let scale = [];
      d.details.forEach((det: Detail) => {
        const date: Moment = moment(det.date);
        const i = date.hours();
        if (!scale[i]) {
          scale[i] = {
            date: date.startOf('hour'),
            total: 0,
            details: [],
            summary: []
          }
        }
        scale[i].total += det.value;
        scale[i].details.push(det);
      });
      scale.forEach(s => {
        const group = this.groupBy(s.details, 'name');
        Object.keys(group).forEach(k => {
          s.summary.push({
            name: k,
            total: sum(group[k], (d: any) => {
              return d.value;
            }),
            color: group[k][0].color
          });
        });
      });
      day_data = day_data.concat(scale)
    });
    const data: Summary[] = [];
    day_data.forEach((d: Datum) => {
      const date = d.date;
      d.summary.forEach((s: Summary) => {
        s.date = date;
        data.push(s);
      });
    });
    day_data = GTSLib.cleanArray(day_data);
    const max_value: number = max(data, (d: Summary) => d.total);
    const gtsNames = this.selected.summary.map((summary: Summary) => summary.name);
    const gtsNameScale = scaleBand().rangeRound([this.label_padding, this.height]).domain(gtsNames);
    let hour_labels: string[] = [];
    range(0, 24).forEach(h => hour_labels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
    const dayScale = scaleBand()
      .rangeRound([this.label_padding, this.width])
      .padding(0.01)
      .domain(hour_labels);
    this.items.selectAll('.item-block').remove();
    this.items.selectAll('.item-block')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'item item-block')
      .attr('x', (d: Summary) => this.gutter + dayScale(moment(d.date).startOf('hour').format('HH:mm')) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
      .attr('y', (d: Summary) => {
        return (gtsNameScale(d.name) || 1) - (this.item_size - this.calcItemSize(d, max_value)) / 2
      })
      .attr('rx', (d: Summary) => this.calcItemSize(d, max_value))
      .attr('ry', (d: Summary) => this.calcItemSize(d, max_value))
      .attr('width', (d: Summary) => this.calcItemSize(d, max_value))
      .attr('height', (d: Summary) => this.calcItemSize(d, max_value))
      .attr('fill', (d: Summary) => {
        const color = scaleLinear<string>()
          .range(['#ffffff', d.color || CalendarHeatmap.DEF_MIN_COLOR])
          .domain([-0.5 * max_value, max_value]);
        return color(d.total);
      })
      .style('opacity', 0)
      .on('mouseover', (d: Summary) => {
        if (this.in_transition) {
          return;
        }
        // Calculate tooltip position
        let x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltip_padding;
        while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
          x -= 10;
        }
        const y = gtsNameScale(d.name) + this.tooltip_padding;
        // Show tooltip
        this.tooltip.html(this.getTooltip(d))
          .style('left', x + 'px')
          .style('top', y + 'px')
          .transition()
          .duration(this.transition_duration / 2)
          .ease(easeLinear)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
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
      .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
      .duration(() => this.transition_duration)
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
      }, () => this.in_transition = false);

    // Add time labels
    this.labels.selectAll('.label-time').remove();
    this.labels.selectAll('.label-time')
      .data(hour_labels)
      .enter()
      .append('text')
      .attr('class', 'label label-time')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: string) => d)
      .attr('x', (d: string) => dayScale(d))
      .attr('y', this.label_padding / 2)
      .on('mouseenter', (d: string) => {
        if (this.in_transition) {
          return;
        }
        const selected = d;
        // const selected = itemScale(moment.utc(d));
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: any) => (d.date.format('HH:mm') === selected) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add project labels
    const label_padding = this.label_padding;
    this.labels.selectAll('.label-project').remove();
    this.labels.selectAll('.label-project')
      .data(gtsNames)
      .enter()
      .append('text')
      .attr('class', 'label label-project')
      .attr('x', this.gutter)
      .attr('y', (d: string) => gtsNameScale(d) + this.item_size / 2)
      .attr('min-height', () => gtsNameScale.bandwidth())
      .style('text-anchor', 'left')
      .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
      .text((d: string) => d)
      .each(function () {
        const obj = select(this);
        let text_length = obj.node().getComputedTextLength();
        let text = obj.text();
        while (text_length > (label_padding * 1.5) && text.length > 0) {
          text = text.slice(0, -1);
          obj.text(text + '...');
          text_length = obj.node().getComputedTextLength();
        }
      })
      .on('mouseenter', (gtsName: string) => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', (d: Summary) => (d.name === gtsName) ? 1 : 0.1);
      })
      .on('mouseout', () => {
        if (this.in_transition) {
          return;
        }
        this.items.selectAll('.item-block')
          .transition()
          .duration(this.transition_duration)
          .ease(easeLinear)
          .style('opacity', 1);
      });
    // Add button to switch back to previous overview
    this.drawButton();
  }

  /**
   * Helper function to calculate item position on the x-axis
   * @param {Datum} d
   * @param {moment.Moment} start_of_year
   * @returns {number}
   */
  private calcItemX(d: Datum, start_of_year: Moment) {
    const dayIndex = Math.round((+moment(d.date) - +start_of_year.startOf('week')) / 86400000);
    const colIndex = Math.trunc(dayIndex / 7);
    return colIndex * (this.item_size + this.gutter) + this.label_padding;
  };

  /**
   *
   * @param {Datum} d
   * @param {moment.Moment} start
   * @param {number} offset
   * @returns {number}
   */
  private calcItemXMonth(d: Datum, start: Moment, offset: number) {
    const hourIndex = moment(d.date).hours();
    const colIndex = Math.trunc(hourIndex / 3);
    return colIndex * (this.item_size + this.gutter) + offset;
  };

  /**
   * Helper function to calculate item position on the y-axis
   * @param {Datum} d
   * @returns {number}
   */
  private calcItemY(d: Datum) {
    return this.label_padding + d.date.weekday() * (this.item_size + this.gutter);
  };


  /**
   * Helper function to calculate item size
   * @param {Datum | Summary} d
   * @param {number} max
   * @returns {number}
   */
  private calcItemSize(d: Datum | Summary, max: number) {
    if (max <= 0) {
      return this.item_size;
    }
    return this.item_size * 0.75 + (this.item_size * d.total / max) * 0.25;
  };


  /**
   * Draw the button for navigation purposes
   */
  private drawButton() {
    this.buttons.selectAll('.button').remove();
    const button = this.buttons.append('g')
      .attr('class', 'button button-back')
      .style('opacity', 0)
      .on('click', () => {
        if (this.in_transition) {
          return;
        }
        // Set transition boolean
        this.in_transition = true;
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
      .attr('cx', this.label_padding / 2.25)
      .attr('cy', this.label_padding / 2.5)
      .attr('r', this.item_size / 2);
    button.append('text')
      .attr('x', this.label_padding / 2.25)
      .attr('y', this.label_padding / 2.5)
      .attr('dy', () => {
        return Math.floor(this.width / 100) / 3;
      })
      .attr('font-size', () => {
        return Math.floor(this.label_padding / 3) + 'px';
      })
      .html('&#x2190;');
    button.transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 1);
  };


  /**
   * Transition and remove items and labels related to global overview
   */
  private removeGlobalOverview() {
    this.items.selectAll('.item-block-year')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-year').remove();
  };


  /**
   * Transition and remove items and labels related to year overview
   */
  private removeYearOverview() {
    this.items.selectAll('.item-circle')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-month').remove();
    this.hideBackButton();
  };


  /**
   * Transition and remove items and labels related to month overview
   */
  private removeMonthOverview() {
    this.items.selectAll('.item-block-month')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  };


  /**
   * Transition and remove items and labels related to week overview
   */
  private removeWeekOverview() {
    this.items.selectAll('.item-block-week')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => (i % 2 === 0) ? -this.width / 3 : this.width / 3)
      .remove();
    this.labels.selectAll('.label-day').remove();
    this.labels.selectAll('.label-week').remove();
    this.hideBackButton();
  };


  /**
   * Transition and remove items and labels related to daily overview
   */
  private removeDayOverview() {
    this.items.selectAll('.item-block')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .attr('x', (d: any, i: number) => (i % 2 === 0) ? -this.width / 3 : this.width / 3)
      .remove();
    this.labels.selectAll('.label-time').remove();
    this.labels.selectAll('.label-project').remove();
    this.hideBackButton();
  };


  /**
   * Helper function to hide the tooltip
   */
  private hideTooltip() {
    this.tooltip.transition()
      .duration(this.transition_duration / 2)
      .ease(easeLinear)
      .style('opacity', 0);
  };


  /**
   * Helper function to hide the back button
   */
  private hideBackButton() {
    this.buttons.selectAll('.button')
      .transition()
      .duration(this.transition_duration)
      .ease(easeLinear)
      .style('opacity', 0)
      .remove();
  };

  private getTooltip = (d: Datum | Summary) => {
    let tooltip_html = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
    (d['summary'] || []).forEach(s => {
      tooltip_html += `<li>
  <div class="round" style="background-color:${ColorLib.transparentize(s.color)}; border-color:${s.color}"></div> 
${GTSLib.formatLabel(s.name)}: ${s.total}</li>`;
    });
    if (d.total !== undefined && d['name']) {
      tooltip_html += `<li><div class="round" style="background-color: ${ColorLib.transparentize(d['color'])}; border-color: ${d['color']}" ></div> ${GTSLib.formatLabel(d['name'])}: ${d.total}</li>`;
    }
    tooltip_html += '</ul>';
    return tooltip_html;
  };

  componentWillLoad() {
    this.LOG = new Logger(CalendarHeatmap, this.debug);
  }

  componentDidLoad() {
    this.chart = this.el.shadowRoot.querySelector('#' + this.uuid) as HTMLElement;
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
  }

  render() {
    // noinspection CheckTagEmptyBody
    return <div id={this.uuid}></div>;
  }
}
