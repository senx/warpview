import Chart from 'chart.js';
import {Component, Prop, Element, Watch, EventEmitter, Event} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-annotation',
  styleUrl: 'quantum-annotation.scss',
  shadow: true
})
export class QuantumAnnotation {
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() data: string = '[]';
  @Prop() options: object = {};
  @Prop() timeMin: number;
  @Prop() timeMax: number;
  @Prop() width = '';
  @Prop({
    mutable: true
  }) height = '';

  @Event() pointHover: EventEmitter;

  @Element() el: HTMLElement;

  private legendOffset = 70;
  private lineHeight = 5;

  @Watch('data')
  redraw(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.data = newValue;
      this.drawChart();
    }
  }

  drawChart() {
    let ctx = this.el.shadowRoot.querySelector("#myChart");
    let gts = this.gtsToScatter(JSON.parse(this.data));
    console.log(gts.length);
    let calculatedHeight = 30  * gts.length +  this.legendOffset;
    let height = (this.height  || this.height !== '')
      ? (Math.max(calculatedHeight, parseInt(this.height)))
      : (calculatedHeight);
    this.height = height + '';
    console.log('height', this.height, calculatedHeight);
    (ctx as HTMLElement).parentElement.style.height = height + 'px';
    (ctx as HTMLElement).parentElement.style.width = '100%';
    const me = this;
    new Chart.Scatter(ctx, {
      data: {
        datasets: gts
      },
      options: {
        layout: {
          padding: {
            bottom: 30  * gts.length
          }
        },
        legend: {display: this.showLegend},
        responsive: this.responsive,
        tooltips: {
          mode: 'x',
          position: 'nearest',
          custom: function( tooltip ) {
            if( tooltip.opacity > 0 ) {
              me.pointHover.emit({x: tooltip.dataPoints[0].x + 15, y: this._eventPosition.y});
            } else {
              me.pointHover.emit({x: -100, y: this._eventPosition.y});
            }
            return;
          },
          callbacks: {
            title: (tooltipItems, data) => {
              return tooltipItems[0].xLabel || '';
            },
            label:  (tooltipItem, data)  => {
              return `${data.datasets[tooltipItem.datasetIndex].label}: ${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].val}`;
            }
          }
        },
        scales: {
          xAxes: [{
            drawTicks: false,
            type: 'time',
            time: {
              min: this.timeMin,
              max: this.timeMax,
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            drawTicks: false,
            scaleLabel: {
              display: false
            },
            afterFit: function(scaleInstance) {
              scaleInstance.width = 100; // sets the width to 100px
            },
            ticks: {
              min: 0,
              max: 1,
              beginAtZero: true,
              stepSize: 1
            }
          }]
        },
      }
    });
  }

  /**
   *
   * @param {number} w
   * @param {number} h
   * @param {string} color
   * @returns {HTMLImageElement}
   */
  buildImage(w: number, h: number, color: string) {
    const img = new Image(w,h);
    const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" />
</svg>`;
    // 	myImage.src = "ripple.svg"
    img.src = 'data:image/svg+xml;base64,'+ btoa(svg);
    return img;
}

  gtsToScatter(gts) {
    let datasets = [];

    gts.forEach(d => {
      for (let i = 0; i < d.gts.length; i++) {
        let g = d.gts[i];
        let data = [];
        let color = GTSLib.getColor(i);
        const myImage = this.buildImage(1, 30, color);
        g.v.forEach(d => {
          data.push({x: d[0] / 1000, y: 0.5, val: d[d.length - 1]});
        });
        if (d.params && d.params[i] && d.params[i].color) {
          color = d.params[i].color
        }
        let label = `${g.c} - ${JSON.stringify(g.l)}`;
        if (d.params && d.params[i] && d.params[i].key) {
          label = d.params[i].key
        }
        datasets.push({
          label: label,
          data: data,
          pointRadius: 5,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          pointStyle: myImage,
          borderColor: color,
          backgroundColor: GTSLib.transparentize(color, 0.5)
        })
      }
    });
    return datasets;
  }


  componentDidLoad() {
    this.drawChart()
  }

  render() {
    return <div>
      <h1>{this.chartTitle}</h1>
      <div class="chart-container" style={{position: 'relative', width: this.width, height: this.height}}>
        <canvas id="myChart" width={this.width} height={this.height}/>
      </div>
    </div>;
  }
}
