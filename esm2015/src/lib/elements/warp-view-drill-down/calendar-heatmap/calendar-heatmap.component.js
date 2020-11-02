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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { Datum } from '../model/datum';
import { ChartLib } from '../../../utils/chart-lib';
import { easeLinear, max, range, scaleBand, scaleLinear, sum, timeDays } from 'd3';
import { event, select } from 'd3-selection';
import { ColorLib } from '../../../utils/color-lib';
import { GTSLib } from '../../../utils/gts.lib';
import moment from 'moment';
export class CalendarHeatmapComponent {
    constructor(el) {
        this.el = el;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.overview = 'global';
        this.handler = new EventEmitter();
        this.change = new EventEmitter();
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._minColor = CalendarHeatmapComponent.DEF_MIN_COLOR;
        // tslint:disable-next-line:variable-name
        this._maxColor = CalendarHeatmapComponent.DEF_MAX_COLOR;
        // Defaults
        this.gutter = 5;
        this.gWidth = 1000;
        this.gHeight = 200;
        this.itemSize = 10;
        this.labelPadding = 40;
        this.transitionDuration = 250;
        this.inTransition = false;
        // Tooltip defaults
        this.tooltipWidth = 450;
        this.tooltipPadding = 15;
        // Overview defaults
        this.history = ['global'];
        this.selected = new Datum();
        this.parentWidth = -1;
        this.getTooltip = (d) => {
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
        };
        this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
            this.calculateDimensions();
        }
    }
    get data() {
        return this._data;
    }
    set minColor(minColor) {
        this._minColor = minColor;
        this.calculateDimensions();
    }
    get minColor() {
        return this._minColor;
    }
    set maxColor(maxColor) {
        this._maxColor = maxColor;
        this.calculateDimensions();
    }
    get maxColor() {
        return this._maxColor;
    }
    static getNumberOfWeeks() {
        const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    }
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    }
    ngAfterViewInit() {
        this.chart = this.div.nativeElement;
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
            }
            else {
                this.calculateDimensions();
            }
        }, 250);
    }
    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
    updateDataSummary() {
        // Get daily summary if that was not provided
        if (!this._data[0].summary) {
            this._data.map((d) => {
                const summary = d.details.reduce((uniques, project) => {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
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
        const startPeriod = moment.utc(this._data[0].date.startOf('y'));
        const endPeriod = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
        // Define array of years and total values
        const yData = this._data.filter((d) => d.date.isBetween(startPeriod, endPeriod, null, '[]'));
        yData.forEach((d) => {
            const summary = [];
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
        let yearData = yData.map((d) => {
            const date = d.date;
            return {
                date,
                total: yData.reduce((prev, current) => {
                    if (current.date.year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }, 0),
                summary: (() => {
                    const summary = yData.reduce((s, data) => {
                        if (data.date.year() === date.year()) {
                            data.summary.forEach(_summary => {
                                if (!s[_summary.name]) {
                                    s[_summary.name] = {
                                        total: _summary.total,
                                        color: _summary.color,
                                    };
                                }
                                else {
                                    s[_summary.name].total += _summary.total;
                                }
                            });
                        }
                        return s;
                    }, {});
                    const unsortedSummary = Object.keys(summary).map((key) => {
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
        const maxValue = max(yearData, (d) => d.total);
        // Define year labels and axis
        const yearLabels = scale.map((d) => d);
        const yearScale = scaleBand()
            .rangeRound([0, this.gWidth])
            .padding(0.05)
            .domain(yearLabels.map((d) => d.year().toString()));
        const color = scaleLinear()
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
            .attr('transform', (d) => 'translate(' + yearScale(d.date.year().toString()) + ',' + this.tooltipPadding * 2 + ')')
            .attr('fill', (d) => color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR)
            .on('click', (d) => {
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
            .on('mouseover', (d) => {
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
            .delay((d, i) => this.transitionDuration * (i + 1) / 10)
            .duration(() => this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1)
            .call((transition, callback) => {
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
            .text((d) => d.year())
            .attr('x', (d) => yearScale(d.year().toString()))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (yearLabel) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (d) => (d.date.year() === yearLabel.year()) ? 1 : 0.1);
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
        const startOfYear = moment(this.selected.date).startOf('year');
        const endOfYear = moment(this.selected.date).endOf('year');
        // Filter data down to the selected year
        let yearData = this._data.filter((d) => d.date.isBetween(startOfYear, endOfYear, null, '[]'));
        yearData.forEach((d) => {
            const summary = [];
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
        const maxValue = max(yearData, (d) => d.total);
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        this.items.selectAll('.item-circle').remove();
        this.items.selectAll('.item-circle')
            .data(yearData)
            .enter()
            .append('rect')
            .attr('class', 'item item-circle').style('opacity', 0)
            .attr('x', (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('y', (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, maxValue))
            .attr('ry', (d) => this.calcItemSize(d, maxValue))
            .attr('width', (d) => this.calcItemSize(d, maxValue))
            .attr('height', (d) => this.calcItemSize(d, maxValue))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
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
            .on('mouseover', (d) => {
            if (this.inTransition) {
                return;
            }
            // Pulsating animation
            const circle = select(event.currentTarget);
            const repeat = () => {
                circle.transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (data) => this.calcItemX(data, startOfYear) - (this.itemSize * 1.1 - this.itemSize) / 2)
                    .attr('y', (data) => this.calcItemY(data) - (this.itemSize * 1.1 - this.itemSize) / 2)
                    .attr('width', this.itemSize * 1.1)
                    .attr('height', this.itemSize * 1.1)
                    .transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (data) => this.calcItemX(data, startOfYear) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2)
                    .attr('y', (data) => this.calcItemY(data) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2)
                    .attr('width', (data) => this.calcItemSize(data, maxValue))
                    .attr('height', (data) => this.calcItemSize(data, maxValue))
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
                .attr('x', (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
                .attr('y', (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
                .attr('width', (d) => this.calcItemSize(d, maxValue))
                .attr('height', (d) => this.calcItemSize(d, maxValue));
            // Hide tooltip
            this.hideTooltip();
        })
            .transition()
            .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
            .duration(() => this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1)
            .call((transition, callback) => {
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
        const monthLabels = [];
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
            .text((d) => d.format('MMM'))
            .attr('x', (d, i) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2)
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (d) => {
            if (this.inTransition) {
                return;
            }
            const selectedMonth = moment(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (data) => moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1);
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
            .on('click', (d) => {
            if (this.inTransition) {
                return;
            }
            // Check month data
            const monthData = this._data.filter((e) => e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]'));
            // Don't transition if there is no data to show
            if (!monthData.length) {
                return;
            }
            // Set selected month to the one clicked on
            this.selected = { date: d };
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
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((d) => moment.utc(d).weekday().toString()));
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.inTransition) {
                return;
            }
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
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
        const startOfMonth = moment(this.selected.date).startOf('month');
        const endOfMonth = moment(this.selected.date).endOf('month');
        // Filter data down to the selected month
        let monthData = [];
        this._data.filter((data) => data.date.isBetween(startOfMonth, endOfMonth, null, '[]'))
            .map((d) => {
            const scale = [];
            d.details.forEach((det) => {
                const date = moment.utc(det.date);
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
            scale.forEach((s) => {
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((k) => {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (data) => data.total),
                        color: group[k][0].color
                    });
                });
            });
            monthData = monthData.concat(scale);
        });
        monthData = GTSLib.cleanArray(monthData);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
        const maxValue = max(monthData, (d) => d.total);
        // Define day labels and axis
        const dayLabels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((d) => moment.utc(d).weekday().toString()));
        // Define week labels and axis
        const weekLabels = [startOfMonth];
        const incWeek = moment(startOfMonth);
        while (incWeek.week() !== endOfMonth.week()) {
            weekLabels.push(moment(incWeek.add(1, 'week')));
        }
        monthData.forEach((d) => {
            const summary = [];
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((k) => {
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
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add month data items to the overview
        this.items.selectAll('.item-block-month').remove();
        this.items.selectAll('.item-block-month')
            .data(monthData)
            .enter().append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-month')
            .attr('y', (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('x', (d) => this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, maxValue))
            .attr('ry', (d) => this.calcItemSize(d, maxValue))
            .attr('width', (d) => this.calcItemSize(d, maxValue))
            .attr('height', (d) => this.calcItemSize(d, maxValue))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
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
            .on('mouseover', (d) => {
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
            .call((transition, callback) => {
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
            .text((d) => 'Week ' + d.week())
            .attr('x', (d) => weekScale(d.week().toString()))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (weekday) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (d) => {
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
            .on('click', (d) => {
            if (this.inTransition) {
                return;
            }
            this.inTransition = true;
            // Set selected month to the one clicked on
            this.selected = { date: d };
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
            .attr('y', (d, i) => dayScale(i) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.inTransition) {
                return;
            }
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
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
        const startOfWeek = moment(this.selected.date).startOf('week');
        const endOfWeek = moment(this.selected.date).endOf('week');
        // Filter data down to the selected week
        let weekData = [];
        this._data.filter((d) => {
            return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
        }).map((d) => {
            const scale = [];
            d.details.forEach((det) => {
                const date = moment(det.date);
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
                Object.keys(group).forEach(k => s.summary.push({
                    name: k,
                    total: sum(group[k], (data) => data.value),
                    color: group[k][0].color
                }));
            });
            weekData = weekData.concat(scale);
        });
        weekData = GTSLib.cleanArray(weekData);
        const maxValue = max(weekData, (d) => d.total);
        // Define day labels and axis
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((d) => moment.utc(d).weekday().toString()));
        // Define hours labels and axis
        const hoursLabels = [];
        range(0, 24).forEach(h => hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
        const hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
        const color = scaleLinear()
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
            .attr('y', (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('x', (d) => this.gutter
            + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, maxValue))
            .attr('ry', (d) => this.calcItemSize(d, maxValue))
            .attr('width', (d) => this.calcItemSize(d, maxValue))
            .attr('height', (d) => this.calcItemSize(d, maxValue))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
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
        }).on('mouseover', (d) => {
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
            .call((transition, callback) => {
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
            .text((d) => d)
            .attr('x', (d) => hourScale(d))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (hour) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (d) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1);
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
            .attr('y', (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.inTransition) {
                return;
            }
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1);
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
        const startOfDay = moment(this.selected.date).startOf('day');
        const endOfDay = moment(this.selected.date).endOf('day');
        // Filter data down to the selected month
        let dayData = [];
        this._data.filter((d) => {
            return d.date.isBetween(startOfDay, endOfDay, null, '[]');
        }).map((d) => {
            const scale = [];
            d.details.forEach((det) => {
                const date = moment(det.date);
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
                        total: sum(group[k], (item) => item.value),
                        color: group[k][0].color
                    });
                });
            });
            dayData = dayData.concat(scale);
        });
        const data = [];
        dayData.forEach((d) => {
            const date = d.date;
            d.summary.forEach((s) => {
                s.date = date;
                data.push(s);
            });
        });
        dayData = GTSLib.cleanArray(dayData);
        const maxValue = max(data, (d) => d.total);
        const gtsNames = this.selected.summary.map((summary) => summary.name);
        const gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
        const hourLabels = [];
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
            .attr('x', (d) => this.gutter
            + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2)
            .attr('y', (d) => {
            return (gtsNameScale(d.name) || 1) - (this.itemSize - this.calcItemSize(d, maxValue)) / 2;
        })
            .attr('rx', (d) => this.calcItemSize(d, maxValue))
            .attr('ry', (d) => this.calcItemSize(d, maxValue))
            .attr('width', (d) => this.calcItemSize(d, maxValue))
            .attr('height', (d) => this.calcItemSize(d, maxValue))
            .attr('fill', (d) => {
            const color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                .domain([-0.5 * maxValue, maxValue]);
            return color(d.total);
        })
            .style('opacity', 0)
            .on('mouseover', (d) => {
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
            .on('click', (d) => {
            if (this.handler) {
                this.handler.emit(d);
            }
        })
            .transition()
            .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration)
            .duration(() => this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1)
            .call((transition, callback) => {
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
            .text((d) => d)
            .attr('x', (d) => dayScale(d))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (d) => {
            if (this.inTransition) {
                return;
            }
            const selected = d;
            // const selected = itemScale(moment.utc(d));
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (item) => (item.date.format('HH:mm') === selected) ? 1 : 0.1);
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
            .attr('y', (d) => gtsNameScale(d) + this.itemSize / 2)
            .attr('min-height', () => gtsNameScale.bandwidth())
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.labelPadding / 3) + 'px')
            .text((d) => d)
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
            .on('mouseenter', (gtsName) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (d) => (d.name === gtsName) ? 1 : 0.1);
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
    calcItemX(d, startOfYear) {
        const dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
        const colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
    }
    calcItemXMonth(d, start, offset) {
        const hourIndex = moment(d.date).hours();
        const colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.itemSize + this.gutter) + offset;
    }
    calcItemY(d) {
        return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
    }
    calcItemSize(d, m) {
        if (m <= 0) {
            return this.itemSize;
        }
        return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
    }
    drawButton() {
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
            }
            else if (this.overview === 'month') {
                this.removeMonthOverview();
            }
            else if (this.overview === 'week') {
                this.removeWeekOverview();
            }
            else if (this.overview === 'day') {
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
    removeGlobalOverview() {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    }
    removeYearOverview() {
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
    removeMonthOverview() {
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
    removeWeekOverview() {
        this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    removeDayOverview() {
        this.items.selectAll('.item-block')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3)
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    }
    hideTooltip() {
        this.tooltip.transition()
            .duration(this.transitionDuration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    }
    /**
     * Helper function to hide the back button
     */
    hideBackButton() {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    }
}
CalendarHeatmapComponent.DEF_MIN_COLOR = '#ffffff';
CalendarHeatmapComponent.DEF_MAX_COLOR = '#333333';
CalendarHeatmapComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-heatmap',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #chart></div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;position:relative;user-select:none}:host .item,:host .label{cursor:pointer}:host .label{fill:#aaa;font-family:Helvetica,arial,Open Sans,sans-serif}:host .button{cursor:pointer;fill:transparent;stroke:#aaa;stroke-width:2}:host .button text{fill:#aaa;stroke-width:1;text-anchor:middle}:host .heatmap-tooltip{background:rgba(0,0,0,.75);color:#fff;font-family:Helvetica,arial,Open Sans,sans-serif;font-size:12px;line-height:14px;max-width:650px;overflow:hidden;padding:15px;pointer-events:none;position:absolute;width:450px;z-index:9999}:host .heatmap-tooltip ul{list-style:none;padding:0}:host .heatmap-tooltip ul li{padding:0}:host .heatmap-tooltip ul li .gtsInfo{max-width:650px;padding-left:20px;width:auto}:host .heatmap-tooltip .header strong{display:inline-block;width:100%}:host .heatmap-tooltip .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:12px;width:12px}:host .heatmap-tooltip .header strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"]
            },] }
];
CalendarHeatmapComponent.ctorParameters = () => [
    { type: ElementRef }
];
CalendarHeatmapComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    data: [{ type: Input, args: ['data',] }],
    minColor: [{ type: Input, args: ['minColor',] }],
    maxColor: [{ type: Input, args: ['maxColor',] }],
    div: [{ type: ViewChild, args: ['chart', { static: true },] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    overview: [{ type: Input, args: ['overview',] }],
    handler: [{ type: Output, args: ['handler',] }],
    change: [{ type: Output, args: ['change',] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItaGVhdG1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1kcmlsbC1kb3duL2NhbGVuZGFyLWhlYXRtYXAvY2FsZW5kYXItaGVhdG1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUksT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxLQUFLLEVBQWtCLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFhLEdBQUcsRUFBRSxRQUFRLEVBQUMsTUFBTSxJQUFJLENBQUM7QUFDNUYsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5QyxPQUFPLE1BQWdCLE1BQU0sUUFBUSxDQUFDO0FBUXRDLE1BQU0sT0FBTyx3QkFBd0I7SUE0Q25DLFlBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBT2xCLFVBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzlCLFdBQU0sR0FBRyxR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QUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5RyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMzRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQzthQUMxRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7WUFDeEIsSUFBSSxJQUFJ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USxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2NBQzlGLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN4RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMzRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM1RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQzthQUMxRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7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QixDQUFDO0lBRUQ7O09BRUc7SUFDSyxjQUFjO1FBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQzthQUM5QixVQUFVLEVBQUU7YUFDWixRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO2FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDaEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDbkIsTUFBTSxFQUFFLENBQUM7SUFDZCxDQUFDOztBQWo1Q2Msc0NBQWEsR0FBRyxTQUFTLENBQUM7QUFDMUIsc0NBQWEsR0FBRyxTQUFTLENBQUM7O1lBaEQxQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsdXFCQUFnRDtnQkFFaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUFmaUMsVUFBVTs7O29CQWtCekMsS0FBSyxTQUFDLE9BQU87bUJBU2IsS0FBSyxTQUFDLE1BQU07dUJBWVosS0FBSyxTQUFDLFVBQVU7dUJBU2hCLEtBQUssU0FBQyxVQUFVO2tCQWlCaEIsU0FBUyxTQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0JBRWpDLEtBQUssU0FBQyxPQUFPO3FCQUNiLEtBQUssU0FBQyxRQUFRO3VCQUNkLEtBQUssU0FBQyxVQUFVO3NCQUVoQixNQUFNLFNBQUMsU0FBUztxQkFDaEIsTUFBTSxTQUFDLFFBQVE7dUJBd0NmLFlBQVksU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtEYXR1bSwgRGV0YWlsLCBTdW1tYXJ5fSBmcm9tICcuLi9tb2RlbC9kYXR1bSc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtlYXNlTGluZWFyLCBtYXgsIHJhbmdlLCBzY2FsZUJhbmQsIHNjYWxlTGluZWFyLCBTZWxlY3Rpb24sIHN1bSwgdGltZURheXN9IGZyb20gJ2QzJztcbmltcG9ydCB7ZXZlbnQsIHNlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50LCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjYWxlbmRhci1oZWF0bWFwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NhbGVuZGFyLWhlYXRtYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jYWxlbmRhci1oZWF0bWFwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogRGF0dW1bXSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGF0YSddLCBkYXRhKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpOiBEYXR1bVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnbWluQ29sb3InKSBzZXQgbWluQ29sb3IobWluQ29sb3I6IHN0cmluZykge1xuICAgIHRoaXMuX21pbkNvbG9yID0gbWluQ29sb3I7XG4gICAgdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKCk7XG4gIH1cblxuICBnZXQgbWluQ29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkNvbG9yO1xuICB9XG5cbiAgQElucHV0KCdtYXhDb2xvcicpIHNldCBtYXhDb2xvcihtYXhDb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWF4Q29sb3IgPSBtYXhDb2xvcjtcbiAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgfVxuXG4gIGdldCBtYXhDb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4Q29sb3I7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBERUZfTUlOX0NPTE9SID0gJyNmZmZmZmYnO1xuICBwcml2YXRlIHN0YXRpYyBERUZfTUFYX0NPTE9SID0gJyMzMzMzMzMnO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG5cbiAgQFZpZXdDaGlsZCgnY2hhcnQnLCB7c3RhdGljOiB0cnVlfSkgZGl2OiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgnd2lkdGgnKSB3aWR0aCA9IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gIEBJbnB1dCgnaGVpZ2h0JykgaGVpZ2h0ID0gQ2hhcnRMaWIuREVGQVVMVF9IRUlHSFQ7XG4gIEBJbnB1dCgnb3ZlcnZpZXcnKSBvdmVydmlldyA9ICdnbG9iYWwnO1xuXG4gIEBPdXRwdXQoJ2hhbmRsZXInKSBoYW5kbGVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RhdGE6IERhdHVtW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX21pbkNvbG9yOiBzdHJpbmcgPSBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfbWF4Q29sb3I6IHN0cmluZyA9IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SO1xuLy8gRGVmYXVsdHNcbiAgcHJpdmF0ZSBndXR0ZXIgPSA1O1xuICBwcml2YXRlIGdXaWR0aCA9IDEwMDA7XG4gIHByaXZhdGUgZ0hlaWdodCA9IDIwMDtcbiAgcHJpdmF0ZSBpdGVtU2l6ZSA9IDEwO1xuICBwcml2YXRlIGxhYmVsUGFkZGluZyA9IDQwO1xuICBwcml2YXRlIHRyYW5zaXRpb25EdXJhdGlvbiA9IDI1MDtcbiAgcHJpdmF0ZSBpblRyYW5zaXRpb24gPSBmYWxzZTtcbiAgLy8gVG9vbHRpcCBkZWZhdWx0c1xuICBwcml2YXRlIHRvb2x0aXBXaWR0aCA9IDQ1MDtcbiAgcHJpdmF0ZSB0b29sdGlwUGFkZGluZyA9IDE1O1xuICAvLyBPdmVydmlldyBkZWZhdWx0c1xuICBwcml2YXRlIGhpc3RvcnkgPSBbJ2dsb2JhbCddO1xuICBwcml2YXRlIHNlbGVjdGVkOiBEYXR1bSA9IG5ldyBEYXR1bSgpO1xuICAvLyBEMyByZWxhdGVkIHZhcmlhYmxlc1xuICBwcml2YXRlIHN2ZzogU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+O1xuICBwcml2YXRlIGl0ZW1zOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgbGFiZWxzOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgYnV0dG9uczogU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+O1xuICBwcml2YXRlIHRvb2x0aXA6IFNlbGVjdGlvbjxIVE1MRGl2RWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgcGFyZW50V2lkdGggPSAtMTtcbiAgcHJpdmF0ZSBjaGFydDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgcmVzaXplVGltZXI7XG5cbiAgc3RhdGljIGdldE51bWJlck9mV2Vla3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBkYXlJbmRleCA9IE1hdGgucm91bmQoKCttb21lbnQudXRjKCkgLSArbW9tZW50LnV0YygpLnN1YnRyYWN0KDEsICd5ZWFyJykuc3RhcnRPZignd2VlaycpKSAvIDg2NDAwMDAwKTtcbiAgICByZXR1cm4gTWF0aC50cnVuYyhkYXlJbmRleCAvIDcpICsgMTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBvblJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGggIT09IHRoaXMucGFyZW50V2lkdGgpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmNoYXJ0ID0gdGhpcy5kaXYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAvLyBJbml0aWFsaXplIHN2ZyBlbGVtZW50XG4gICAgdGhpcy5zdmcgPSBzZWxlY3QodGhpcy5jaGFydCkuYXBwZW5kKCdzdmcnKS5hdHRyKCdjbGFzcycsICdzdmcnKTtcbiAgICAvLyBJbml0aWFsaXplIG1haW4gc3ZnIGVsZW1lbnRzXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpO1xuICAgIHRoaXMubGFiZWxzID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgdGhpcy5idXR0b25zID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgLy8gQWRkIHRvb2x0aXAgdG8gdGhlIHNhbWUgZWxlbWVudCBhcyBtYWluIHN2Z1xuICAgIHRoaXMudG9vbHRpcCA9IHNlbGVjdCh0aGlzLmNoYXJ0KVxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdoZWF0bWFwLXRvb2x0aXAnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gICAgLy8gQ2FsY3VsYXRlIGNoYXJ0IGRpbWVuc2lvbnNcbiAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICAvLyAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURpbWVuc2lvbnMoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZXIpO1xuICAgIHRoaXMucmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAhPT0gMCkge1xuICAgICAgICB0aGlzLmdXaWR0aCA9IHRoaXMuY2hhcnQuY2xpZW50V2lkdGggPCAxMDAwID8gMTAwMCA6IHRoaXMuY2hhcnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHRoaXMuaXRlbVNpemUgPSAoKHRoaXMuZ1dpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcpIC8gQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LmdldE51bWJlck9mV2Vla3MoKSAtIHRoaXMuZ3V0dGVyKTtcbiAgICAgICAgdGhpcy5nSGVpZ2h0ID0gdGhpcy5sYWJlbFBhZGRpbmcgKyA3ICogKHRoaXMuaXRlbVNpemUgKyB0aGlzLmd1dHRlcik7XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ3dpZHRoJywgdGhpcy5nV2lkdGgpLmF0dHIoJ2hlaWdodCcsIHRoaXMuZ0hlaWdodCk7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY2FsY3VsYXRlRGltZW5zaW9ucyddLCB0aGlzLl9kYXRhKTtcbiAgICAgICAgaWYgKCEhdGhpcy5fZGF0YSAmJiAhIXRoaXMuX2RhdGFbMF0gJiYgISF0aGlzLl9kYXRhWzBdLnN1bW1hcnkpIHtcbiAgICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cbiAgICB9LCAyNTApO1xuICB9XG5cblxuICBwcml2YXRlIGdyb3VwQnkoeHMsIGtleSkge1xuICAgIHJldHVybiB4cy5yZWR1Y2UoKHJ2LCB4KSA9PiB7XG4gICAgICAocnZbeFtrZXldXSA9IHJ2W3hba2V5XV0gfHwgW10pLnB1c2goeCk7XG4gICAgICByZXR1cm4gcnY7XG4gICAgfSwge30pO1xuICB9XG5cbiAgdXBkYXRlRGF0YVN1bW1hcnkoKSB7XG4gICAgLy8gR2V0IGRhaWx5IHN1bW1hcnkgaWYgdGhhdCB3YXMgbm90IHByb3ZpZGVkXG4gICAgaWYgKCF0aGlzLl9kYXRhWzBdLnN1bW1hcnkpIHtcbiAgICAgIHRoaXMuX2RhdGEubWFwKChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gZC5kZXRhaWxzLnJlZHVjZSgodW5pcXVlczogYW55LCBwcm9qZWN0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIXVuaXF1ZXNbcHJvamVjdC5uYW1lXSkge1xuICAgICAgICAgICAgdW5pcXVlc1twcm9qZWN0Lm5hbWVdID0ge3ZhbHVlOiBwcm9qZWN0LnZhbHVlfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pcXVlc1twcm9qZWN0Lm5hbWVdLnZhbHVlICs9IHByb2plY3QudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmlxdWVzO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIGNvbnN0IHVuc29ydGVkU3VtbWFyeSA9IE9iamVjdC5rZXlzKHN1bW1hcnkpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICAgIHRvdGFsOiBzdW1tYXJ5W2tleV0udmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgZC5zdW1tYXJ5ID0gdW5zb3J0ZWRTdW1tYXJ5LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICByZXR1cm4gYi50b3RhbCAtIGEudG90YWw7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3ZnIHx8ICF0aGlzLl9kYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0J10sIFt0aGlzLm92ZXJ2aWV3LCB0aGlzLnNlbGVjdGVkXSk7XG4gICAgc3dpdGNoICh0aGlzLm92ZXJ2aWV3KSB7XG4gICAgICBjYXNlICdnbG9iYWwnOlxuICAgICAgICB0aGlzLmRyYXdHbG9iYWxPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuX2RhdGFbMF0uZGF0ZSksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdLmRhdGUpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgdGhpcy5kcmF3WWVhck92ZXJ2aWV3KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgICAgIG92ZXJ2aWV3OiB0aGlzLm92ZXJ2aWV3LFxuICAgICAgICAgIHN0YXJ0OiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd5ZWFyJyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZigneWVhcicpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHRoaXMuZHJhd01vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IHRoaXMub3ZlcnZpZXcsXG4gICAgICAgICAgc3RhcnQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ21vbnRoJyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignbW9udGgnKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIHRoaXMuZHJhd1dlZWtPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignd2VlaycpLFxuICAgICAgICAgIGVuZDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ3dlZWsnKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgdGhpcy5kcmF3RGF5T3ZlcnZpZXcoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IHRoaXMub3ZlcnZpZXcsXG4gICAgICAgICAgc3RhcnQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgIGVuZDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ2RheScpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBkcmF3R2xvYmFsT3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIERlZmluZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBkYXRhc2V0XG4gICAgY29uc3Qgc3RhcnRQZXJpb2Q6IE1vbWVudCA9IG1vbWVudC51dGModGhpcy5fZGF0YVswXS5kYXRlLnN0YXJ0T2YoJ3knKSk7XG4gICAgY29uc3QgZW5kUGVyaW9kOiBNb21lbnQgPSBtb21lbnQudXRjKHRoaXMuX2RhdGFbdGhpcy5fZGF0YS5sZW5ndGggLSAxXS5kYXRlLmVuZE9mKCd5JykpO1xuICAgIC8vIERlZmluZSBhcnJheSBvZiB5ZWFycyBhbmQgdG90YWwgdmFsdWVzXG4gICAgY29uc3QgeURhdGE6IERhdHVtW10gPSB0aGlzLl9kYXRhLmZpbHRlcigoZDogRGF0dW0pID0+IGQuZGF0ZS5pc0JldHdlZW4oc3RhcnRQZXJpb2QsIGVuZFBlcmlvZCwgbnVsbCwgJ1tdJykpO1xuICAgIHlEYXRhLmZvckVhY2goKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzdW1tYXJ5OiBTdW1tYXJ5W10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KGQuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBzdW1tYXJ5LnB1c2goe1xuICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgdG90YWw6IGdyb3VwW2tdLnJlZHVjZSgoYWNjLCBvKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjICsgby52YWx1ZTtcbiAgICAgICAgICB9LCAwKSxcbiAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3IsXG4gICAgICAgICAgaWQ6IGdyb3VwW2tdWzBdLmlkLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZC5zdW1tYXJ5ID0gc3VtbWFyeTtcbiAgICB9KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGguY2VpbChtb21lbnQuZHVyYXRpb24oZW5kUGVyaW9kLmRpZmYoc3RhcnRQZXJpb2QpKS5hc1llYXJzKCkpO1xuICAgIGNvbnN0IHNjYWxlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkdXJhdGlvbjsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gbW9tZW50LnV0YygpLnllYXIoc3RhcnRQZXJpb2QueWVhcigpICsgaSkubW9udGgoMCkuZGF0ZSgxKS5zdGFydE9mKCd5Jyk7XG4gICAgICBzY2FsZS5wdXNoKGQpO1xuICAgIH1cbiAgICBsZXQgeWVhckRhdGE6IERhdHVtW10gPSB5RGF0YS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBkYXRlOiBNb21lbnQgPSBkLmRhdGU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlLFxuICAgICAgICB0b3RhbDogeURhdGEucmVkdWNlKChwcmV2OiBudW1iZXIsIGN1cnJlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmICgoY3VycmVudC5kYXRlIGFzIE1vbWVudCkueWVhcigpID09PSBkYXRlLnllYXIoKSkge1xuICAgICAgICAgICAgcHJldiArPSBjdXJyZW50LnRvdGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgfSwgMCksXG4gICAgICAgIHN1bW1hcnk6ICgoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3VtbWFyeTogU3VtbWFyeSA9IHlEYXRhLnJlZHVjZSgoczogYW55LCBkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICgoZGF0YS5kYXRlIGFzIE1vbWVudCkueWVhcigpID09PSBkYXRlLnllYXIoKSkge1xuICAgICAgICAgICAgICBkYXRhLnN1bW1hcnkuZm9yRWFjaChfc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzW19zdW1tYXJ5Lm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICBzW19zdW1tYXJ5Lm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbDogX3N1bW1hcnkudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBfc3VtbWFyeS5jb2xvcixcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNbX3N1bW1hcnkubmFtZV0udG90YWwgKz0gX3N1bW1hcnkudG90YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICBjb25zdCB1bnNvcnRlZFN1bW1hcnk6IFN1bW1hcnlbXSA9IE9iamVjdC5rZXlzKHN1bW1hcnkpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgICAgIHRvdGFsOiBzdW1tYXJ5W2tleV0udG90YWwsXG4gICAgICAgICAgICAgIGNvbG9yOiBzdW1tYXJ5W2tleV0uY29sb3IsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB1bnNvcnRlZFN1bW1hcnkuc29ydCgoYSwgYikgPT4gYi50b3RhbCAtIGEudG90YWwpO1xuICAgICAgICB9KSgpLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICAvLyBDYWxjdWxhdGUgbWF4IHZhbHVlIG9mIGFsbCB0aGUgeWVhcnMgaW4gdGhlIGRhdGFzZXRcbiAgICB5ZWFyRGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KHllYXJEYXRhKTtcbiAgICBjb25zdCBtYXhWYWx1ZSA9IG1heCh5ZWFyRGF0YSwgKGQ6IERhdHVtKSA9PiBkLnRvdGFsKTtcbiAgICAvLyBEZWZpbmUgeWVhciBsYWJlbHMgYW5kIGF4aXNcbiAgICBjb25zdCB5ZWFyTGFiZWxzID0gc2NhbGUubWFwKChkOiBNb21lbnQpID0+IGQpO1xuICAgIGNvbnN0IHllYXJTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy5nV2lkdGhdKVxuICAgICAgLnBhZGRpbmcoMC4wNSlcbiAgICAgIC5kb21haW4oeWVhckxhYmVscy5tYXAoKGQ6IE1vbWVudCkgPT4gZC55ZWFyKCkudG9TdHJpbmcoKSkpO1xuXG4gICAgY29uc3QgY29sb3IgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgIC5yYW5nZShbdGhpcy5taW5Db2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUiwgdGhpcy5tYXhDb2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUl0pXG4gICAgICAuZG9tYWluKFstMC4xNSAqIG1heFZhbHVlLCBtYXhWYWx1ZV0pO1xuICAgIC8vIEFkZCBnbG9iYWwgZGF0YSBpdGVtcyB0byB0aGUgb3ZlcnZpZXdcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2steWVhcicpLnJlbW92ZSgpO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay15ZWFyJylcbiAgICAgIC5kYXRhKHllYXJEYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1ibG9jay15ZWFyJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+ICh0aGlzLmdXaWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nKSAvIHllYXJMYWJlbHMubGVuZ3RoIC0gdGhpcy5ndXR0ZXIgKiA1KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICgpID0+IHRoaXMuZ0hlaWdodCAtIHRoaXMubGFiZWxQYWRkaW5nKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkOiBEYXR1bSkgPT4gJ3RyYW5zbGF0ZSgnICsgeWVhclNjYWxlKChkLmRhdGUgYXMgTW9tZW50KS55ZWFyKCkudG9TdHJpbmcoKSkgKyAnLCcgKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMiArICcpJylcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IERhdHVtKSA9PiBjb2xvcihkLnRvdGFsKSB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUilcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBpbl90cmFuc2l0aW9uIGZsYWdcbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBTZXQgc2VsZWN0ZWQgZGF0ZSB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGQ7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZ2xvYmFsIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZUdsb2JhbE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICd5ZWFyJztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICAgIGxldCB4ID0geWVhclNjYWxlKGQuZGF0ZS55ZWFyKCkudG9TdHJpbmcoKSkgKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMjtcbiAgICAgICAgd2hpbGUgKHRoaXMuZ1dpZHRoIC0geCA8ICh0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiA1KSkge1xuICAgICAgICAgIHggLT0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudG9vbHRpcFBhZGRpbmcgKiA0O1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoZDogYW55LCBpOiBudW1iZXIpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uICogKGkgKyAxKSAvIDEwKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcbiAgICAvLyBBZGQgeWVhciBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC15ZWFyJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwteWVhcicpXG4gICAgICAuZGF0YSh5ZWFyTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXllYXInKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogTW9tZW50KSA9PiBkLnllYXIoKSlcbiAgICAgIC5hdHRyKCd4JywgKGQ6IE1vbWVudCkgPT4geWVhclNjYWxlKGQueWVhcigpLnRvU3RyaW5nKCkpKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIpXG4gICAgICAub24oJ21vdXNlZW50ZXInLCAoeWVhckxhYmVsOiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay15ZWFyJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IERhdHVtKSA9PiAoZC5kYXRlLnllYXIoKSA9PT0geWVhckxhYmVsLnllYXIoKSkgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGluX3RyYW5zaXRpb24gZmxhZ1xuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCB5ZWFyIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0geWVhckRhdGFbMF07XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZ2xvYmFsIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZUdsb2JhbE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICd5ZWFyJztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogRHJhdyB5ZWFyIG92ZXJ2aWV3XG4gICAqL1xuICBkcmF3WWVhck92ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgc3RhcnQgYW5kIGVuZCBkYXRlIG9mIHRoZSBzZWxlY3RlZCB5ZWFyXG4gICAgY29uc3Qgc3RhcnRPZlllYXI6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ3llYXInKTtcbiAgICBjb25zdCBlbmRPZlllYXI6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCd5ZWFyJyk7XG4gICAgLy8gRmlsdGVyIGRhdGEgZG93biB0byB0aGUgc2VsZWN0ZWQgeWVhclxuICAgIGxldCB5ZWFyRGF0YTogRGF0dW1bXSA9IHRoaXMuX2RhdGEuZmlsdGVyKChkOiBEYXR1bSkgPT4gZC5kYXRlLmlzQmV0d2VlbihzdGFydE9mWWVhciwgZW5kT2ZZZWFyLCBudWxsLCAnW10nKSk7XG4gICAgeWVhckRhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHN1bW1hcnk6IFN1bW1hcnlbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwQnkoZC5kZXRhaWxzLCAnbmFtZScpO1xuICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goayA9PiB7XG4gICAgICAgIHN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgbmFtZTogayxcbiAgICAgICAgICB0b3RhbDogZ3JvdXBba10ucmVkdWNlKChhY2MsIG8pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhY2MgKyBvLnZhbHVlO1xuICAgICAgICAgIH0sIDApLFxuICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvcixcbiAgICAgICAgICBpZDogZ3JvdXBba11bMF0uaWQsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkLnN1bW1hcnkgPSBzdW1tYXJ5O1xuICAgIH0pO1xuICAgIHllYXJEYXRhID0gR1RTTGliLmNsZWFuQXJyYXkoeWVhckRhdGEpO1xuICAgIC8vIENhbGN1bGF0ZSBtYXggdmFsdWUgb2YgdGhlIHllYXIgZGF0YVxuICAgIGNvbnN0IG1heFZhbHVlID0gbWF4KHllYXJEYXRhLCAoZDogRGF0dW0pID0+IGQudG90YWwpO1xuICAgIGNvbnN0IGNvbG9yID0gc2NhbGVMaW5lYXI8c3RyaW5nPigpXG4gICAgICAucmFuZ2UoW3RoaXMubWluQ29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NSU5fQ09MT1IsIHRoaXMubWF4Q29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NQVhfQ09MT1JdKVxuICAgICAgLmRvbWFpbihbLTAuMTUgKiBtYXhWYWx1ZSwgbWF4VmFsdWVdKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJykucmVtb3ZlKCk7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAuZGF0YSh5ZWFyRGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpdGVtIGl0ZW0tY2lyY2xlJykuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGQsIHN0YXJ0T2ZZZWFyKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZCkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3J4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogRGF0dW0pID0+IChkLnRvdGFsID4gMCkgPyBjb2xvcihkLnRvdGFsKSA6ICd0cmFuc3BhcmVudCcpXG4gICAgICAub24oJ2NsaWNrJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCB0cmFuc2l0aW9uIGlmIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2hvd1xuICAgICAgICBpZiAoZC50b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBkYXRlIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZDtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCB5ZWFyIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZVllYXJPdmVydmlldygpO1xuICAgICAgICAvLyBSZWRyYXcgdGhlIGNoYXJ0XG4gICAgICAgIHRoaXMub3ZlcnZpZXcgPSAnZGF5JztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHVsc2F0aW5nIGFuaW1hdGlvblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBzZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IHJlcGVhdCA9ICgpID0+IHtcbiAgICAgICAgICBjaXJjbGUudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGRhdGEsIHN0YXJ0T2ZZZWFyKSAtICh0aGlzLml0ZW1TaXplICogMS4xIC0gdGhpcy5pdGVtU2l6ZSkgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1ZKGRhdGEpIC0gKHRoaXMuaXRlbVNpemUgKiAxLjEgLSB0aGlzLml0ZW1TaXplKSAvIDIpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLml0ZW1TaXplICogMS4xKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaXRlbVNpemUgKiAxLjEpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGRhdGEsIHN0YXJ0T2ZZZWFyKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZGF0YSwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAgICAgICAuYXR0cigneScsIChkYXRhOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZGF0YSkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGRhdGEsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGRhdGE6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkYXRhLCBtYXhWYWx1ZSkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGRhdGE6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkYXRhLCBtYXhWYWx1ZSkpXG4gICAgICAgICAgICAub24oJ2VuZCcsIHJlcGVhdCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcGVhdCgpO1xuICAgICAgICAvLyBDb25zdHJ1Y3QgdG9vbHRpcFxuICAgICAgICAvLyBDYWxjdWxhdGUgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgICBsZXQgeCA9IHRoaXMuY2FsY0l0ZW1YKGQsIHN0YXJ0T2ZZZWFyKSArIHRoaXMuaXRlbVNpemUgLyAyO1xuICAgICAgICBpZiAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDMpKSB7XG4gICAgICAgICAgeCAtPSB0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAyO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmNhbGNJdGVtWShkKSArIHRoaXMuaXRlbVNpemUgLyAyO1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGNpcmNsZSByYWRpdXMgYmFjayB0byB3aGF0IGl0J3Mgc3VwcG9zZWQgdG8gYmVcbiAgICAgICAgc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuYXR0cigneCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVgoZCwgc3RhcnRPZlllYXIpICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZCkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSk7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcbiAgICAvLyBBZGQgbW9udGggbGFiZWxzXG4gICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLmNlaWwobW9tZW50LmR1cmF0aW9uKGVuZE9mWWVhci5kaWZmKHN0YXJ0T2ZZZWFyKSkuYXNNb250aHMoKSk7XG4gICAgY29uc3QgbW9udGhMYWJlbHM6IE1vbWVudFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBkdXJhdGlvbjsgaSsrKSB7XG4gICAgICBtb250aExhYmVscy5wdXNoKG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLm1vbnRoKChzdGFydE9mWWVhci5tb250aCgpICsgaSkgJSAxMikuc3RhcnRPZignbW9udGgnKSk7XG4gICAgfVxuICAgIGNvbnN0IG1vbnRoU2NhbGUgPSBzY2FsZUxpbmVhcigpLnJhbmdlKFswLCB0aGlzLmdXaWR0aF0pLmRvbWFpbihbMCwgbW9udGhMYWJlbHMubGVuZ3RoXSk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtbW9udGgnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1tb250aCcpXG4gICAgICAuZGF0YShtb250aExhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1tb250aCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBNb21lbnQpID0+IGQuZm9ybWF0KCdNTU0nKSlcbiAgICAgIC5hdHRyKCd4JywgKGQ6IE1vbWVudCwgaTogbnVtYmVyKSA9PiBtb250aFNjYWxlKGkpICsgKG1vbnRoU2NhbGUoaSkgLSBtb250aFNjYWxlKGkgLSAxKSkgLyAyKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIpXG4gICAgICAub24oJ21vdXNlZW50ZXInLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gbW9tZW50KGQpO1xuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGRhdGE6IERhdHVtKSA9PiBtb21lbnQoZGF0YS5kYXRlKS5pc1NhbWUoc2VsZWN0ZWRNb250aCwgJ21vbnRoJykgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBtb250aCBkYXRhXG4gICAgICAgIGNvbnN0IG1vbnRoRGF0YSA9IHRoaXMuX2RhdGEuZmlsdGVyKChlOiBEYXR1bSkgPT4gZS5kYXRlLmlzQmV0d2VlbihcbiAgICAgICAgICBtb21lbnQoZCkuc3RhcnRPZignbW9udGgnKSxcbiAgICAgICAgICBtb21lbnQoZCkuZW5kT2YoJ21vbnRoJyksXG4gICAgICAgICAgbnVsbCwgJ1tdJ1xuICAgICAgICApKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJhbnNpdGlvbiBpZiB0aGVyZSBpcyBubyBkYXRhIHRvIHNob3dcbiAgICAgICAgaWYgKCFtb250aERhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBtb250aCB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtkYXRlOiBkfTtcbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHllYXIgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlWWVhck92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdtb250aCc7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB9KTtcblxuICAgIC8vIEFkZCBkYXkgbGFiZWxzXG4gICAgY29uc3QgZGF5TGFiZWxzOiBEYXRlW10gPSB0aW1lRGF5cyhcbiAgICAgIG1vbWVudC51dGMoKS5zdGFydE9mKCd3ZWVrJykudG9EYXRlKCksXG4gICAgICBtb21lbnQudXRjKCkuZW5kT2YoJ3dlZWsnKS50b0RhdGUoKVxuICAgICk7XG4gICAgY29uc3QgZGF5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdIZWlnaHRdKVxuICAgICAgLmRvbWFpbihkYXlMYWJlbHMubWFwKChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLndlZWtkYXkoKS50b1N0cmluZygpKSk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JylcbiAgICAgIC5kYXRhKGRheUxhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1kYXknKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDMpXG4gICAgICAuYXR0cigneScsIChkOiBEYXRlLCBpOiBudW1iZXIpID0+IGRheVNjYWxlKGkudG9TdHJpbmcoKSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZGF0YTogRGF0dW0pID0+IChtb21lbnQoZGF0YS5kYXRlKS5kYXkoKSA9PT0gc2VsZWN0ZWREYXkuZGF5KCkpID8gMSA6IDAuMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIGRyYXdNb250aE92ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhlIG1vbnRoXG4gICAgY29uc3Qgc3RhcnRPZk1vbnRoOiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCdtb250aCcpO1xuICAgIGNvbnN0IGVuZE9mTW9udGg6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCdtb250aCcpO1xuICAgIC8vIEZpbHRlciBkYXRhIGRvd24gdG8gdGhlIHNlbGVjdGVkIG1vbnRoXG4gICAgbGV0IG1vbnRoRGF0YTogRGF0dW1bXSA9IFtdO1xuICAgIHRoaXMuX2RhdGEuZmlsdGVyKChkYXRhOiBEYXR1bSkgPT4gZGF0YS5kYXRlLmlzQmV0d2VlbihzdGFydE9mTW9udGgsIGVuZE9mTW9udGgsIG51bGwsICdbXScpKVxuICAgICAgLm1hcCgoZDogRGF0dW0pID0+IHtcbiAgICAgICAgY29uc3Qgc2NhbGU6IERhdHVtW10gPSBbXTtcbiAgICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0ZTogTW9tZW50ID0gbW9tZW50LnV0YyhkZXQuZGF0ZSk7XG4gICAgICAgICAgY29uc3QgaSA9IE1hdGguZmxvb3IoZGF0ZS5ob3VycygpIC8gMyk7XG4gICAgICAgICAgaWYgKCFzY2FsZVtpXSkge1xuICAgICAgICAgICAgc2NhbGVbaV0gPSB7XG4gICAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgICAgZGV0YWlsczogW10sXG4gICAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgICAgc2NhbGVbaV0uZGV0YWlscy5wdXNoKGRldCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzY2FsZS5mb3JFYWNoKChzOiBEYXR1bSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KHMuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhncm91cCkuZm9yRWFjaCgoazogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBzLnN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgICAgIHRvdGFsOiBzdW0oZ3JvdXBba10sIChkYXRhOiBhbnkpID0+IGRhdGEudG90YWwpLFxuICAgICAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgbW9udGhEYXRhID0gbW9udGhEYXRhLmNvbmNhdChzY2FsZSk7XG4gICAgICB9KTtcbiAgICBtb250aERhdGEgPSBHVFNMaWIuY2xlYW5BcnJheShtb250aERhdGEpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd01vbnRoT3ZlcnZpZXcnXSwgW3RoaXMub3ZlcnZpZXcsIHRoaXMuc2VsZWN0ZWQsIG1vbnRoRGF0YV0pO1xuICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSBtYXgobW9udGhEYXRhLCAoZDogYW55KSA9PiBkLnRvdGFsKTtcbiAgICAvLyBEZWZpbmUgZGF5IGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IGRheUxhYmVsczogRGF0ZVtdID0gdGltZURheXMoXG4gICAgICBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd3ZWVrJykudG9EYXRlKCksXG4gICAgICBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignd2VlaycpLnRvRGF0ZSgpXG4gICAgKTtcbiAgICBjb25zdCBkYXlTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5sYWJlbFBhZGRpbmcsIHRoaXMuZ0hlaWdodF0pXG4gICAgICAuZG9tYWluKGRheUxhYmVscy5tYXAoKGQ6IERhdGUpID0+IG1vbWVudC51dGMoZCkud2Vla2RheSgpLnRvU3RyaW5nKCkpKTtcblxuICAgIC8vIERlZmluZSB3ZWVrIGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IHdlZWtMYWJlbHM6IE1vbWVudFtdID0gW3N0YXJ0T2ZNb250aF07XG4gICAgY29uc3QgaW5jV2VlayA9IG1vbWVudChzdGFydE9mTW9udGgpO1xuICAgIHdoaWxlIChpbmNXZWVrLndlZWsoKSAhPT0gZW5kT2ZNb250aC53ZWVrKCkpIHtcbiAgICAgIHdlZWtMYWJlbHMucHVzaChtb21lbnQoaW5jV2Vlay5hZGQoMSwgJ3dlZWsnKSkpO1xuICAgIH1cbiAgICBtb250aERhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHN1bW1hcnkgPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KGQuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgICAgc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBrLFxuICAgICAgICAgIHRvdGFsOiBncm91cFtrXS5yZWR1Y2UoKGFjYywgbykgPT4gYWNjICsgby52YWx1ZSwgMCksXG4gICAgICAgICAgY29sb3I6IGdyb3VwW2tdWzBdLmNvbG9yLFxuICAgICAgICAgIGlkOiBncm91cFtrXVswXS5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGQuc3VtbWFyeSA9IHN1bW1hcnk7XG4gICAgfSk7XG4gICAgY29uc3Qgd2Vla1NjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nV2lkdGhdKVxuICAgICAgLnBhZGRpbmcoMC4wNSlcbiAgICAgIC5kb21haW4od2Vla0xhYmVscy5tYXAoKHdlZWtkYXkpID0+IHdlZWtkYXkud2VlaygpICsgJycpKTtcbiAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgLnJhbmdlKFt0aGlzLm1pbkNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SLCB0aGlzLm1heENvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SXSlcbiAgICAgIC5kb21haW4oWy0wLjE1ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgLy8gQWRkIG1vbnRoIGRhdGEgaXRlbXMgdG8gdGhlIG92ZXJ2aWV3XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJykucmVtb3ZlKCk7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgIC5kYXRhKG1vbnRoRGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZClcbiAgICAgICAgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YTW9udGgoZCwgc3RhcnRPZk1vbnRoLCB3ZWVrU2NhbGUoZC5kYXRlLndlZWsoKS50b1N0cmluZygpKSlcbiAgICAgICAgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3J4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogRGF0dW0pID0+IChkLnRvdGFsID4gMCkgPyBjb2xvcihkLnRvdGFsKSA6ICd0cmFuc3BhcmVudCcpXG4gICAgICAub24oJ2NsaWNrJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCB0cmFuc2l0aW9uIGlmIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2hvd1xuICAgICAgICBpZiAoZC50b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBkYXRlIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZDtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBtb250aCBvdmVydmlldyByZWxhdGVkIGl0ZW1zIGFuZCBsYWJlbHNcbiAgICAgICAgdGhpcy5yZW1vdmVNb250aE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdkYXknO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb25zdHJ1Y3QgdG9vbHRpcFxuICAgICAgICAvLyBDYWxjdWxhdGUgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgICBsZXQgeCA9IHdlZWtTY2FsZShkLmRhdGUud2VlaygpLnRvU3RyaW5nKCkpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgICAgd2hpbGUgKHRoaXMuZ1dpZHRoIC0geCA8ICh0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAzKSkge1xuICAgICAgICAgIHggLT0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IGRheVNjYWxlKGQuZGF0ZS53ZWVrZGF5KCkudG9TdHJpbmcoKSkgKyB0aGlzLnRvb2x0aXBQYWRkaW5nO1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoKSA9PiAoTWF0aC5jb3MoTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpICsgMSkgKiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5kdXJhdGlvbigoKSA9PiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgLmNhbGwoKHRyYW5zaXRpb246IGFueSwgY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5lbXB0eSgpKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHRyYW5zaXRpb24uZWFjaCgoKSA9PiArK24pLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIS0tbikge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgKCkgPT4gdGhpcy5pblRyYW5zaXRpb24gPSBmYWxzZSk7XG4gICAgLy8gQWRkIHdlZWsgbGFiZWxzXG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKVxuICAgICAgLmRhdGEod2Vla0xhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC13ZWVrJylcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnKVxuICAgICAgLnRleHQoKGQ6IE1vbWVudCkgPT4gJ1dlZWsgJyArIGQud2VlaygpKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogTW9tZW50KSA9PiB3ZWVrU2NhbGUoZC53ZWVrKCkudG9TdHJpbmcoKSkpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsICh3ZWVrZGF5OiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChtb21lbnQoZC5kYXRlKS53ZWVrKCkgPT09IHdlZWtkYXkud2VlaygpKSA/IDEgOiAwLjE7XG4gICAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBtb250aCB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtkYXRlOiBkfTtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCB5ZWFyIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZU1vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ3dlZWsnO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIGRheSBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKVxuICAgICAgLmRhdGEoZGF5TGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLWRheScpXG4gICAgICAuYXR0cigneCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMylcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdGUsIGk6IGFueSkgPT4gZGF5U2NhbGUoaSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkYXRhOiBEYXR1bSkgPT4gKG1vbWVudChkYXRhLmRhdGUpLmRheSgpID09PSBzZWxlY3RlZERheS5kYXkoKSkgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KTtcbiAgICAvLyBBZGQgYnV0dG9uIHRvIHN3aXRjaCBiYWNrIHRvIHByZXZpb3VzIG92ZXJ2aWV3XG4gICAgdGhpcy5kcmF3QnV0dG9uKCk7XG4gIH1cblxuICBkcmF3V2Vla092ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhlIHdlZWtcbiAgICBjb25zdCBzdGFydE9mV2VlazogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignd2VlaycpO1xuICAgIGNvbnN0IGVuZE9mV2VlazogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ3dlZWsnKTtcbiAgICAvLyBGaWx0ZXIgZGF0YSBkb3duIHRvIHRoZSBzZWxlY3RlZCB3ZWVrXG4gICAgbGV0IHdlZWtEYXRhOiBEYXR1bVtdID0gW107XG4gICAgdGhpcy5fZGF0YS5maWx0ZXIoKGQ6IERhdHVtKSA9PiB7XG4gICAgICByZXR1cm4gZC5kYXRlLmlzQmV0d2VlbihzdGFydE9mV2VlaywgZW5kT2ZXZWVrLCBudWxsLCAnW10nKTtcbiAgICB9KS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZTogRGF0dW1bXSA9IFtdO1xuICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGU6IE1vbWVudCA9IG1vbWVudChkZXQuZGF0ZSk7XG4gICAgICAgIGNvbnN0IGkgPSBkYXRlLmhvdXJzKCk7XG4gICAgICAgIGlmICghc2NhbGVbaV0pIHtcbiAgICAgICAgICBzY2FsZVtpXSA9IHtcbiAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgIHNjYWxlW2ldLmRldGFpbHMucHVzaChkZXQpO1xuICAgICAgfSk7XG4gICAgICBzY2FsZS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBCeShzLmRldGFpbHMsICduYW1lJyk7XG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT5cbiAgICAgICAgICBzLnN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBrLFxuICAgICAgICAgICAgdG90YWw6IHN1bShncm91cFtrXSwgKGRhdGE6IGFueSkgPT4gZGF0YS52YWx1ZSksXG4gICAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3JcbiAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICAgIHdlZWtEYXRhID0gd2Vla0RhdGEuY29uY2F0KHNjYWxlKTtcbiAgICB9KTtcbiAgICB3ZWVrRGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KHdlZWtEYXRhKTtcbiAgICBjb25zdCBtYXhWYWx1ZTogbnVtYmVyID0gbWF4KHdlZWtEYXRhLCAoZDogRGF0dW0pID0+IGQudG90YWwpO1xuICAgIC8vIERlZmluZSBkYXkgbGFiZWxzIGFuZCBheGlzXG4gICAgY29uc3QgZGF5TGFiZWxzID0gdGltZURheXMobW9tZW50LnV0YygpLnN0YXJ0T2YoJ3dlZWsnKS50b0RhdGUoKSwgbW9tZW50LnV0YygpLmVuZE9mKCd3ZWVrJykudG9EYXRlKCkpO1xuICAgIGNvbnN0IGRheVNjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nSGVpZ2h0XSlcbiAgICAgIC5kb21haW4oZGF5TGFiZWxzLm1hcCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS53ZWVrZGF5KCkudG9TdHJpbmcoKSkpO1xuICAgIC8vIERlZmluZSBob3VycyBsYWJlbHMgYW5kIGF4aXNcbiAgICBjb25zdCBob3Vyc0xhYmVsczogc3RyaW5nW10gPSBbXTtcbiAgICByYW5nZSgwLCAyNCkuZm9yRWFjaChoID0+IGhvdXJzTGFiZWxzLnB1c2gobW9tZW50LnV0YygpLmhvdXJzKGgpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpKTtcbiAgICBjb25zdCBob3VyU2NhbGUgPSBzY2FsZUJhbmQoKS5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nV2lkdGhdKS5wYWRkaW5nKDAuMDEpLmRvbWFpbihob3Vyc0xhYmVscyk7XG4gICAgY29uc3QgY29sb3IgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgIC5yYW5nZShbdGhpcy5taW5Db2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUiwgdGhpcy5tYXhDb2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUl0pXG4gICAgICAuZG9tYWluKFstMC4xNSAqIG1heFZhbHVlLCBtYXhWYWx1ZV0pO1xuICAgIC8vIEFkZCB3ZWVrIGRhdGEgaXRlbXMgdG8gdGhlIG92ZXJ2aWV3XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpXG4gICAgICAuZGF0YSh3ZWVrRGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cignY2xhc3MnLCAnaXRlbSBpdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgLmF0dHIoJ3knLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1ZKGQpXG4gICAgICAgICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgIC5hdHRyKCd4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmd1dHRlclxuICAgICAgICArIGhvdXJTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigncngnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdyeScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkOiBEYXR1bSkgPT4gKGQudG90YWwgPiAwKSA/IGNvbG9yKGQudG90YWwpIDogJ3RyYW5zcGFyZW50JylcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgdGhlcmUgaXMgbm8gZGF0YSB0byBzaG93XG4gICAgICAgIGlmIChkLnRvdGFsID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIGRhdGUgdG8gdGhlIG9uZSBjbGlja2VkIG9uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHdlZWsgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlV2Vla092ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdkYXknO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSkub24oJ21vdXNlb3ZlcicsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBsZXQgeCA9IGhvdXJTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICB3aGlsZSAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDMpKSB7XG4gICAgICAgIHggLT0gMTA7XG4gICAgICB9XG4gICAgICBjb25zdCB5ID0gZGF5U2NhbGUoZC5kYXRlLndlZWtkYXkoKS50b1N0cmluZygpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgIHRoaXMudG9vbHRpcC5odG1sKHRoaXMuZ2V0VG9vbHRpcChkKSlcbiAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcblxuICAgIC8vIEFkZCB3ZWVrIGxhYmVsc1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC13ZWVrJylcbiAgICAgIC5kYXRhKGhvdXJzTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXdlZWsnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogc3RyaW5nKSA9PiBkKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogc3RyaW5nKSA9PiBob3VyU2NhbGUoZCkpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChob3VyOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IERhdHVtKSA9PiAobW9tZW50KGQuZGF0ZSkuc3RhcnRPZignaG91cicpLmZvcm1hdCgnSEg6bW0nKSA9PT0gaG91cikgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBkYXkgbGFiZWxzXG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JylcbiAgICAgIC5kYXRhKGRheUxhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1kYXknKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDMpXG4gICAgICAuYXR0cigneScsIChkOiBEYXRlLCBpOiBudW1iZXIpID0+IGRheVNjYWxlKGkudG9TdHJpbmcoKSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGRhdGE6IERhdHVtKSA9PiAobW9tZW50KGRhdGEuZGF0ZSkuZGF5KCkgPT09IHNlbGVjdGVkRGF5LmRheSgpKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG5cbiAgICAvLyBBZGQgYnV0dG9uIHRvIHN3aXRjaCBiYWNrIHRvIHByZXZpb3VzIG92ZXJ2aWV3XG4gICAgdGhpcy5kcmF3QnV0dG9uKCk7XG4gIH1cblxuICBkcmF3RGF5T3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgc2VsZWN0ZWQgZGF0ZSB0byB0b2RheSBpZiBpdCB3YXMgbm90IHNldFxuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zZWxlY3RlZCkubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBjb25zdCBzdGFydE9mRGF5OiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCdkYXknKTtcbiAgICBjb25zdCBlbmRPZkRheTogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ2RheScpO1xuICAgIC8vIEZpbHRlciBkYXRhIGRvd24gdG8gdGhlIHNlbGVjdGVkIG1vbnRoXG4gICAgbGV0IGRheURhdGE6IERhdHVtW10gPSBbXTtcbiAgICB0aGlzLl9kYXRhLmZpbHRlcigoZDogRGF0dW0pID0+IHtcbiAgICAgIHJldHVybiBkLmRhdGUuaXNCZXR3ZWVuKHN0YXJ0T2ZEYXksIGVuZE9mRGF5LCBudWxsLCAnW10nKTtcbiAgICB9KS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZSA9IFtdO1xuICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGU6IE1vbWVudCA9IG1vbWVudChkZXQuZGF0ZSk7XG4gICAgICAgIGNvbnN0IGkgPSBkYXRlLmhvdXJzKCk7XG4gICAgICAgIGlmICghc2NhbGVbaV0pIHtcbiAgICAgICAgICBzY2FsZVtpXSA9IHtcbiAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgIHNjYWxlW2ldLmRldGFpbHMucHVzaChkZXQpO1xuICAgICAgfSk7XG4gICAgICBzY2FsZS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBCeShzLmRldGFpbHMsICduYW1lJyk7XG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgIHMuc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgICB0b3RhbDogc3VtKGdyb3VwW2tdLCAoaXRlbTogYW55KSA9PiBpdGVtLnZhbHVlKSxcbiAgICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGF5RGF0YSA9IGRheURhdGEuY29uY2F0KHNjYWxlKTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBTdW1tYXJ5W10gPSBbXTtcbiAgICBkYXlEYXRhLmZvckVhY2goKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBkYXRlID0gZC5kYXRlO1xuICAgICAgZC5zdW1tYXJ5LmZvckVhY2goKHM6IFN1bW1hcnkpID0+IHtcbiAgICAgICAgcy5kYXRlID0gZGF0ZTtcbiAgICAgICAgZGF0YS5wdXNoKHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGF5RGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KGRheURhdGEpO1xuICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSBtYXgoZGF0YSwgKGQ6IFN1bW1hcnkpID0+IGQudG90YWwpO1xuICAgIGNvbnN0IGd0c05hbWVzID0gdGhpcy5zZWxlY3RlZC5zdW1tYXJ5Lm1hcCgoc3VtbWFyeTogU3VtbWFyeSkgPT4gc3VtbWFyeS5uYW1lKTtcbiAgICBjb25zdCBndHNOYW1lU2NhbGUgPSBzY2FsZUJhbmQoKS5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nSGVpZ2h0XSkuZG9tYWluKGd0c05hbWVzKTtcbiAgICBjb25zdCBob3VyTGFiZWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHJhbmdlKDAsIDI0KS5mb3JFYWNoKGggPT4gaG91ckxhYmVscy5wdXNoKG1vbWVudC51dGMoKS5ob3VycyhoKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSk7XG4gICAgY29uc3QgZGF5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdXaWR0aF0pXG4gICAgICAucGFkZGluZygwLjAxKVxuICAgICAgLmRvbWFpbihob3VyTGFiZWxzKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgLmRhdGEoZGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpdGVtIGl0ZW0tYmxvY2snKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5ndXR0ZXJcbiAgICAgICAgKyBkYXlTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigneScsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIHJldHVybiAoZ3RzTmFtZVNjYWxlKGQubmFtZSkgfHwgMSkgLSAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdyeCcsIChkOiBTdW1tYXJ5KSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IFN1bW1hcnkpID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogU3VtbWFyeSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgICAgIC5yYW5nZShbJyNmZmZmZmYnLCBkLmNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SXSlcbiAgICAgICAgICAuZG9tYWluKFstMC41ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgICAgIHJldHVybiBjb2xvcihkLnRvdGFsKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZDogU3VtbWFyeSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvb2x0aXAgcG9zaXRpb25cbiAgICAgICAgbGV0IHggPSBkYXlTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAgIHdoaWxlICh0aGlzLmdXaWR0aCAtIHggPCAodGhpcy50b29sdGlwV2lkdGggKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMykpIHtcbiAgICAgICAgICB4IC09IDEwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSBndHNOYW1lU2NhbGUoZC5uYW1lKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgICB0aGlzLnRvb2x0aXAuaHRtbCh0aGlzLmdldFRvb2x0aXAoZCkpXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZXIuZW1pdChkKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoKSA9PiAoTWF0aC5jb3MoTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpICsgMSkgKiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5kdXJhdGlvbigoKSA9PiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgLmNhbGwoKHRyYW5zaXRpb246IGFueSwgY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5lbXB0eSgpKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHRyYW5zaXRpb24uZWFjaCgoKSA9PiArK24pLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIS0tbikge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgKCkgPT4gdGhpcy5pblRyYW5zaXRpb24gPSBmYWxzZSk7XG5cbiAgICAvLyBBZGQgdGltZSBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC10aW1lJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtdGltZScpXG4gICAgICAuZGF0YShob3VyTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXRpbWUnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogc3RyaW5nKSA9PiBkKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogc3RyaW5nKSA9PiBkYXlTY2FsZShkKSlcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAyKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBjb25zdCBzZWxlY3RlZCA9IGl0ZW1TY2FsZShtb21lbnQudXRjKGQpKTtcbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGl0ZW06IGFueSkgPT4gKGl0ZW0uZGF0ZS5mb3JtYXQoJ0hIOm1tJykgPT09IHNlbGVjdGVkKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBwcm9qZWN0IGxhYmVsc1xuICAgIGNvbnN0IGxhYmVsUGFkZGluZyA9IHRoaXMubGFiZWxQYWRkaW5nO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXByb2plY3QnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1wcm9qZWN0JylcbiAgICAgIC5kYXRhKGd0c05hbWVzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXByb2plY3QnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmd1dHRlcilcbiAgICAgIC5hdHRyKCd5JywgKGQ6IHN0cmluZykgPT4gZ3RzTmFtZVNjYWxlKGQpICsgdGhpcy5pdGVtU2l6ZSAvIDIpXG4gICAgICAuYXR0cignbWluLWhlaWdodCcsICgpID0+IGd0c05hbWVTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbGVmdCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBzdHJpbmcpID0+IGQpXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gc2VsZWN0KHRoaXMpO1xuICAgICAgICBsZXQgdGV4dExlbmd0aCA9IG9iai5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk7XG4gICAgICAgIGxldCB0ZXh0ID0gb2JqLnRleHQoKTtcbiAgICAgICAgd2hpbGUgKHRleHRMZW5ndGggPiAobGFiZWxQYWRkaW5nICogMS41KSAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgb2JqLnRleHQodGV4dCArICcuLi4nKTtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gb2JqLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChndHNOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkOiBTdW1tYXJ5KSA9PiAoZC5uYW1lID09PSBndHNOYW1lKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY0l0ZW1YKGQ6IERhdHVtLCBzdGFydE9mWWVhcjogTW9tZW50KSB7XG4gICAgY29uc3QgZGF5SW5kZXggPSBNYXRoLnJvdW5kKCgrbW9tZW50KGQuZGF0ZSkgLSArc3RhcnRPZlllYXIuc3RhcnRPZignd2VlaycpKSAvIDg2NDAwMDAwKTtcbiAgICBjb25zdCBjb2xJbmRleCA9IE1hdGgudHJ1bmMoZGF5SW5kZXggLyA3KTtcbiAgICByZXR1cm4gY29sSW5kZXggKiAodGhpcy5pdGVtU2l6ZSArIHRoaXMuZ3V0dGVyKSArIHRoaXMubGFiZWxQYWRkaW5nO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVhNb250aChkOiBEYXR1bSwgc3RhcnQ6IE1vbWVudCwgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICBjb25zdCBob3VySW5kZXggPSBtb21lbnQoZC5kYXRlKS5ob3VycygpO1xuICAgIGNvbnN0IGNvbEluZGV4ID0gTWF0aC50cnVuYyhob3VySW5kZXggLyAzKTtcbiAgICByZXR1cm4gY29sSW5kZXggKiAodGhpcy5pdGVtU2l6ZSArIHRoaXMuZ3V0dGVyKSArIG9mZnNldDtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY0l0ZW1ZKGQ6IERhdHVtKSB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxQYWRkaW5nICsgZC5kYXRlLndlZWtkYXkoKSAqICh0aGlzLml0ZW1TaXplICsgdGhpcy5ndXR0ZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVNpemUoZDogRGF0dW0gfCBTdW1tYXJ5LCBtOiBudW1iZXIpIHtcbiAgICBpZiAobSA8PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtU2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXRlbVNpemUgKiAwLjc1ICsgKHRoaXMuaXRlbVNpemUgKiBkLnRvdGFsIC8gbSkgKiAwLjI1O1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3QnV0dG9uKCkge1xuICAgIHRoaXMuYnV0dG9ucy5zZWxlY3RBbGwoJy5idXR0b24nKS5yZW1vdmUoKTtcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1dHRvbnMuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24gYnV0dG9uLWJhY2snKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgdHJhbnNpdGlvbiBib29sZWFuXG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGNhbnZhcyBmcm9tIHdoaWNoZXZlciBvdmVydmlldyB0eXBlIHdhcyBvblxuICAgICAgICBpZiAodGhpcy5vdmVydmlldyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVZZWFyT3ZlcnZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAnbW9udGgnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVNb250aE92ZXJ2aWV3KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vdmVydmlldyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVXZWVrT3ZlcnZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAnZGF5Jykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRGF5T3ZlcnZpZXcoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZWRyYXcgdGhlIGNoYXJ0XG4gICAgICAgIHRoaXMuaGlzdG9yeS5wb3AoKTtcbiAgICAgICAgdGhpcy5vdmVydmlldyA9IHRoaXMuaGlzdG9yeS5wb3AoKTtcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pO1xuICAgIGJ1dHRvbi5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cignY3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuMjUpXG4gICAgICAuYXR0cignY3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuNSlcbiAgICAgIC5hdHRyKCdyJywgdGhpcy5pdGVtU2l6ZSAvIDIpO1xuICAgIGJ1dHRvbi5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuMjUpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMi41KVxuICAgICAgLmF0dHIoJ2R5JywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdXaWR0aCAvIDEwMCkgLyAzO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnO1xuICAgICAgfSlcbiAgICAgIC5odG1sKCcmI3gyMTkwOycpO1xuICAgIGJ1dHRvbi50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlR2xvYmFsT3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwteWVhcicpLnJlbW92ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVZZWFyT3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1tb250aCcpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlTW9udGhPdmVydmlldygpIHtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2stbW9udGgnKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlV2Vla092ZXJ2aWV3KCkge1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogYW55LCBpOiBudW1iZXIpID0+IChpICUgMiA9PT0gMCkgPyAtdGhpcy5nV2lkdGggLyAzIDogdGhpcy5nV2lkdGggLyAzKVxuICAgICAgLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLWRheScpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmhpZGVCYWNrQnV0dG9uKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZURheU92ZXJ2aWV3KCkge1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCd4JywgKGQ6IGFueSwgaTogbnVtYmVyKSA9PiAoaSAlIDIgPT09IDApID8gLXRoaXMuZ1dpZHRoIC8gMyA6IHRoaXMuZ1dpZHRoIC8gMylcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC10aW1lJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtcHJvamVjdCcpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRvb2x0aXAoKSB7XG4gICAgdGhpcy50b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gaGlkZSB0aGUgYmFjayBidXR0b25cbiAgICovXG4gIHByaXZhdGUgaGlkZUJhY2tCdXR0b24oKSB7XG4gICAgdGhpcy5idXR0b25zLnNlbGVjdEFsbCgnLmJ1dHRvbicpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9vbHRpcCA9IChkOiBhbnkpID0+IHtcbiAgICBsZXQgdG9vbHRpcEh0bWwgPSAnPGRpdiBjbGFzcz1cImhlYWRlclwiPjxzdHJvbmc+JyArIGQuZGF0ZS5mb3JtYXQoJ2RkZGQsIE1NTSBEbyBZWVlZIEhIOm1tJykgKyAnPC9zdHJvbmc+PC9kaXY+PHVsPic7XG4gICAgKGQuc3VtbWFyeSB8fCBbXSkuZm9yRWFjaChzID0+IHtcbiAgICAgIHRvb2x0aXBIdG1sICs9IGA8bGk+XG4gIDxkaXYgY2xhc3M9XCJyb3VuZFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjoke0NvbG9yTGliLnRyYW5zcGFyZW50aXplKHMuY29sb3IpfTsgYm9yZGVyLWNvbG9yOiR7cy5jb2xvcn1cIj48L2Rpdj5cbiR7R1RTTGliLmZvcm1hdExhYmVsKHMubmFtZSl9OiAke3MudG90YWx9PC9saT5gO1xuICAgIH0pO1xuICAgIGlmIChkLnRvdGFsICE9PSB1bmRlZmluZWQgJiYgZC5uYW1lKSB7XG4gICAgICB0b29sdGlwSHRtbCArPSBgPGxpPjxkaXYgY2xhc3M9XCJyb3VuZFwiXG5zdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICR7Q29sb3JMaWIudHJhbnNwYXJlbnRpemUoZC5jb2xvcil9OyBib3JkZXItY29sb3I6ICR7ZC5jb2xvcn1cIlxuPjwvZGl2PiAke0dUU0xpYi5mb3JtYXRMYWJlbChkLm5hbWUpfTogJHtkLnRvdGFsfTwvbGk+YDtcbiAgICB9XG4gICAgdG9vbHRpcEh0bWwgKz0gJzwvdWw+JztcbiAgICByZXR1cm4gdG9vbHRpcEh0bWw7XG4gIH1cbn1cbiJdfQ==