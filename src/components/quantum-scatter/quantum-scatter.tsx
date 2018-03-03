import Chart from 'chart.js';
import { Component, Prop, Element, Watch } from '@stencil/core';
import { GTSLib } from '../../gts.lib';

@Component({
    tag: 'quantum-scatter',
    styleUrl: 'quantum-scatter.css',
    shadow: true
})
export class QuantumScatter extends GTSLib {

    @Prop() data: string = '[]';
    @Prop() unit: string = '';
    @Prop() type: string = 'line';
    @Prop() chartTitle: string = '';
    @Prop() options: object = {};
    @Prop() responsive: boolean = false;
    @Element() el: HTMLElement;

    @Watch('name')
    redraw() {
        this.drawChart();
    }

    drawChart() {
        var ctx = this.el.shadowRoot.querySelector("#myChart");
        var gts = this.gtsToScatter(JSON.parse(this.data));
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
        console.log('The component has been rendered');
        this.drawChart()
    }
    
    render() {
        return (
            <div>
                <h1>{this.chartTitle}</h1>
                <canvas id="myChart" width="400" height="400"></canvas>
            </div>
        );
    }
}