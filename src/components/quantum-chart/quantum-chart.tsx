import {Component, Element, Event, EventEmitter, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import Dygraph from 'dygraphs';
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";
import {ColorLib} from "../../utils/color-lib";
import {Param} from "../../model/param";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";

/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  time.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
@Component({
  tag: 'quantum-chart',
  styleUrls: ['../../../node_modules/dygraphs/dist/dygraph.min.css', 'quantum-chart.scss'],
  shadow: false
})
export class QuantumChart {
  @Prop() data: DataModel | GTS[];
  @Prop() options: Param = {};
  @Prop() hiddenData: string[] = [];
  @Prop() theme: string = 'light';
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() standalone = true;

  @Element() el: HTMLElement;

  @Event() boundsDidChange: EventEmitter;
  @Event() pointHover: EventEmitter;

  private LOG: Logger = new Logger(QuantumChart);
  private static DEFAULT_WIDTH = 800;
  private static DEFAULT_HEIGHT = 600;

  private _chart: any;
  private _options: any = {
    time: 'date',
    showRangeSelector: true,
    gridLineColor: '#8e8e8e'
  };
  private uuid = 'chart-' + ChartLib.guid().split('-').join('');

  @Watch('hiddenData')
  private onHideData(newValue: string[], oldValue: string[]) {
    if (oldValue.length !== newValue.length) {
      this.LOG.debug(['hiddenData'], newValue);
      this.drawChart();
    }
  }

  @Watch('data')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawChart();
    }
  }

  @Watch('theme')
  private onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['theme'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  private gtsToData(gts) {
    this.LOG.debug(['gtsToData'], gts);
    const datasets = [];
    const data = {};
    let pos = 0;
    let i = 0;
    let labels = [];
    let colors = [];
    if (!gts) {
      return;
    } else {
      const gtsList = GTSLib.flatDeep(gts);
      this.LOG.debug(['gtsToData', 'gtsList'], gtsList);
      labels = new Array(gtsList.length);
      labels[0] = 'Date';
      colors = new Array(gtsList.length);
      gtsList.forEach(g => {
        if (g.v && GTSLib.isGtsToPlot(g)) {
          let label = GTSLib.serializeGtsMetadata(g);
          this.LOG.debug(['gtsToData', 'label'], label);
          if (this.hiddenData.filter((i) => i === label).length === 0) {
            GTSLib.gtsSort(g);
            g.v.forEach(value => {
              if (!data[value[0]]) {
                data[value[0]] = new Array(gtsList.length);
                data[value[0]].fill(null);
              }
              data[value[0]][i] = value[value.length - 1];
            });
            let color = ColorLib.getColor(pos);
            labels[i + 1] = label;
            colors[i] = color;
            i++;
          }
        }
        pos++;
      });
    }
    labels = labels.filter((i) => !!i);
    Object.keys(data).forEach(timestamp => {
      if (this._options.timeMode && this._options.timeMode === 'timestamp') {
        datasets.push([parseInt(timestamp)].concat(data[timestamp].slice(0, labels.length - 1)));
      } else {
        const ts = Math.floor(parseInt(timestamp) / 1000);
        datasets.push([new Date(ts)].concat(data[timestamp].slice(0, labels.length - 1)));
      }
    });
    datasets.sort((a, b) => a[0] > b[0] ? 1 : -1);
    this.LOG.debug(['gtsToData', 'datasets'], [datasets, labels, colors]);
    return {datasets: datasets, labels: labels, colors: colors.slice(0, labels.length)};
  }

  private isStepped(): boolean {
    return this.type === 'step';
  }

  private isStacked(): boolean {
    return this.type === 'area';
  }

  private legendFormatter(data) {
    if (data.x === null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      return '<br>' + data.series.map(function (series) {
        if (!series.isVisible) return;
        let labeledData = series.labelHTML + ': ' + series.yHTML;
        if (series.isHighlighted) {
          labeledData = '<b>' + labeledData + '</b>';
        }
        return series.dashHTML + ' ' + labeledData;
      }).join('<br>');
    }

    let html = data.xHTML;
    data.series.forEach(function (series) {
      if (!series.isVisible || !series.yHTML) return;
      let labeledData = series.labelHTML + ': ' + series.yHTML;
      if (series.isHighlighted) {
        labeledData = '<b>' + labeledData + '</b>';
      }
      html += '<br>' + series.dashHTML + ' ' + labeledData;
    });
    return html;
  }

  private highlightCallback(event) {
    this.pointHover.emit({
      x: event.x,
      y: event.y
    });
  }

  private zoomCallback(minDate, maxDate) {
    this.boundsDidChange.emit({
      bounds: {
        min: minDate,
        max: maxDate
      }
    })
  }

  private drawChart() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    let dataList: any[];
    if (this.data instanceof DataModel) {
      dataList = this.data.data
    } else {
      dataList = this.data;
    }
    const dataToplot = this.gtsToData(dataList);

    this.LOG.debug(['drawChart'], [dataToplot]);
    const chart = this.el.querySelector('#' + this.uuid) as HTMLElement;
    if (dataToplot && dataToplot.datasets && dataToplot.datasets.length > 0) {
      const color = this._options.gridLineColor || ChartLib.getGridColor(this.theme);
      this._chart = new Dygraph(
        chart,
        dataToplot.datasets,
        {
          height: (this.responsive ? this.el.parentElement.clientHeight : QuantumChart.DEFAULT_HEIGHT) - 30,
          width: this.responsive ? this.el.parentElement.clientWidth : QuantumChart.DEFAULT_WIDTH,
          labels: dataToplot.labels,
          showRoller: false,
          showRangeSelector: this._options.showRangeSelector || true,
          connectSeparatedPoints: true,
          colors: dataToplot.colors,
          legend: 'follow',
          stackedGraph: this.isStacked(),
          strokeBorderWidth: this.isStacked() ? null : 0,
          strokeWidth: 2,
          stepPlot: this.isStepped(),
          ylabel: this.unit,
          labelsSeparateLines: true,
          highlightSeriesBackgroundAlpha: 1,
          highlightSeriesOpts: {
            strokeWidth: 3,
            strokeBorderWidth: 0,
            highlightCircleSize: 3,
            showInRangeSelector: true
          },
          hideOverlayOnMouseOut: true,
          labelsUTC: true,
          gridLineColor: color,
          axisLineColor: color,
          legendFormatter: this.legendFormatter,
          highlightCallback: this.highlightCallback.bind(this),
          zoomCallback: this.zoomCallback.bind(this),
          axisLabelWidth: this.standalone ? 50 : 94,
          rightGap: this.standalone ? 0 : 20
        }
      );
    }
  }

  componentDidLoad() {
    this.drawChart();
  }

  render() {
    return <div class={this.theme}>
      <h1>{this.chartTitle}</h1>
      <div id={this.uuid} class={'chart ' + this.theme}/>
    </div>;
  }
}
