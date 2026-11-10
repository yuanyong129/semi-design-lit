import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { breadcrumbItemStyles } from './style/breadcrumb-item.style';

/**
 * A single breadcrumb item.
 */
@customElement('semi-breadcrumb-item')
export class SemiBreadcrumbItem extends LitElement {
  /**
   * @zh 链接地址
   * @en Link address
   */
  @property()
  href?: string;

  /**
   * @zh 链接打开方式
   * @en Link target
   * @defaultValue '_self'
   */
  @property()
  target = '_self';

  /**
   * @zh 是否为当前页面
   * @en Whether this is the current page
   */
  @property({ type: Boolean })
  current = false;

  /**
   * @zh 禁用
   * @en Disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  protected render() {
    const ariaCurrent = this.current ? 'page' : undefined;
    const content = html`<slot></slot>`;

    return this.href && !this.disabled
      ? html`<a
          part="link"
          href=${this.href}
          target=${this.target}
          aria-current=${ifDefined(ariaCurrent)}
        >${content}</a>`
      : html`<span part="text" class="text" aria-current=${ifDefined(ariaCurrent)}>${content}</span>`;
  }

  static styles = breadcrumbItemStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-breadcrumb-item': SemiBreadcrumbItem;
  }
}
