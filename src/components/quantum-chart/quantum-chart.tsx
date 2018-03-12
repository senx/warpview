import Chart from 'chart.js';
import {Component, Prop, Element, Watch} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-chart',
  styleUrl: 'quantum-chart.css',
  shadow: true
})
export class QuantumChart extends GTSLib {
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;

  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Element() el: HTMLElement;

  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.data = newValue;
      this.drawChart();
    }
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let data = JSON.parse(this.data);
    if (!data) return;
    let gts = this.gtsToData(data);
    new Chart(ctx, {
      type: this.type,
      data: {
        labels: gts.ticks,
        datasets: gts.datasets
      },
      options: {
        /*  tooltips: {

              enabled: false,

              custom: function(tooltipModel) {
                  // Tooltip Element
                  var tooltipEl = document.getElementById('chartjs-tooltip');

                  // Create element on first render
                  if (!tooltipEl) {
                      tooltipEl = document.createElement('div');
                      tooltipEl.id = 'chartjs-tooltip';
                      tooltipEl.innerHTML = "<table></table>";
                      document.body.appendChild(tooltipEl);
                  }

                  // Hide if no tooltip
                  if (tooltipModel.opacity === 0) {
                      tooltipEl.style.opacity = '0';
                      return;
                  }

                  // Set caret Position
                  tooltipEl.classList.remove('above', 'below', 'no-transform');
                  if (tooltipModel.yAlign) {
                      tooltipEl.classList.add(tooltipModel.yAlign);
                  } else {
                      tooltipEl.classList.add('no-transform');
                  }

                  function getBody(bodyItem) {
                      return bodyItem.lines;
                  }

                  // Set Text
                  if (tooltipModel.body) {
                      var titleLines = tooltipModel.title || [];
                      var bodyLines = tooltipModel.body.map(getBody);

                      var innerHtml = '<thead>';

                      titleLines.forEach(function(title) {
                          innerHtml += '<tr><th>' + title + '</th></tr>';
                      });
                      innerHtml += '</thead><tbody>';

                      bodyLines.forEach(function(body, i) {
                          var colors = tooltipModel.labelColors[i];
                          var style = 'background:' + colors.backgroundColor;
                          style += '; border-color:' + colors.borderColor;
                          style += '; border-width: 2px';
                          var span = '<span style="' + style + '"></span>';
                          innerHtml += '<tr><td>' + span + body + '</td></tr>';
                      });
                      innerHtml += '</tbody>';

                      var tableRoot = tooltipEl.querySelector('table');
                      tableRoot.innerHTML = innerHtml;
                  }

                  // `this` will be the overall tooltip
                  var position = this._chart.canvas.getBoundingClientRect();

                  // Display, position, and set styles for font
                  tooltipEl.style.opacity = '1';
                  tooltipEl.style.position = 'absolute';
                  tooltipEl.style.left =  position.x + 'px';
                  tooltipEl.style.bottom = position.y + 'px';
                  tooltipEl.style.backgroundColor = 'rgba(0,0,0,0.5)'
                  tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                  tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                  tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                  tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              }
          },*/

        tooltips: {
          mode: 'index',
          position: 'nearest'
        },
        scales: {
          xAxes: [{
            type: 'time',
            /*	distribution: 'series',
                ticks: {
                    source: 'labels'
                }*/
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.unit
            }
          }]
        },
        responsive: this.responsive
      }
    });
  }

  componentDidLoad() {
    this.drawChart()
  }

  render() {
    return (
      <div>
        <h1>{this.chartTitle}</h1>
        <canvas id="myChart" width="400" height="400"/>
      </div>
    );
  }
}
