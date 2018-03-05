import {Component, Prop, Element, State} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
    tag: 'quantum-tile',
    styleUrl: 'quantum-tile.css',
    shadow: true
})
export class QuantumTile extends GTSLib {

    warpscript: string = '';
    @State() data: string = '[]';

    @Prop() unit: string = '';
    @Prop() type: string = 'line';
    @Prop() chartTitle: string = '';
    @Prop() responsive: boolean = false;

    @Prop() url: string = '';
    @Element() wsElement: HTMLElement;

    componentDidLoad() {
        this.warpscript = this.wsElement.textContent;
        let me = this;
        fetch(this.url, {method: 'POST', body: this.warpscript}).then(response => {
            response.text().then(gtsStr => {
                let gtsList = JSON.parse(gtsStr);
                let data = [];

                if (me.type === 'doughnut' || me.type === 'pie' || me.type === 'polar') {
                    if (gtsList.length > 0) {
                        if (Array.isArray(gtsList[0])) {
                            gtsList = gtsList[0];
                        }
                    }
                    me.data = JSON.stringify(gtsList);
                    console.log('QuantumTile', me.data)
                } else {
                    if (gtsList.length > 0) {
                        if (Array.isArray(gtsList[0])) {
                            gtsList = gtsList[0];
                        }
                    }
                    data.push({
                        gts: gtsList,
                        params: me.getParams(gtsList)
                    });
                    me.data = JSON.stringify(data);
                }
            }, err => {
                console.error(err)
            });
        }, err => {
            console.error(err)
        })
    }

    getParams(gtsList): any[] {
        let params = [];
        let me = this;
        for (let i = 0; i < gtsList.length; i++) {
            let gts = gtsList[i];
            params.push({color: me.getColor(i), key: gts.c, interpolate: me.type})
        }
        return params;
    }

    render() {
        if (this.type == 'scatter') {
            return <quantum-scatter responsive={this.responsive} unit={this.unit} data={this.data}
                                    chartTitle={this.chartTitle}/>
        } else if (this.type == 'line' || this.type == 'bar' || this.type == 'spline') {
            return <quantum-chart
                responsive={this.responsive} unit={this.unit} data={this.data} type={this.type}
                chartTitle={this.chartTitle}/>;
        } else if (this.type == 'area') {
            return <quantum-chart
                responsive={this.responsive} unit={this.unit} data={this.data} chartTitle={this.chartTitle}/>;
        } else if (this.type == 'pie' || this.type == 'doughnut') {
            return <quantum-pie
                responsive={this.responsive} unit={this.unit} data={this.data} type={this.type}
                chartTitle={this.chartTitle}/>;
        } else if (this.type == 'polar' ) {
            return <quantum-polar
                responsive={this.responsive} unit={this.unit} data={this.data} type={this.type}
                chartTitle={this.chartTitle}/>;
        }
    }
}
