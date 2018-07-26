/*
import { Component, Prop, EventEmitter, Event, State, Listen} from '@stencil/core';

@Component({
  tag: 'quantum-heatmap-sliders',
  styleUrl: 'quantum-heatmap-sliders.css',
  shadow: true
})

export class QuantumHeatmapSliders{

  @Prop() radiusValue: number;
  @Prop() minRadiusValue: number;
  @Prop() maxRadiusValue: number;

  @Prop() blurValue: number;
  @Prop() minBlurValue: number;
  @Prop() maxBlurValue: number;


  @Event() radiusChange: EventEmitter;
  @Event() blurChange: EventEmitter;


  @Watch("data")
  redraw(newValue: string, oldValue: string){
    if (oldValue !== newValue){
      this.drawHeatmap();
    }
  }

  @Listen('radiusChange')
    radiusChangeListener(event: CustomEvent){
      _radius = this.el.shadowRoot.querySelector("#radius");
    }

  @Listen('blurChange')
    blurChangeListener(event: CustomEvent){
      _blur = this.el.shadowRoot.querySelector("#blur");
    }



  drawHeatmap(){
    let ctx = this.el.shadowRoot.querySelector("#myHeatmap");
    let data = JSON.parse(this.data);
    this._heatmap = new HeatmapLib.Heatmap(ctx).(data).max(this.maxScale);
    this._heatmap.draw();
    
  }



  componentWillLoad(){

  }

  componentDidLoad(){
    this.drawHeatmap();
  }

  render() {
    return (
      <div>
        <h1>{this.title}</h1>
        <div class="container">
          <div class="options">
              <label>Radius </label><input type="range" id="radius" value="20" min="10" max="50" /><br />
              <label>Blur </label><input type="range" id="blur" value="20" min="10" max="50" />
          </div>
        </div>
      </div>
    );
  }
}
*/ 
