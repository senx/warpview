import {Component, Prop, Element} from '@stencil/core';
import 'whatwg-fetch'

@Component({
  tag: 'quantum-tile',
  styleUrl: 'quantum-tile.css',
  shadow: true
})
export class QuantumTile {

  warpscript: string = '';
  @Prop() url: string = '';
  @Prop() type: string = 'line';
  @Element() wsElement: HTMLElement;

  componentDidLoad() {
    this.warpscript = this.wsElement.innerHTML
    fetch(this.url, {method: 'POST', body: this.warpscript}).then(function(response) {
      console.log(response.headers.get('Content-Type'))
      console.log(response.headers.get('Date'))
      console.log(response.status)
      console.log(response.statusText)
    })
  }

  render() {
    return (
      <div>
        <quantum-chart
          responsive={true} unit="°C" chart-title="Temperatures"
          id="myChart" ></quantum-chart>
      </div>
    );
  }
}
