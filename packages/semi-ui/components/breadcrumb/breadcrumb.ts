import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { breadcrumbStyles } from './style/breadcrumb.style';

/**
 * Breadcrumb navigation container.
 */
@customElement('semi-breadcrumb')
export class SemiBreadcrumb extends LitElement {
  /**
   * @zh 分隔符
   * @en Separator between items
   * @defaultValue '/'
   */
  @property()
  separator = '/';

  /**
   * @zh 紧凑模式
   * @en Compact mode
   */
  @property({ type: Boolean, reflect: true })
  compact = false;

  protected render() {
    const styles = styleMap({
      '--semi-breadcrumb-separator': JSON.stringify(this.separator),
      '--semi-breadcrumb-separator-gap': this.compact ? '4px' : '8px',
    });

    return html`
      <nav
        class="semi-breadcrumb ${this.compact ? 'semi-breadcrumb-compact' : ''}"
        style=${styles}
        aria-label="Breadcrumb"
        part="breadcrumb"
      >
        <ol class="semi-breadcrumb-list">
          <slot></slot>
        </ol>
      </nav>
    `;
  }

  static styles = breadcrumbStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-breadcrumb': SemiBreadcrumb;
  }
}
