import { Logger } from "../../utils/logger";
import { ChartLib } from "../../utils/chart-lib";
import moment from 'moment';
import { easeLinear, max, range, scaleBand, scaleLinear, sum, timeDays } from "d3";
import { event, select } from 'd3-selection';
import { ColorLib } from "../../utils/color-lib";
import { Datum } from "./datum";
import { GTSLib } from "../../utils/gts.lib";
export class CalendarHeatmap {
    constructor() {
        this.minColor = CalendarHeatmap.DEF_MIN_COLOR;
        this.maxColor = CalendarHeatmap.DEF_MAX_COLOR;
        this.overview = 'global';
        this.LOG = new Logger(CalendarHeatmap);
        this.gutter = 5;
        this.width = 1000;
        this.height = 200;
        this.item_size = 10;
        this.label_padding = 40;
        this.transition_duration = 250;
        this.in_transition = false;
        this.tooltip_width = 450;
        this.tooltip_padding = 15;
        this.history = ['global'];
        this.selected = new Datum();
        this.uuid = 'spectrum-' + ChartLib.guid().split('-').join('');
        this.parentWidth = -1;
        this.getTooltip = (d) => {
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
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onMinColor(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onMaxColor(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['data'], newValue);
            this.drawChart();
        }
    }
    onResize() {
        if (this.el.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    }
    ;
    static getNumberOfWeeks() {
        const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    }
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
            }
            else {
                this.calculateDimensions();
            }
        }, 250);
    }
    groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
    ;
    updateDataSummary() {
        if (!this.data[0].summary) {
            this.data.map((d) => {
                const summary = d['details'].reduce((uniques, project) => {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
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
    drawGlobalOverview() {
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        const start_period = moment.utc(this.data[0].date.startOf('y'));
        const end_period = moment.utc(this.data[this.data.length - 1].date.endOf('y'));
        const yData = this.data.filter((d) => d.date.isBetween(start_period, end_period, null, '[]'));
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
        const duration = Math.ceil(moment.duration(end_period.diff(start_period)).asYears());
        const scale = [];
        for (let i = 0; i < duration; i++) {
            const d = moment.utc().year(start_period.year() + i).month(0).date(1).startOf('y');
            scale.push(d);
        }
        let year_data = yData.map((d) => {
            const date = d.date;
            return {
                date: date,
                total: yData.reduce((prev, current) => {
                    if (current.date.year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }, 0),
                summary: (() => {
                    const summary = yData.reduce((summary, d) => {
                        if (d.date.year() === date.year()) {
                            for (let i = 0; i < d.summary.length; i++) {
                                if (!summary[d.summary[i].name]) {
                                    summary[d.summary[i].name] = {
                                        total: d.summary[i].total,
                                        color: d.summary[i].color,
                                    };
                                }
                                else {
                                    summary[d.summary[i].name].total += d.summary[i].total;
                                }
                            }
                        }
                        return summary;
                    }, {});
                    const unsorted_summary = Object.keys(summary).map((key) => {
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
        year_data = GTSLib.cleanArray(year_data);
        const max_value = max(year_data, (d) => d.total);
        const year_labels = scale.map((d) => d);
        const yearScale = scaleBand()
            .rangeRound([0, this.width])
            .padding(0.05)
            .domain(year_labels.map((d) => d.year().toString()));
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
            .domain([-0.15 * max_value, max_value]);
        this.items.selectAll('.item-block-year').remove();
        this.items.selectAll('.item-block-year')
            .data(year_data)
            .enter()
            .append('rect')
            .attr('class', 'item item-block-year')
            .attr('width', () => (this.width - this.label_padding) / year_labels.length - this.gutter * 5)
            .attr('height', () => this.height - this.label_padding)
            .attr('transform', (d) => 'translate(' + yearScale(d.date.year().toString()) + ',' + this.tooltip_padding * 2 + ')')
            .attr('fill', (d) => color(d.total) || CalendarHeatmap.DEF_MAX_COLOR)
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            this.in_transition = true;
            this.selected = d;
            this.hideTooltip();
            this.removeGlobalOverview();
            this.overview = 'year';
            this.drawChart();
        })
            .style('opacity', 0)
            .on('mouseover', (d) => {
            if (this.in_transition) {
                return;
            }
            let x = yearScale(d.date.year().toString()) + this.tooltip_padding * 2;
            while (this.width - x < (this.tooltip_width + this.tooltip_padding * 5)) {
                x -= 10;
            }
            const y = this.tooltip_padding * 4;
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
            .delay((d, i) => this.transition_duration * (i + 1) / 10)
            .duration(() => this.transition_duration)
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
        }, () => this.in_transition = false);
        this.labels.selectAll('.label-year').remove();
        this.labels.selectAll('.label-year')
            .data(year_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-year')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => d.year())
            .attr('x', (d) => yearScale(d.year().toString()))
            .attr('y', this.label_padding / 2)
            .on('mouseenter', (year_label) => {
            if (this.in_transition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (d.date.year() === year_label.year()) ? 1 : 0.1);
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
            this.in_transition = true;
            this.selected = year_data[0];
            this.hideTooltip();
            this.removeGlobalOverview();
            this.overview = 'year';
            this.drawChart();
        });
    }
    drawYearOverview() {
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        const start_of_year = moment(this.selected.date).startOf('year');
        const end_of_year = moment(this.selected.date).endOf('year');
        let year_data = this.data.filter((d) => {
            return d.date.isBetween(start_of_year, end_of_year, null, '[]');
        });
        year_data.forEach((d) => {
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
        year_data = GTSLib.cleanArray(year_data);
        const max_value = max(year_data, (d) => d.total);
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
            .domain([-0.15 * max_value, max_value]);
        this.items.selectAll('.item-circle').remove();
        this.items.selectAll('.item-circle')
            .data(year_data)
            .enter()
            .append('rect')
            .attr('class', 'item item-circle').style('opacity', 0)
            .attr('x', (d) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('y', (d) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, max_value))
            .attr('ry', (d) => this.calcItemSize(d, max_value))
            .attr('width', (d) => this.calcItemSize(d, max_value))
            .attr('height', (d) => this.calcItemSize(d, max_value))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            if (d.total === 0) {
                return;
            }
            this.in_transition = true;
            this.selected = d;
            this.hideTooltip();
            this.removeYearOverview();
            this.overview = 'day';
            this.drawChart();
        })
            .on('mouseover', (d) => {
            if (this.in_transition) {
                return;
            }
            const circle = select(event.currentTarget);
            const repeat = () => {
                circle.transition()
                    .duration(this.transition_duration)
                    .ease(easeLinear)
                    .attr('x', (d) => this.calcItemX(d, start_of_year) - (this.item_size * 1.1 - this.item_size) / 2)
                    .attr('y', (d) => this.calcItemY(d) - (this.item_size * 1.1 - this.item_size) / 2)
                    .attr('width', this.item_size * 1.1)
                    .attr('height', this.item_size * 1.1)
                    .transition()
                    .duration(this.transition_duration)
                    .ease(easeLinear)
                    .attr('x', (d) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
                    .attr('y', (d) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
                    .attr('width', (d) => this.calcItemSize(d, max_value))
                    .attr('height', (d) => this.calcItemSize(d, max_value))
                    .on('end', repeat);
            };
            repeat();
            let x = this.calcItemX(d, start_of_year) + this.item_size / 2;
            if (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
                x -= this.tooltip_width + this.tooltip_padding * 2;
            }
            const y = this.calcItemY(d) + this.item_size / 2;
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
            select(event.currentTarget).transition()
                .duration(this.transition_duration / 2)
                .ease(easeLinear)
                .attr('x', (d) => this.calcItemX(d, start_of_year) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
                .attr('y', (d) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
                .attr('width', (d) => this.calcItemSize(d, max_value))
                .attr('height', (d) => this.calcItemSize(d, max_value));
            this.hideTooltip();
        })
            .transition()
            .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
            .duration(() => this.transition_duration)
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
        }, () => this.in_transition = false);
        const duration = Math.ceil(moment.duration(end_of_year.diff(start_of_year)).asMonths());
        const month_labels = [];
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
            .text((d) => d.format('MMM'))
            .attr('x', (d, i) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2)
            .attr('y', this.label_padding / 2)
            .on('mouseenter', (d) => {
            if (this.in_transition) {
                return;
            }
            const selected_month = moment(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1);
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
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            const month_data = this.data.filter((e) => e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]'));
            if (!month_data.length) {
                return;
            }
            this.selected = { date: d };
            this.in_transition = true;
            this.hideTooltip();
            this.removeYearOverview();
            this.overview = 'month';
            this.drawChart();
        });
        const day_labels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.label_padding, this.height])
            .domain(day_labels.map((d) => moment.utc(d).weekday().toString()));
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.in_transition) {
                return;
            }
            const selected_day = moment.utc(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
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
        this.drawButton();
    }
    ;
    drawMonthOverview() {
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        const start_of_month = moment(this.selected.date).startOf('month');
        const end_of_month = moment(this.selected.date).endOf('month');
        let month_data = [];
        this.data.filter((d) => d.date.isBetween(start_of_month, end_of_month, null, '[]'))
            .map((d) => {
            let scale = [];
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
                        total: sum(group[k], (d) => {
                            return d.total;
                        }),
                        color: group[k][0].color
                    });
                });
            });
            month_data = month_data.concat(scale);
        });
        month_data = GTSLib.cleanArray(month_data);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, month_data]);
        const max_value = max(month_data, (d) => d.total);
        const day_labels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.label_padding, this.height])
            .domain(day_labels.map((d) => moment.utc(d).weekday().toString()));
        const week_labels = [start_of_month];
        const incWeek = moment(start_of_month);
        while (incWeek.week() !== end_of_month.week()) {
            week_labels.push(moment(incWeek.add(1, 'week')));
        }
        month_data.forEach((d) => {
            const summary = [];
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((k) => {
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
        const weekScale = scaleBand()
            .rangeRound([this.label_padding, this.width])
            .padding(0.05)
            .domain(week_labels.map((weekday) => weekday.week() + ''));
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
            .domain([-0.15 * max_value, max_value]);
        this.items.selectAll('.item-block-month').remove();
        this.items.selectAll('.item-block-month')
            .data(month_data)
            .enter().append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-month')
            .attr('y', (d) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('x', (d) => this.calcItemXMonth(d, start_of_month, weekScale(d.date.week().toString())) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, max_value))
            .attr('ry', (d) => this.calcItemSize(d, max_value))
            .attr('width', (d) => this.calcItemSize(d, max_value))
            .attr('height', (d) => this.calcItemSize(d, max_value))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            if (d.total === 0) {
                return;
            }
            this.in_transition = true;
            this.selected = d;
            this.hideTooltip();
            this.removeMonthOverview();
            this.overview = 'day';
            this.drawChart();
        })
            .on('mouseover', (d) => {
            if (this.in_transition) {
                return;
            }
            let x = weekScale(d.date.week().toString()) + this.tooltip_padding;
            while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
                x -= 10;
            }
            const y = dayScale(d.date.weekday().toString()) + this.tooltip_padding;
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
        }, () => this.in_transition = false);
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(week_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => 'Week ' + d.week())
            .attr('x', (d) => weekScale(d.week().toString()))
            .attr('y', this.label_padding / 2)
            .on('mouseenter', (weekday) => {
            if (this.in_transition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
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
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            this.in_transition = true;
            this.selected = { date: d };
            this.hideTooltip();
            this.removeMonthOverview();
            this.overview = 'week';
            this.drawChart();
        });
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', (d, i) => dayScale(i) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.in_transition) {
                return;
            }
            const selected_day = moment.utc(d);
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
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
        this.drawButton();
    }
    ;
    drawWeekOverview() {
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        const start_of_week = moment(this.selected.date).startOf('week');
        const end_of_week = moment(this.selected.date).endOf('week');
        let week_data = [];
        this.data.filter((d) => {
            return d.date.isBetween(start_of_week, end_of_week, null, '[]');
        }).map((d) => {
            let scale = [];
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
                        total: sum(group[k], (d) => {
                            return d.value;
                        }),
                        color: group[k][0].color
                    });
                });
            });
            week_data = week_data.concat(scale);
        });
        week_data = GTSLib.cleanArray(week_data);
        const max_value = max(week_data, (d) => d.total);
        const day_labels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        const dayScale = scaleBand()
            .rangeRound([this.label_padding, this.height])
            .domain(day_labels.map((d) => moment.utc(d).weekday().toString()));
        let hours_labels = [];
        range(0, 24).forEach(h => hours_labels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')));
        const hourScale = scaleBand().rangeRound([this.label_padding, this.width]).padding(0.01).domain(hours_labels);
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmap.DEF_MIN_COLOR, this.maxColor || CalendarHeatmap.DEF_MAX_COLOR])
            .domain([-0.15 * max_value, max_value]);
        this.items.selectAll('.item-block-week').remove();
        this.items.selectAll('.item-block-week')
            .data(week_data)
            .enter()
            .append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-week')
            .attr('y', (d) => this.calcItemY(d) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('x', (d) => this.gutter + hourScale(moment(d.date).startOf('hour').format('HH:mm')) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('rx', (d) => this.calcItemSize(d, max_value))
            .attr('ry', (d) => this.calcItemSize(d, max_value))
            .attr('width', (d) => this.calcItemSize(d, max_value))
            .attr('height', (d) => this.calcItemSize(d, max_value))
            .attr('fill', (d) => (d.total > 0) ? color(d.total) : 'transparent')
            .on('click', (d) => {
            if (this.in_transition) {
                return;
            }
            if (d.total === 0) {
                return;
            }
            this.in_transition = true;
            this.selected = d;
            this.hideTooltip();
            this.removeWeekOverview();
            this.overview = 'day';
            this.drawChart();
        }).on('mouseover', (d) => {
            if (this.in_transition) {
                return;
            }
            let x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltip_padding;
            while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
                x -= 10;
            }
            const y = dayScale(d.date.weekday().toString()) + this.tooltip_padding;
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
        }, () => this.in_transition = false);
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(hours_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => d)
            .attr('x', (d) => hourScale(d))
            .attr('y', this.label_padding / 2)
            .on('mouseenter', (hour) => {
            if (this.in_transition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1);
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
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(day_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.label_padding / 3)
            .attr('y', (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75)
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => moment.utc(d).format('dddd')[0])
            .on('mouseenter', (d) => {
            if (this.in_transition) {
                return;
            }
            const selected_day = moment.utc(d);
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (moment(d.date).day() === selected_day.day()) ? 1 : 0.1);
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
        this.drawButton();
    }
    ;
    drawDayOverview() {
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        if (!Object.keys(this.selected).length) {
            this.selected = this.data[this.data.length - 1];
        }
        const start_of_day = moment(this.selected.date).startOf('day');
        const end_of_day = moment(this.selected.date).endOf('day');
        let day_data = [];
        this.data.filter((d) => {
            return d.date.isBetween(start_of_day, end_of_day, null, '[]');
        }).map((d) => {
            let scale = [];
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
                        total: sum(group[k], (d) => {
                            return d.value;
                        }),
                        color: group[k][0].color
                    });
                });
            });
            day_data = day_data.concat(scale);
        });
        const data = [];
        day_data.forEach((d) => {
            const date = d.date;
            d.summary.forEach((s) => {
                s.date = date;
                data.push(s);
            });
        });
        day_data = GTSLib.cleanArray(day_data);
        const max_value = max(data, (d) => d.total);
        const gtsNames = this.selected.summary.map((summary) => summary.name);
        const gtsNameScale = scaleBand().rangeRound([this.label_padding, this.height]).domain(gtsNames);
        let hour_labels = [];
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
            .attr('x', (d) => this.gutter + dayScale(moment(d.date).startOf('hour').format('HH:mm')) + (this.item_size - this.calcItemSize(d, max_value)) / 2)
            .attr('y', (d) => {
            return (gtsNameScale(d.name) || 1) - (this.item_size - this.calcItemSize(d, max_value)) / 2;
        })
            .attr('rx', (d) => this.calcItemSize(d, max_value))
            .attr('ry', (d) => this.calcItemSize(d, max_value))
            .attr('width', (d) => this.calcItemSize(d, max_value))
            .attr('height', (d) => this.calcItemSize(d, max_value))
            .attr('fill', (d) => {
            const color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmap.DEF_MIN_COLOR])
                .domain([-0.5 * max_value, max_value]);
            return color(d.total);
        })
            .style('opacity', 0)
            .on('mouseover', (d) => {
            if (this.in_transition) {
                return;
            }
            let x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltip_padding;
            while (this.width - x < (this.tooltip_width + this.tooltip_padding * 3)) {
                x -= 10;
            }
            const y = gtsNameScale(d.name) + this.tooltip_padding;
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
            .on('click', (d) => {
            if (this.handler) {
                this.handler.emit(d);
            }
        })
            .transition()
            .delay(() => (Math.cos(Math.PI * Math.random()) + 1) * this.transition_duration)
            .duration(() => this.transition_duration)
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
        }, () => this.in_transition = false);
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-time')
            .data(hour_labels)
            .enter()
            .append('text')
            .attr('class', 'label label-time')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => d)
            .attr('x', (d) => dayScale(d))
            .attr('y', this.label_padding / 2)
            .on('mouseenter', (d) => {
            if (this.in_transition) {
                return;
            }
            const selected = d;
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (d.date.format('HH:mm') === selected) ? 1 : 0.1);
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
        const label_padding = this.label_padding;
        this.labels.selectAll('.label-project').remove();
        this.labels.selectAll('.label-project')
            .data(gtsNames)
            .enter()
            .append('text')
            .attr('class', 'label label-project')
            .attr('x', this.gutter)
            .attr('y', (d) => gtsNameScale(d) + this.item_size / 2)
            .attr('min-height', () => gtsNameScale.bandwidth())
            .style('text-anchor', 'left')
            .attr('font-size', () => Math.floor(this.label_padding / 3) + 'px')
            .text((d) => d)
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
            .on('mouseenter', (gtsName) => {
            if (this.in_transition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transition_duration)
                .ease(easeLinear)
                .style('opacity', (d) => (d.name === gtsName) ? 1 : 0.1);
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
        this.drawButton();
    }
    calcItemX(d, start_of_year) {
        const dayIndex = Math.round((+moment(d.date) - +start_of_year.startOf('week')) / 86400000);
        const colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.item_size + this.gutter) + this.label_padding;
    }
    ;
    calcItemXMonth(d, start, offset) {
        const hourIndex = moment(d.date).hours();
        const colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.item_size + this.gutter) + offset;
    }
    ;
    calcItemY(d) {
        return this.label_padding + d.date.weekday() * (this.item_size + this.gutter);
    }
    ;
    calcItemSize(d, max) {
        if (max <= 0) {
            return this.item_size;
        }
        return this.item_size * 0.75 + (this.item_size * d.total / max) * 0.25;
    }
    ;
    drawButton() {
        this.buttons.selectAll('.button').remove();
        const button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', () => {
            if (this.in_transition) {
                return;
            }
            this.in_transition = true;
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
    }
    ;
    removeGlobalOverview() {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    }
    ;
    removeYearOverview() {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    }
    ;
    removeMonthOverview() {
        this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    ;
    removeWeekOverview() {
        this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (d, i) => (i % 2 === 0) ? -this.width / 3 : this.width / 3)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    ;
    removeDayOverview() {
        this.items.selectAll('.item-block')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (d, i) => (i % 2 === 0) ? -this.width / 3 : this.width / 3)
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    }
    ;
    hideTooltip() {
        this.tooltip.transition()
            .duration(this.transition_duration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    }
    ;
    hideBackButton() {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transition_duration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    }
    ;
    componentDidLoad() {
        this.chart = this.el.shadowRoot.querySelector('#' + this.uuid);
        this.svg = select(this.chart).append('svg').attr('class', 'svg');
        this.items = this.svg.append('g');
        this.labels = this.svg.append('g');
        this.buttons = this.svg.append('g');
        this.tooltip = select(this.chart)
            .append('div')
            .attr('class', 'heatmap-tooltip')
            .style('opacity', 0);
        this.calculateDimensions();
    }
    render() {
        return h("div", { id: this.uuid });
    }
    static get is() { return "calendar-heatmap"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "maxColor": {
            "type": String,
            "attr": "max-color",
            "watchCallbacks": ["onMaxColor"]
        },
        "minColor": {
            "type": String,
            "attr": "min-color",
            "watchCallbacks": ["onMinColor"]
        },
        "overview": {
            "type": String,
            "attr": "overview",
            "mutable": true
        }
    }; }
    static get events() { return [{
            "name": "handler",
            "method": "handler",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "onChange",
            "method": "onChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:calendar-heatmap:**/"; }
}
CalendarHeatmap.DEF_MIN_COLOR = '#ffffff';
CalendarHeatmap.DEF_MAX_COLOR = '#333333';
