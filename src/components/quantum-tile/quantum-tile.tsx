import {Component, Element, Prop, State} from '@stencil/core';
import {GTSLib} from '../../gts.lib';

@Component({
  tag: 'quantum-tile',
  styleUrl: 'quantum-tile.scss',
  shadow: true
})
export class QuantumTile {

  warpscript: string = '';
  @State() data: string = '[]';

  @Prop() unit: string = '';
  @Prop() theme: string = 'light';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() url: string = '';
  @Element() wsElement: HTMLElement;

  graphs = {
    'scatter': ['scatter'],
    'chart': ['line', 'spline', 'step', 'area'],
    'pie': ['pie', 'doughnut', 'gauge'],
    'polar': ['polar'],
    'bar': ['bar']
  };

  componentDidLoad() {
    this.warpscript = this.wsElement.textContent;
    let me = this;
    fetch(this.url, {method: 'POST', body: this.warpscript}).then(response => {
      response.text().then(gtsStr => {
        let gtsList = JSON.parse(gtsStr);
        let data = [];

        if (me.type === 'doughnut' || me.type === 'pie' || me.type === 'polar' || me.type === 'gauge' || me.type === 'bubble') {
          if (gtsList.length > 0) {
            if (Array.isArray(gtsList[0])) {
              gtsList = gtsList[0];
            }
          }
          me.data = JSON.stringify(gtsList);
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
      params.push({color: GTSLib.getColor(i), key: GTSLib.serializeGtsMetadata(gts), interpolate: me.type})
    }
    return params;
  }

  render() {
    return <div class="wrapper" id="wrapper">
      <div class="warpscript">
        <slot/>
      </div>
      {this.graphs['scatter'].indexOf(this.type) > -1 ?
        <quantum-scatter
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          show-legend={this.showLegend} chart-title={this.chartTitle}
        />
        : ''}
      {this.graphs['chart'].indexOf(this.type) > -1 ?
        <quantum-dygraphs
          responsive={this.responsive} unit={this.unit} data={this.data} options={JSON.stringify({type: this.type})}
          show-legend={this.showLegend} chartTitle={this.chartTitle} theme={this.theme}/>
        : ''}
      {this.type == 'bubble' ?
        <quantum-bubble
          showLegend={this.showLegend} responsive={true} unit={this.unit} data={this.data} theme={this.theme}
          chartTitle={this.chartTitle} /> : ''
      }
      {this.graphs['pie'].indexOf(this.type) > -1 ?
        <quantum-pie
          responsive={this.responsive} unit={this.unit} data={this.data} type={this.type} theme={this.theme}
          showLegend={this.showLegend} chartTitle={this.chartTitle} /> : ''
      }
      {this.graphs['polar'].indexOf(this.type) > -1 ?
        <quantum-polar
          responsive={this.responsive} unit={this.unit} data={this.data} type={this.type}
          showLegend={this.showLegend} chartTitle={this.chartTitle}/> : ''
      }
      {this.graphs['bar'].indexOf(this.type) > -1 ?
        <quantum-bar
          responsive={this.responsive} unit={this.unit} data={this.data}
          showLegend={this.showLegend} chartTitle={this.chartTitle}/> : ''
      }
    </div>
  }
}
