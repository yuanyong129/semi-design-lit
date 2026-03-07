import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ThumbData } from "./interface";
import { Direction } from "../_utils/constant";
import { getPrefixCls } from "../_utils/global-config";
import { createRef, ref } from "lit/directives/ref.js";
import { clsMap, handleClsList } from "../_utils/web-utils";
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from "./style/index.style";
import { isSelfTarget } from "../_utils/extra";
import { on, off } from '../_utils/dom';

const prefixCls = getPrefixCls('scrollbar');

@customElement('a-thumb')
export class ArcoThumb extends LitElement {

  @property()
  data?: ThumbData;
  @property()
  direction?: Direction = 'horizontal';
  @property({ type: Boolean })
  alwaysShow: boolean = false;
  @property({ type: Boolean })
  both: boolean = false;

  @state()
  _visible = false;

  trackRef = createRef<HTMLElement>();
  thumbRef = createRef<HTMLElement>();

  thumbMap = () => {
    if (this.direction === 'horizontal') {
      return {
        size: 'width',
        direction: 'left',
        offset: 'offsetWidth',
        client: 'clientX',
      };
    }
    return {
      size: 'height',
      direction: 'top',
      offset: 'offsetHeight',
      client: 'clientY',
    };
  }

  @state()
  _offset = 0;

  @state()
  _isDragging = false;
  @state()
  _mouseOffset = 0;

  thumbStyle = () => {
    const thumbMap = this.thumbMap();
    return styleMap({
      [thumbMap.size]: `${this.data?.thumbSize ?? 0}px`,
      [thumbMap.direction]: `${this._offset}px`,
    });
  };

  handleThumbMouseDown = (ev: MouseEvent) => {
    ev.preventDefault();
    const thumbMap = this.thumbMap();

    if (this.thumbRef.value) {
      this._mouseOffset =
        //@ts-ignore
        ev[thumbMap.client] - this.thumbRef.value.getBoundingClientRect()[thumbMap.direction];
      this._isDragging = true;
      on(window, 'mousemove', this.handleMouseMove);
      on(window, 'mouseup', this.handleMouseUp);
      on(window, 'contextmenu', this.handleMouseUp);
    }
  };

  handleTrackClick = (ev: MouseEvent) => {
    if(!isSelfTarget(ev)) return;
    ev.preventDefault();

    const thumbMap = this.thumbMap();

    if (this.thumbRef.value) {
      
      const _offset = this.getLegalOffset(
        // @ts-ignore
        ev[thumbMap.client] > this.thumbRef.value.getBoundingClientRect()[thumbMap.direction]
          ? this._offset + (this.data?.thumbSize ?? 0)
          : this._offset - (this.data?.thumbSize ?? 0)
      );
      if (_offset !== this._offset) {
        this._offset = _offset;
        this.dispatchEvent(new CustomEvent('scroll', { detail: this._offset }));
      }
    }
  };

  getLegalOffset = (offset: number) => {
    if (offset < 0) {
      return 0;
    }
    if (this.data && offset > this.data.max) {
      return this.data.max;
    }
    return offset;
  }

  handleMouseMove = (ev: MouseEvent) => {
    const thumbMap = this.thumbMap();

    if (this.trackRef && this.thumbRef) {
      const _offset = this.getLegalOffset(
        // @ts-ignore
        ev[thumbMap.client] - this.trackRef.value.getBoundingClientRect()[thumbMap.direction] - this._mouseOffset
      );
      if (_offset !== this._offset) {
        this._offset = _offset;
        this.dispatchEvent(new CustomEvent('scroll', { detail: this._offset }));
      }
    }
  }

  handleMouseUp = () => {
    this._isDragging = false;
    off(window, 'mousemove', this.handleMouseMove);
    off(window, 'mouseup', this.handleMouseUp);
  }

  setOffset = (_offset: number) => {
    if (!this._isDragging) {
      _offset = this.getLegalOffset(_offset);
      if (_offset !== this._offset) {
        this._offset = _offset;
      }
    }
  };

  thumbCls = () => handleClsList([
    `${prefixCls}-thumb`,
    `${prefixCls}-thumb-direction-${this.direction}`,
    clsMap({
      [`${prefixCls}-thumb-dragging`]: this._isDragging,
    }),
  ]);

  render() {
    return html`
      <div
        ${ref(this.trackRef)}
        class="${handleClsList([
          `${prefixCls}-track`,
          `${prefixCls}-track-direction-${this.direction}`,
        ])}"
        @mousedown="${this.handleTrackClick}"
        part="a-thumb"
      >
        <div
          ${ref(this.thumbRef)}
          class="${this.thumbCls()}"
          style="${this.thumbStyle()}"
          @mousedown="${this.handleThumbMouseDown}"
        >
          <div class="${prefixCls}-thumb-bar"></div>
        </div>
      </div>
    `;
  }

  static styles = styles;

}