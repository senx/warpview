import {Component, Element, Event, EventEmitter, Method, Prop, Watch, Listen} from "@stencil/core";
import {GTSLib} from "../../gts.lib";
import "vega";
import VegaLite from "vega-lite";
import Embed from "vega-embed";
import { EventData } from "@stencil/core/dist/declarations";
import { Script } from "vm";

@Component({
  tag: "quantum-vega",
  styleUrl: "quantum-vega.scss",
  shadow: false
})


export class QuantumVega {
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
  private _colorScheme;

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
      const data = JSON.parse(newValue);
      if (data.time.timeMode === "timestamp") {
        this.drawChart(this._data, "%Q");
      } else {
        this.drawChart(this._data, "%H : %M : %S  %A %d %B %Y");
      }
      
    }
    
  }

  
  gtsToData(gts) {
    let datasets = [];
    let ticks = [];
    let pos = 0;
    if (!gts) {
      return;
    } else
      gts.forEach(d => {
        if (d.gts) {
          d.gts = GTSLib.flatDeep(d.gts);
          let i = 0;
          d.gts.forEach(g => {
            let data = [];
            if (g.v) {
              this._classList.push(g.c + "{}");
              GTSLib.gtsSort(g);
              let color = GTSLib.getColor(pos);
              if (d.params && d.params[i] && d.params[i].color) {
                color = d.params[i].color;
              }
              g.v.forEach(d => {
                /*
                data.push({x: Number.isSafeInteger(d[0]) ? d[0] : d[0].toString(),
                  y: Number.isSafeInteger(d[d.length - 1]) ? d[d.length - 1] : d[d.length - 1].toString(),
                  c: g.c + "{}",
                  color: color
                });
                */
               data.push({x: d[0],
                y: d[d.length - 1],
                c: g.c + "{}",
                color: color
              });
              });
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
              datasets.push(ds);
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

  drawChart(data, timeMode){

    let dataTab = [];
    
    data.datasets.forEach(set =>{
      //console.log(set.data);
      dataTab = dataTab.concat(set.data);
    });
    
    /*this._chartMap = {
      $schema: "https://vega.github.io/schema/vega/v4.json",
      width: 2000,
      height: 1000,
      //"padding": 5,
      autosize: "fit", //Pour que then() fonctionne
    
      signals: [
        {
          name: "interpolate",
          value: "linear",
          bind: {
            input: "select",
            options: [
              "basis",
              "cardinal",
              "catmull-rom",
              "linear",
              "monotone",
              "natural",
              "step",
              "step-after",
              "step-before"
            ]
          }
        }
      ],
    
      data: [
        {
          name: "dataList",
          values: dataTab
        }
      ],
    
      scales: [
        {
          name: "x",
          nice: false,
          type: "time",
          range: "width",
          zero: true,
          domain: {data: "dataList", field: "x"}
        },
        {
          name: "y",
          type: "linear",
          range: "height",
          nice: true,
          zero: true,
          domain: {data: "dataList", field: "y"}
        },
        {
          name: "color",
          type: "ordinal",
          range: "category",
          domain: {data: "dataList", field: "c"}
        }
      ],
    
      axes: [
        {orient: "bottom",
        scale: "x",
        format: timeMode,
        tickCount: {step:1},
        tickRound: true,
        labelOverlap: "greedy"
      },
        {orient: "left",
        scale: "y"
      }
      ],
    
      marks: [
        {
          type: "group",
          from: {
            facet: {
              name: "series",
              data: "dataList",
              groupby: "c"
            }
          },
          marks: [
            {
              type: this.type,
              from: {"data": "series"},
              encode: {
                enter: {
                  x: {"scale": "x", "field": "x"},
                  y: {"scale": "y", "field": "y"},
                  stroke: {field: "color"},//{"scale": "color", "field": "c"},
                  strokeWidth: {"value": 0.5}
                },
                update: {
                  interpolate: {signal: "interpolate"},
                  //"stroke": {"scale": "color", "field": "c"},
                  fillOpacity: {value: 0.5}
                },
                hover: {
                  fillOpacity: {value: 0.5}
                }
              }
            }
          ]
        }
      ]
    } as any;
    */
   /*
   this._chartMap = {
    "$schema": "https://vega.github.io/schema/vega/v4.json",
    "width": 720,
    "height": 480,
    "padding": 5,
  
    data: [
      {
        name: "dataList",
        values: dataTab
      }
    ],
  
    "signals": [
      {
        "name": "detailDomain"
      }
    ],
  
    "marks": [
      {
        "type": "group",
        "name": "detail",
        "encode": {
          "enter": {
            "height": {"value": 390},
            "width": {"value": 720}
          }
        },
        "scales": [
          {
            "name": "xDetail",
            "type": "time",
            "range": "width",
            "domain": {"data": "dataList", "field": "x"},
            "domainRaw": {"signal": "detailDomain"}
          },
          {
            "name": "yDetail",
            "type": "linear",
            "range": [390, 0],
            "domain": {"data": "dataList", "field": "y"},
            "nice": true, "zero": true
          },
        {
          name: "color",
          type: "ordinal",
          range: "category",
          domain: {data: "dataList", field: "c"}
        }
        ],
        "axes": [
          {"orient": "bottom", "scale": "xDetail"},
          {"orient": "left", "scale": "yDetail"}
        ],
        "marks": [
          {
            "type": "group",
            "encode": {
              "enter": {
                "height": {"field": {"group": "height"}},
                "width": {"field": {"group": "width"}},
                "clip": {"value": true}
              }
            },
            "marks": [
              {
                "type": "line",
                "from": {"data": "dataList"},
                "encode": {
                  "update": {
                    "x": {"scale": "xDetail", "field": "x"},
                    "y": {"scale": "yDetail", "field": "y"},
                    "y2": {"scale": "yDetail", "value": 0},
                    "fill": {"value": "steelblue"}
                  }
                }
              }
            ]
          }
        ]
      },
  
      {
        "type": "group",
        "name": "overview",
        "encode": {
          "enter": {
            "x": {"value": 0},
            "y": {"value": 430},
            "height": {"value": 70},
            "width": {"value": 720},
            "fill": {"value": "transparent"}
          }
        },
        "signals": [
          {
            "name": "brush", "value": 0,
            "on": [
              {
                "events": "@overview:mousedown",
                "update": "[x(), x()]"
              },
              {
                "events": "[@overview:mousedown, window:mouseup] > window:mousemove!",
                "update": "[brush[0], clamp(x(), 0, width)]"
              },
              {
                "events": {"signal": "delta"},
                "update": "clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)"
              }
            ]
          },
          {
            "name": "anchor", "value": null,
            "on": [{"events": "@brush:mousedown", "update": "slice(brush)"}]
          },
          {
            "name": "xdown", "value": 0,
            "on": [{"events": "@brush:mousedown", "update": "x()"}]
          },
          {
            "name": "delta", "value": 0,
            "on": [
              {
                "events": "[@brush:mousedown, window:mouseup] > window:mousemove!",
                "update": "x() - xdown"
              }
            ]
          },
          {
            "name": "detailDomain",
            "push": "outer",
            "on": [
              {
                "events": {"signal": "brush"},
                "update": "span(brush) ? invert('xOverview', brush) : null"
              }
            ]
          }
        ],
        "scales": [
          {
            "name": "xOverview",
            "type": "time",
            "range": "width",
            "domain": {"data": "dataList", "field": "x"}
          },
          {
            "name": "yOverview",
            "type": "linear",
            "range": [70, 0],
            "domain": {"data": "dataList", "field": "y"},
            "nice": true, "zero": true
          }
        ],
        "axes": [
          {"orient": "bottom", "scale": "xOverview"}
        ],
        "marks": [
          {
            "type": "area",
            "interactive": false,
            "from": {"data": "dataList"},
            "encode": {
              "update": {
                "x": {"scale": "xOverview", "field": "x"},
                "y": {"scale": "yOverview", "field": "y"},
                "y2": {"scale": "yOverview", "value": 0},
                "fill": {"value": "steelblue"}
              }
            }
          },
          {
            "type": "rect",
            "name": "brush",
            "encode": {
              "enter": {
                "y": {"value": 0},
                "height": {"value": 70},
                "fill": {"value": "#333"},
                "fillOpacity": {"value": 0.2}
              },
              "update": {
                "x": {"signal": "brush[0]"},
                "x2": {"signal": "brush[1]"}
              }
            }
          },
          {
            "type": "rect",
            "interactive": false,
            "encode": {
              "enter": {
                "y": {"value": 0},
                "height": {"value": 70},
                "width": {"value": 1},
                "fill": {"value": "firebrick"}
              },
              "update": {
                "x": {"signal": "brush[0]"}
              }
            }
          },
          {
            "type": "rect",
            "interactive": false,
            "encode": {
              "enter": {
                "y": {"value": 0},
                "height": {"value": 70},
                "width": {"value": 1},
                "fill": {"value": "firebrick"}
              },
              "update": {
                "x": {"signal": "brush[1]"}
              }
            }
          }
        ]
      }
    ]
  }
  */
 
 this._chartMap = {
    $schema: "https://vega.github.io/schema/vega-lite/v2.json",
    description: "Data over Time.",
    data: {
      name: "dataList",
      values: dataTab
      },

      vconcat: [{
        width: 1000,
        height: 600,
        selection: {
          
          yZoom: {
            type: "interval",
            encodings: ["y"],
            bind: "scales"
            
          }
        },
      mark: {
        type: "line",
        opacity: 0.9
      },
      encoding: {
        tooltip: [
          {field: "c", type: "nominal"},
          {field: "x", type: "nominal"},
          {field: "y", type: "nominal"}
        ],
        x: {
          field: "x",
          type: "temporal",
          scale: {domain: {selection: "brush"}},
          axis: {title: "", format: timeMode}
        },
        y: {
          field: "y",
          type: "quantitative",
          axis: {title: ""}
        },
        color: {
          type: "nominal",
          field: "color",
          legend: null,
          scale: null //mettre à null pour prendre en compte la valeur de couleur du champ 'color'
        }
      }
    },{
      width: 1000,
      height: 100,
      mark: {
        type: "line",
        opacity: 0.9
      },
      selection: {brush: {
          type: "interval", encodings: ["x"]
        }
      },
      encoding: {
        x: {
          field: "x",
          type: "temporal",
          axis: {title: "", format: timeMode}
        },
        y: {
          field: "y",
          type: "quantitative",
          axis: {title: ""}
        },
        color: {
          type: "nominal",
          field: "color",
          legend: null,
          scale: null
        }
      },
      config: {
        tick: {
          thickness: 0.1
        }
      }
    }]
  }
    
    this._chart = Embed("#myChart", this._chartMap, {defaultStyle: true});
    this._chart.then((result) => {
      console.log("getState : ",result.view.getState());
    });
    
}

/*
 drawChart(data){
  let tab = [];
  data.datasets.forEach(set =>{
    //console.log(set.data);
   tab = tab.concat(set.data);
  });
  let runtime;
  let view = new Vega.View(runtime).initialize(this.el.querySelector("#myChart")).run();
 }
 */
  componentWillLoad(){}
  
  componentDidLoad(){
    //this._colorScheme = Vega.scheme("gtsLibColors", ["#f00"]);
    //console.log(this._colorScheme);
    this._data = this.gtsToData(JSON.parse(this.data));
    //tab.push(data.datasets[1].data);
    //tab = data.datasets[1].data.concat(data.datasets[0].data);
    this.drawChart(this._data, "%H : %M : %S  %A %d %B %Y");
  }

  render(){
    return(
      <div>
        <div id="myChart">
        </div>
      </div>
    );
  }
}
/*
<div class="vega-binds">
  <div class="vega-bind">
  <span class="vega-bind-name">types</span>
    <select name="types"> 
      <option label="basis" value="basis"></option>
      <option label="cardinal" value="cardinal"></option>
      <option label="catmull-rom" value="catmull-rom"></option>
      <option label="linear" value="linear"></option>
      <option label="monotone" value="monotone"></option>
      <option label="natural" value="natural"></option>
      <option label="step" value="step"></option>
      <option label="step-after" value="step-after"></option>
      <option label="step" value="step-before"></option>
    </select>
  </div>
</div>
*/