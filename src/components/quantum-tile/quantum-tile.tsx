import {Component, Element, Prop, State} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from "../../model/dataModel";
import {Logger} from "../../utils/logger";

@Component({
  tag: 'quantum-tile',
  styleUrl: 'quantum-tile.scss',
  shadow: true
})
export class QuantumTile {

  LOG: Logger = new Logger(QuantumTile);

  @State() data: string;
  @State() options: string;
  @Prop() unit: string = '';
  @Prop() theme: string = 'light';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = true;
  @Prop() url: string = '';
  @Element() wsElement: HTMLElement;

  warpscript: string = '';
  graphs = {
    'scatter': ['scatter'],
    'chart': ['line', 'spline', 'step', 'area'],
    'pie': ['pie', 'doughnut', 'gauge'],
    'polar': ['polar'],
    'bar': ['bar']
  };

  componentDidLoad() {
    this.warpscript = this.wsElement.textContent;
    this.LOG.debug(['componentDidLoad', 'warpscript'], this.warpscript);
    let me = this;
    fetch(this.url, {method: 'POST', body: this.warpscript}).then(response => {
      response.text().then(gtsStr => {
        this.LOG.debug(['componentDidLoad', 'response'], gtsStr);
        let gtsList = JSON.parse(gtsStr);
        let data: DataModel = new DataModel();
        if (GTSLib.isArray(gtsList) && gtsList.length === 1) {
          const dataLine = gtsList[0];
          if (dataLine.hasOwnProperty('data')) {
            data.data = dataLine.data;
            data.globalParams = dataLine.globalParams;
            this.options = JSON.stringify(data.globalParams);
            data.params = dataLine.params;
          } else {
            data.data = dataLine;
          }
        } else {
          data.data = gtsList;
        }
        me.data = JSON.stringify(data);
        this.LOG.debug(['componentDidLoad', 'data'], [me.type, data]);
      }, err => {
        console.error(err)
      });
    }, err => {
      console.error(err)
    })
  }


  render() {
    return <div class="wrapper" id="wrapper">
      <div class="warpscript">
        <slot/>
      </div>
      {this.graphs['scatter'].indexOf(this.type) > -1 ?
        <quantum-scatter
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          options={this.options} show-legend={this.showLegend} chartTitle={this.chartTitle}
        />
        : ''}
      {this.graphs['chart'].indexOf(this.type) > -1 ?
        <quantum-chart type={this.type}
          responsive={this.responsive} unit={this.unit} data={this.data}
          options={this.options} show-legend={this.showLegend} chartTitle={this.chartTitle} theme={this.theme}/>
        : ''}
      {this.type == 'bubble' ?
        <quantum-bubble
          showLegend={this.showLegend} responsive={true} unit={this.unit} data={this.data} theme={this.theme}
          options={this.options} chartTitle={this.chartTitle}/> : ''
      }
      {this.graphs['pie'].indexOf(this.type) > -1 ?
        <quantum-pie
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          options={this.options} showLegend={this.showLegend} chartTitle={this.chartTitle}/> : ''
      }
      {this.graphs['polar'].indexOf(this.type) > -1 ?
        <quantum-polar
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          showLegend={this.showLegend} chartTitle={this.chartTitle} options={this.options}/> : ''
      }
      {this.graphs['bar'].indexOf(this.type) > -1 ?
        <quantum-bar
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          showLegend={this.showLegend} chartTitle={this.chartTitle} options={this.options}/> : ''
      }
      {this.type == 'text' ?
        <quantum-display
          responsive={this.responsive} unit={this.unit} data={this.data} theme={this.theme}
          displayTitle={this.chartTitle} options={this.options}/> : ''}
    </div>
  }
}
