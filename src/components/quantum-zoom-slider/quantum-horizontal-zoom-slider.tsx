import {Component, Prop, Element, EventEmitter, Event, Watch} from '@stencil/core';
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-horizontal-zoom-slider',
  styleUrl: 'quantum-horizontal-zoom-slider.scss',
  shadow: true
})

export class QuantumHorizontalZoomSlider {

  @Prop() width: number;
  @Prop() maxValue: number;
  @Prop() minValue: number;
  @Prop() cursorSize: string = "{}";
  @Prop() config: string = '{}';

  @Element() el: HTMLElement;

  @Event() xSliderValueChanged: EventEmitter;
  @Event() xZoom: EventEmitter;


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
  private _cursorWidth;
  private _cursorMinWidth = 30;
  private _railMin;
  private _railMax;
  private _mouseCursorLeftOffset;
  private _mouseCursorRightOffset;

  @Watch("cursorSize")
  changeCursorSize(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      let object = JSON.parse(newValue);
      if (object.cursorOffset + object.cursorSize <= 100) {
        this._cursor.style.left = (object.cursorOffset * 100).toString() + "%";
        if (object.cursorSize * this._rail.getBoundingClientRect().width < this._cursorMinWidth) {
          this._cursor.style.width = this._cursorMinWidth.toString() + "px";
        } else {
          this._cursor.style.width = (object.cursorSize * 100).toString() + "%";
        }
      }
    }
  }

  @Watch("width")
  initSize(newValue: number, oldValue: number) {
    if (oldValue !== newValue) {
      this._rail.style.width = (0.94 * newValue).toString() + "px";
      console.log("width", this._rail.style.width);
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

    this.dimsX(event);
    this._rail.onmousemove = (event) => {
      me.dragX(event, me)
    };
    this._cursor.onmouseup = (event) => {
      me.stopDrag(me)
    };
    this._rail.onmouseup = (event) => {
      me.stopDrag(me)
    };
    this._rail.onmouseout = (event) => {
      me.stopDrag(me)
    };
  }

  dimsX(event) {
    let railDims = this._rail.getBoundingClientRect() as DOMRect;
    let cursorDims = this._cursor.getBoundingClientRect() as DOMRect;
    this._railMin = railDims.x;
    this._railMax = railDims.width + this._railMin;
    this._cursorWidth = cursorDims.width;
    this._mouseCursorLeftOffset = event.x - cursorDims.x;
    this._mouseCursorRightOffset = cursorDims.width - this._mouseCursorLeftOffset;
  }

  dragX(event, elem) {
    event.preventDefault();
    if ((event.clientX - elem._mouseCursorLeftOffset) >= elem._railMin + 1 && (event.clientX + elem._mouseCursorRightOffset) <= elem._railMax - 1) {
      let v = event.clientX - elem._rail.offsetLeft - elem._mouseCursorLeftOffset;
      v = v < 0 ? 0 : v;
      elem._cursor.style.left = v + "px";

      let value = ((v) / ((this._railMax - this._railMin) - this._cursorWidth)) * (this.maxValue - this.minValue) + this.minValue;
      this.xSliderValueChanged.emit({sliderValue: value});
    }
  }

  stopDrag(elem) {
    elem._rail.onmouseup = null;
    elem._rail.onmousemove = null;
    elem._cursor.onmouseup = null;
    elem._rail.onmouseout = null;
  }

  xWheel(event) {
    event.preventDefault();
    let railDims = this._rail.getBoundingClientRect() as DOMRect;

    let coef = (event.pageX - this._rail.offsetLeft) / railDims.width;
    this.xZoom.emit({zoomValue: {coef: coef, zoomType: event.deltaY * -1}});
  }

  yWheel(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div id="rail" onWheel={(event) => this.xWheel(event)}>
        <div id="cursor" onMouseDown={(event) => this.mouseDown(event)} />
      </div>
    );
  }
}
