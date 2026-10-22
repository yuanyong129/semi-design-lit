import { css, CSSResultGroup, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { handleClsList } from '../_utils/web-utils';
import { getPrefixCls } from '../_utils/global-config';
import { Size } from '../_utils/constant';
import '../../../semi-icons/build/copy';
import '../../../semi-icons/build/check';

const prefixCls = getPrefixCls('typography');

export type TypographyType =
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'success'
  | 'warning'
  | 'danger';
export type TypographyWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyAlign = 'left' | 'center' | 'right';

export const typographyStyles = css`
  :host {
    display: inline;
  }

  .${unsafeCSS(prefixCls)} {
    margin: 0;
    color: var(--semi-color-text-0);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    word-break: break-word;
  }

  .${unsafeCSS(prefixCls)}-secondary {
    color: var(--semi-color-text-2);
  }

  .${unsafeCSS(prefixCls)}-tertiary {
    color: var(--semi-color-text-3);
  }

  .${unsafeCSS(prefixCls)}-quaternary {
    color: var(--semi-color-text-3);
  }

  .${unsafeCSS(prefixCls)}-success {
    color: var(--semi-color-success);
  }

  .${unsafeCSS(prefixCls)}-warning {
    color: var(--semi-color-warning);
  }

  .${unsafeCSS(prefixCls)}-danger {
    color: var(--semi-color-danger);
  }

  .${unsafeCSS(prefixCls)}-disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
  }

  .${unsafeCSS(prefixCls)}-strong {
    font-weight: 600;
  }

  .${unsafeCSS(prefixCls)}-italic {
    font-style: italic;
  }

  .${unsafeCSS(prefixCls)}-underline {
    text-decoration: underline;
  }

  .${unsafeCSS(prefixCls)}-delete {
    text-decoration: line-through;
  }

  .${unsafeCSS(prefixCls)}-underline.${unsafeCSS(prefixCls)}-delete {
    text-decoration: underline line-through;
  }

  .${unsafeCSS(prefixCls)}-code {
    padding: 2px 4px;
    font-family: var(--semi-font-family-mono, Consolas, Menlo, monospace);
    font-size: 0.9em;
    background-color: var(--semi-color-fill-0);
    border: 1px solid var(--semi-color-border);
    border-radius: 3px;
  }

  .${unsafeCSS(prefixCls)}-link {
    color: var(--semi-color-link);
    text-decoration: none;
    cursor: pointer;
  }

  .${unsafeCSS(prefixCls)}-link:hover {
    color: var(--semi-color-link-hover);
    text-decoration: underline;
  }

  .${unsafeCSS(prefixCls)}-align-center {
    text-align: center;
  }

  .${unsafeCSS(prefixCls)}-align-right {
    text-align: right;
  }

  .${unsafeCSS(prefixCls)}-ellipsis {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .${unsafeCSS(prefixCls)}-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    color: var(--semi-color-text-3);
    font-size: 14px;
    vertical-align: middle;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease, color 0.2s ease;
  }

  .${unsafeCSS(prefixCls)}:hover .${unsafeCSS(prefixCls)}-copy,
  .${unsafeCSS(prefixCls)}-copy:focus-visible {
    opacity: 1;
  }

  .${unsafeCSS(prefixCls)}-copy:hover {
    color: var(--semi-color-text-1);
  }

  .${unsafeCSS(prefixCls)}-size-small {
    font-size: 12px;
  }

  .${unsafeCSS(prefixCls)}-size-large {
    font-size: 16px;
  }

  .${unsafeCSS(prefixCls)}-weight-light {
    font-weight: 300;
  }

  .${unsafeCSS(prefixCls)}-weight-medium {
    font-weight: 500;
  }

  .${unsafeCSS(prefixCls)}-weight-semibold {
    font-weight: 600;
  }

  .${unsafeCSS(prefixCls)}-weight-bold {
    font-weight: 700;
  }
`;

const titleStyles = css`
  :host {
    display: block;
  }

  .${unsafeCSS(prefixCls)}-title {
    margin: 0 0 0.5em;
    color: var(--semi-color-text-0);
    font-weight: 600;
    line-height: 1.3;
  }

  .${unsafeCSS(prefixCls)}-heading-1 {
    font-size: 32px;
  }

  .${unsafeCSS(prefixCls)}-heading-2 {
    font-size: 24px;
  }

  .${unsafeCSS(prefixCls)}-heading-3 {
    font-size: 20px;
  }

  .${unsafeCSS(prefixCls)}-heading-4 {
    font-size: 16px;
  }

  .${unsafeCSS(prefixCls)}-heading-5 {
    font-size: 14px;
  }

  .${unsafeCSS(prefixCls)}-heading-6 {
    font-size: 12px;
  }
`;

const paragraphStyles = css`
  :host {
    display: block;
  }

  .${unsafeCSS(prefixCls)}-paragraph {
    margin: 0 0 1em;
    line-height: 1.6;
  }
`;

class TypographyBase extends LitElement {
  static styles: CSSResultGroup = typographyStyles;

  @property()
  type?: TypographyType;

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ type: Boolean })
  strong: boolean = false;

  @property({ type: Boolean })
  italic: boolean = false;

  @property({ type: Boolean })
  underline: boolean = false;

  @property({ type: Boolean })
  delete: boolean = false;

  @property({ type: Boolean })
  code: boolean = false;

  @property({ type: Boolean })
  ellipsis: boolean = false;

  @property({ type: Boolean })
  copyable: boolean = false;

  @property({ type: Boolean })
  link: boolean = false;

  @property()
  href?: string;

  @property()
  size?: Size;

  @property()
  weight?: TypographyWeight;

  @property()
  align?: TypographyAlign;

  @state()
  private _copied = false;

  private _copyTimer?: ReturnType<typeof setTimeout>;

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._copyTimer) clearTimeout(this._copyTimer);
  }

  protected _tag(): string {
    return 'span';
  }

  protected _baseClass(): string {
    return '';
  }

  protected _classes(): string {
    return handleClsList([
      prefixCls,
      this._baseClass(),
      this.type ? `${prefixCls}-${this.type}` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.strong ? `${prefixCls}-strong` : '',
      this.italic ? `${prefixCls}-italic` : '',
      this.underline ? `${prefixCls}-underline` : '',
      this.delete ? `${prefixCls}-delete` : '',
      this.code ? `${prefixCls}-code` : '',
      this.ellipsis ? `${prefixCls}-ellipsis` : '',
      this.link ? `${prefixCls}-link` : '',
      this.size ? `${prefixCls}-size-${this.size}` : '',
      this.weight ? `${prefixCls}-weight-${this.weight}` : '',
      this.align ? `${prefixCls}-align-${this.align}` : '',
    ]);
  }

  private async _handleCopy(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const text = this.textContent?.trim() ?? '';
    try {
      await navigator.clipboard.writeText(text);
      this._copied = true;
      this.dispatchEvent(new CustomEvent('copy', {
        detail: { text },
        bubbles: true,
        composed: true,
      }));
      if (this._copyTimer) clearTimeout(this._copyTimer);
      this._copyTimer = setTimeout(() => {
        this._copied = false;
      }, 2000);
    } catch {
      // Clipboard may be unavailable outside secure contexts.
    }
  }

  private _renderCopy() {
    if (!this.copyable) return nothing;
    return html`
      <button
        class="${prefixCls}-copy"
        type="button"
        aria-label=${this._copied ? 'Copied' : 'Copy'}
        @click=${this._handleCopy}
      >
        ${this._copied ? html`<semi-icon-check></semi-icon-check>` : html`<semi-icon-copy></semi-icon-copy>`}
      </button>
    `;
  }

  protected _renderTag() {
    const cls = this._classes();
    const inner = html`<slot></slot>${this._renderCopy()}`;

    if (this.link) {
      return html`<a class="${cls}" href=${this.href ?? nothing} part="typography">${inner}</a>`;
    }

    switch (this._tag()) {
      case 'h1':
        return html`<h1 class="${cls}" part="typography">${inner}</h1>`;
      case 'h2':
        return html`<h2 class="${cls}" part="typography">${inner}</h2>`;
      case 'h3':
        return html`<h3 class="${cls}" part="typography">${inner}</h3>`;
      case 'h4':
        return html`<h4 class="${cls}" part="typography">${inner}</h4>`;
      case 'h5':
        return html`<h5 class="${cls}" part="typography">${inner}</h5>`;
      case 'h6':
        return html`<h6 class="${cls}" part="typography">${inner}</h6>`;
      case 'div':
        return html`<div class="${cls}" part="typography">${inner}</div>`;
      default:
        return html`<span class="${cls}" part="typography">${inner}</span>`;
    }
  }

  render() {
    return this._renderTag();
  }
}

@customElement('semi-typography-title')
export class SemiTypographyTitle extends TypographyBase {
  static styles = [typographyStyles, titleStyles];

  @property({ type: Number })
  heading: 1 | 2 | 3 | 4 | 5 | 6 = 1;

  protected _tag(): string {
    return `h${this.heading}`;
  }

  protected _baseClass(): string {
    return `${prefixCls}-title ${prefixCls}-heading-${this.heading}`;
  }
}

@customElement('semi-typography-text')
export class SemiTypographyText extends TypographyBase {
  static styles = typographyStyles;
}

@customElement('semi-typography-paragraph')
export class SemiTypographyParagraph extends TypographyBase {
  static styles = [typographyStyles, paragraphStyles];

  protected _tag(): string {
    return 'div';
  }

  protected _baseClass(): string {
    return `${prefixCls}-paragraph`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-typography-title': SemiTypographyTitle
    'semi-typography-text': SemiTypographyText
    'semi-typography-paragraph': SemiTypographyParagraph
  }
}

