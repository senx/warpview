import {Component, Element, Event, EventEmitter, Method, Prop, Watch, Listen} from "@stencil/core";
import {GTSLib} from "../../gts.lib";

import { EventData } from "@stencil/core/dist/declarations";
import { Script } from "vm";
import Dygraph from "dygraphs";


@Component({
  tag: "quantum-dygraphs",
  styleUrl: "../../../node_modules/dygraphs/dist/dygraph.min.css",
  shadow: false
})


export class QuantumDygraphs {
  @Prop() data: string = "[]";
  @Prop() type: string = "line";
  @Prop() options: string = "{}";
  @Prop() hiddenData: string = "[]";
  @Element() el: HTMLElement;
  @Event() receivedData: EventEmitter;

  private _mapIndex = {};
  private _data: any;
  private _classList = [];
  private _type = 'timestamp';
  private _chart: any;
  private _chartMap = {};
  private _chartColors = [];

  @Watch("hiddenData")
  hideData(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      const hiddenData = GTSLib.cleanArray(JSON.parse(newValue));

      this._classList.forEach(c => {
        this._chart.then((result) => {
          result.view.remove("dataList", (d)=>{ return d.c === c; });
        });
        this._chart.then((result)=>{
          result.view.resize().run();
        });
      });

      this._classList.forEach(c => {
        if(!hiddenData.find((e)=>{ return e === c; })){
          this._chart.then((result) => {
            result.view.insert("dataList", this._data.datasets[this._classList.indexOf(c)].data);
          });
        };
        this._chart.then((result)=>{
          result.view.resize().run();
        });
      });
    }
    this._chart.then((result) => {
      console.log("getState : ",result.view.getDate());
    });
  }

  @Watch("options")
  changeScale(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      console.log("Time changed !");
    }
    
  }

  
  gtsToData(gts) {
    let data = [];
    let ticks = [];
    let pos = 0;
    if (!gts) {
      return;
    } else
      gts.forEach(d => {
        if (d.gts) {
          d.gts = GTSLib.flatDeep(d.gts);
          let i = 0;
          console.log(d.gts);
          d.gts.forEach(g => {
            if (g.v) {
              GTSLib.gtsSort(g);
              g.v.forEach(d => {
                ticks.push(d[0] );
                data.push(d[d.length - 1]);
              });
              let color = GTSLib.getColor(pos);
              if (d.params && d.params[i] && d.params[i].color) {
                color = d.params[i].color;
              }
              let label = GTSLib.serializeGtsMetadata(g);
              this._mapIndex[label] = pos;
              if (d.params && d.params[i] && d.params[i].key) {
                label = d.params[i].key;
              }
              let ds = {
                label: label,
                data: data,
                pointRadius: 0,
                fill: false,
                steppedLine: this.isStepped(),
                borderColor: color,
                borderWidth: 1,
                backgroundColor: GTSLib.transparentize(color, 0.5)
              };
              if (d.params && d.params[i] && d.params[i].interpolate) {
                switch (d.params[i].interpolate) {
                  case "line":
                    ds["lineTension"] = 0;
                    break;
                  case "spline":
                    break;
                  case "area":
                    ds.fill = true;
                }
              } else {
                ds["lineTension"] = 0;
              }
              //datasets.push(ds);
              pos++;
              i++;
            }
          });
        }
      });
    return {datasets: datasets, ticks: GTSLib.unique(ticks)};
  }

  isStepped() {
    if (this.type.startsWith("step")) {
      return this.type.replace("step-", "");
    } else {
      return false;
    }
  }

  drawChart(){
    this._chart = new Dygraph(
      this.el.querySelector("#myChart") as HTMLElement,
      [
        [1,50,NaN],
        [2,20,NaN],
        [3,50,NaN],
        [1,NaN,100],
        [2,NaN,80],
        [3,NaN,60],

      ],
      {
        labels: [ "x", "A", "B" ],
        rollPeriod: 7,
        showRoller: true,
        colors: ["orange", "red"]
      }
    );

  }


  componentWillLoad(){}
  
  componentDidLoad(){
    console.log(this.gtsToData(JSON.parse(this.data)), NaN);
    this.drawChart();

  }

  render(){
    return(
      <div id="myChart">
      </div>
    );
  }
}
