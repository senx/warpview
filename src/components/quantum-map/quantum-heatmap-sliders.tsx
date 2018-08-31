import { Component, Prop, EventEmitter, Event, Element} from '@stencil/core';

@Component({
  tag: 'quantum-heatmap-sliders',
  //styleUrl: 'quantum-heatmap-sliders.css',
  shadow: true
})

export class QuantumHeatmapSliders{

  @Prop() radiusValue: number;
  @Prop() minRadiusValue: number;
  @Prop() maxRadiusValue: number;

  @Prop() blurValue: number;
  @Prop() minBlurValue: number;
  @Prop() maxBlurValue: number;

  @Element() el: HTMLElement;

  @Event() heatRadiusDidChange: EventEmitter;
  @Event() heatBlurDidChange: EventEmitter;
  @Event() heatOpacityDidChange: EventEmitter;

  radiusChanged(value){
    this.heatRadiusDidChange.emit(value);
  }

  blurChanged(value){
    this.heatBlurDidChange.emit(value);
  }

  opacityChanged(value){
    this.heatOpacityDidChange.emit(value);
  }
/*
  @Listen('radiusChange')
    radiusChangeListener(event: CustomEvent){
      _radius = this.el.shadowRoot.querySelector("#radius");
    }

  @Listen('blurChange')
    blurChangeListener(event: CustomEvent){
      _blur = this.el.shadowRoot.querySelector("#blur");
    }
*/


  componentWillLoad(){
  }

  componentDidLoad(){
  }

  render() {
    return (
      <div>
        <div class="container">
          <div class="options">
              <label>Radius </label><input type="number" id="radius" value="25" min="10" max="50" onClick={(event: UIEvent) => this.radiusChanged(event.target)}/>
              <br />
              <label>Blur </label><input type="number" id="blur" value="15" min="10" max="50" onClick={(event: UIEvent) => this.blurChanged(event.target)}/>
              <br/>
              <label>Opacity </label><input type="number" id="opacity" value="50" min="10" max="100" onClick={(event: UIEvent) => this.opacityChanged(event.target)}/>
          </div>
        </div>
      </div>
    );
  }
}
