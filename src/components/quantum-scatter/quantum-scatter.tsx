import Chart from 'chart.js';
import { Component, Prop, Element, Watch } from '@stencil/core';
import { GTSLib } from '../../gts.lib';

@Component({
    tag: 'quantum-scatter',
    styleUrl: 'quantum-scatter.css',
    shadow: true
})
export class QuantumScatter extends GTSLib {
    @Prop() unit: string = '';
    @Prop() type: string = 'line';
    @Prop() chartTitle: string = '';
    @Prop() responsive: boolean = false;

    @Prop() data: string = '[]';
    @Prop() options: object = {};
    @Element() el: HTMLElement;

    @Watch('data')
    redraw(newValue: string, oldValue: string) {
        if(oldValue !== newValue) {
            this.data = newValue;
            this.drawChart();
        }
    }

    drawChart() {
        let ctx = this.el.shadowRoot.querySelector("#myChart");
        let gts = this.gtsToScatter(JSON.parse(this.data));
        new Chart.Scatter(ctx, {
            data: {
                datasets: gts.datasets
            },
            options: {
                responsive: this.responsive,
                tooltips: {
                    mode: 'index',
                    intersect: true,
                },
                scales: {
                    xAxes: [{
                        type: 'time'
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: this.unit
                        }
                    }]
                },
            }
        });
    }

    componentDidLoad() {
        this.drawChart()
    }
    
    render() {
        return <div>
            <h1>{this.chartTitle}</h1>
            <canvas id="myChart" width="400" height="400"/>
        </div>;
    }
}