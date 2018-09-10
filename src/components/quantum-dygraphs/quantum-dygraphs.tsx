import {Component, Element, Event, EventEmitter, Prop, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';
import Dygraph from 'dygraphs';

/**
 * options :
 *  gridLineColor: 'red | #fff'
 *  time.timeMode: 'timestamp | date'
 *  showRangeSelector: boolean
 *  type : 'line | area | step'
 *
 */
@Component({
  tag: 'quantum-dygraphs',
  styleUrls: ['../../../node_modules/dygraphs/dist/dygraph.min.css', 'quantum-dygraphs.scss'],
  shadow: false
})
export class QuantumDygraphs {
  @Prop() data: string = '[]';
  @Prop() options: string = '{}';
  @Prop() hiddenData: string = '[]';
  @Prop() theme: string = 'light';
  @Prop() unit: string = '';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() standalone = true;

  @Element() el: HTMLElement;
  @Event() receivedData: EventEmitter;
  @Event() boundsDidChange: EventEmitter;
  @Event() pointHover: EventEmitter;

  private static DEFAULT_WIDTH = 800;
  private static DEFAULT_HEIGHT = 600;

  private _chart: any;
  private _option: any = {
    time: {timeMode: 'date'},
    showRangeSelector: true,
    type: 'line'
  };
  private _data: any;

  @Watch('hiddenData')
  hideData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  @Watch('data')
  onData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  @Watch('theme')
  onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawChart();
    }
  }

  @Watch('options')
  changeScale(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this._option = JSON.parse(newValue);
      this.drawChart();
    }
  }

  private gtsToData(gts) {
    const datasets = [];
    const data = {};
    let pos = 0;
    let i = 0;
    let labels = [];
    let colors = [];
    const hiddenData = JSON.parse(this.hiddenData);
    if (!gts) {
      return;
    } else
      gts.forEach(d => {
        if (d.gts) {
          d.gts = GTSLib.flatDeep(d.gts);
          labels = new Array(d.gts.length);
          labels[0] = 'Date';
          colors = new Array(d.gts.length);
          d.gts.forEach(g => {
            if (g.v && GTSLib.isGtsToPlot(g)) {
              let label = GTSLib.serializeGtsMetadata(g);
              if (hiddenData.filter((i) => i === label).length === 0) {
                GTSLib.gtsSort(g);
                g.v.forEach(value => {
                  if (!data[value[0]]) {
                    data[value[0]] = new Array(d.gts.length);
                    data[value[0]].fill(null);
                  }
                  data[value[0]][i] = value[value.length - 1];
                });
                let color = GTSLib.getColor(pos);
                if (d.params && d.params[i] && d.params[i].color) {
                  color = d.params[i].color;
                }
                if (d.params && d.params[i] && d.params[i].key) {
                  label = d.params[i].key;
                }
                labels[i + 1] = label;
                colors[i] = color;
                i++;
              }
            }
            pos++;
          });
        }
      });
    labels = labels.filter((i) => !!i);
    Object.keys(data).forEach(timestamp => {
      if (this._option.time && this._option.time.timeMode === 'timestamp') {
        datasets.push([parseInt(timestamp)].concat(data[timestamp].slice(0, labels.length - 1)));
      } else {
        datasets.push([new Date(parseInt(timestamp) / 100)].concat(data[timestamp].slice(0, labels.length - 1)));
      }
    });
    datasets.sort((a, b) => a[0] > b[0] ? 1 : -1);
    return {datasets: datasets, labels: labels, colors: colors.slice(0, labels.length)};
  }

  private isStepped(): boolean {
    return this._option.type === 'step';
  }

  private isStacked(): boolean {
    return this._option.type === 'area';
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
    const data = JSON.parse(this.data);
    this._data = this.gtsToData(data);
    const chart = this.el.querySelector('#myChart') as HTMLElement;
    if (data.length > 0) {
      const color = this._option.gridLineColor ||  this.theme === 'light' ? '#000000' : '#ffffff';
      this._chart = new Dygraph(
        chart,
        this._data.datasets,
        {
          height: (this.responsive ? this.el.parentElement.clientHeight : QuantumDygraphs.DEFAULT_HEIGHT) - 30,
          width: this.responsive ? this.el.parentElement.clientWidth : QuantumDygraphs.DEFAULT_WIDTH,
          labels: this._data.labels,
          showRoller: false,
          showRangeSelector: this._option.showRangeSelector || true,
          connectSeparatedPoints: true,
          colors: this._data.colors,
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
    this._option = JSON.parse(this.options);
    this.drawChart();
  }

  render() {
    return <div class={this.theme}>
      <h1>{this.chartTitle}</h1>
      <div id="myChart" class={this.theme}/>
    </div>;
  }
}
