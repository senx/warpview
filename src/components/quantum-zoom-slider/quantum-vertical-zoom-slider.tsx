import {Component, Prop, Element, EventEmitter, Event, Watch} from '@stencil/core';
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-vertical-zoom-slider',
  styleUrl: 'quantum-vertical-zoom-slider.scss',
  shadow: true
})

export class QuantumVerticalZoomSlider {

  @Prop() height: number;
  @Prop() maxValue: number;
  @Prop() minValue: number;
  @Prop() cursorSize: string = "{}";
  @Prop() config: string = '{}';

  @Element() el: HTMLElement;

  @Event() ySliderValueChanged: EventEmitter;
  @Event() yZoom: EventEmitter;


  private _config = {
    rail: {
      class: ''
    },
    cursor: {
      class: ''
    }
  };
  private _rail: HTMLElement;
  private _cursor: HTMLElement;
  private _cursorHeight;
  private _cursorMinHeight = 30;
  private _railMin;
  private _railMax;
  private _mouseCursorTopOffset;
  private _mouseCursorBottomOffset;

  @Watch("cursorSize")
  changeCursorSize(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      let object = JSON.parse(newValue);
      if (object.cursorOffset + object.cursorSize <= 100) {
        this._cursor.style.top = (object.cursorOffset * 100).toString() + "%";
        if (object.cursorSize * this._rail.getBoundingClientRect().height < this._cursorMinHeight) {
          this._cursor.style.height = this._cursorMinHeight.toString() + "px";
        } else {
          this._cursor.style.height = (object.cursorSize * 100).toString() + "%";
        }
      }
    }
  }

  @Watch("height")
  initSize(newValue: number, oldValue: number) {
    if (oldValue !== newValue) {
      this._rail.style.height = (0.95 * newValue).toString() + "px";
      console.log("height", this._rail.style.height);
    }
  }

  componentWillLoad() {
    this._config = GTSLib.mergeDeep(this._config, JSON.parse(this.config));
  }

  componentDidLoad() {
    this._rail = this.el.shadowRoot.querySelector("#rail") as HTMLElement;
    this._cursor = this.el.shadowRoot.querySelector("#cursor") as HTMLElement;
  }

  mouseDown(event) {
    event.preventDefault();
    let me = this;
    this.dimsY(event);
    
    this._rail.onmousemove = (event) => {me.dragY(event, me)};
    this._cursor.onmouseup = (event) => {me.stopDrag(me)};
    this._rail.onmouseup = (event) => {me.stopDrag(me)};
    this._rail.onmouseout = (event) => {me.stopDrag(me)};
  }

  dimsY(event) {
    let railDims = this._rail.getBoundingClientRect() as DOMRect;
    let cursorDims = this._cursor.getBoundingClientRect() as DOMRect;
    this._railMin = this._rail.offsetTop;
    this._railMax = railDims.height + this._rail.offsetTop;

    this._cursorHeight = cursorDims.height;
    this._mouseCursorTopOffset = event.pageY - this._rail.offsetTop - this._cursor.offsetTop;
    this._mouseCursorBottomOffset = cursorDims.height - this._mouseCursorTopOffset;
  }

  dragY(event, elem) {
    event.preventDefault();
    if ((event.pageY - elem._mouseCursorTopOffset) >= elem._railMin + 1 && (event.pageY + elem._mouseCursorBottomOffset) <= elem._railMax - 1) {
      let v = event.pageY - elem._rail.offsetTop - elem._mouseCursorTopOffset;
      v = v < 0 ? 0 : v;
      elem._cursor.style.top = v + "px";
      let value = ((v) / ((this._railMax - this._railMin) - this._cursorHeight)) * (this.maxValue - this.minValue) + this.minValue;
      value = (this.maxValue - this.minValue) - value;
      this.ySliderValueChanged.emit({sliderValue: value});
    }
  }

  stopDrag(elem) {
    elem._rail.onmouseup = null;
    elem._rail.onmousemove = null;
    elem._cursor.onmouseup = null;
    elem._rail.onmouseout = null;
  }

  yWheel(event) {
    event.preventDefault();
    let railDims = this._rail.getBoundingClientRect() as DOMRect;
    let coef = (event.pageY - this._rail.offsetTop) / railDims.height;
    this.yZoom.emit({zoomValue: {coef: coef, zoomType: event.deltaY * -1}});
  }

  render() {
    return (
      <div id="rail" onWheel={(event) => this.yWheel(event)}>
        <div id="cursor" onMouseDown={(event) => this.mouseDown(event)}/>
      </div>
    );
  }
}
