import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  TagInputExceedDetail,
  TagInputSeparator,
  TagInputSize,
  TagInputSplit,
  TagInputValidateStatus,
} from './interface';
import { tagInputStyles } from './style/tag-input.style';
import '../../../semi-icons/build/close';

let tagInputId = 0;

/**
 * An input that turns committed text into tags.
 */
@customElement('semi-tag-input')
export class SemiTagInput extends LitElement {
  /**
   * @zh 受控标签值
   * @en Controlled tag values
   */
  @property({ attribute: false })
  value?: string[];

  /**
   * @zh 默认标签值
   * @en Default tag values
   */
  @property({ attribute: false })
  defaultValue?: string[];

  /**
   * @zh 受控输入框文本
   * @en Controlled input text
   */
  @property({ attribute: 'input-value' })
  inputValue?: string;

  /**
   * @zh 是否禁用
   * @en Whether the input is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * @zh 单个标签的最大字符数
   * @en Maximum characters per tag
   */
  @property({ type: Number, attribute: 'max-length' })
  maxLength?: number;

  /**
   * @zh 标签数量上限
   * @en Maximum number of tags
   */
  @property({ type: Number })
  max?: number;

  /**
   * @zh 最多展示的标签数量，其余折叠为 +N
   * @en Maximum visible tags, the rest collapse to +N
   */
  @property({ type: Number, attribute: 'max-tag-count' })
  maxTagCount?: number;

  /**
   * @zh 是否允许重复标签
   * @en Whether duplicate tags are allowed
   */
  @property({ type: Boolean, attribute: 'allow-duplicates' })
  allowDuplicates = true;

  /**
   * @zh 失焦时是否提交输入内容
   * @en Whether to commit input text on blur
   */
  @property({ type: Boolean, attribute: 'add-on-blur' })
  addOnBlur = false;

  /**
   * @zh 显示清空按钮
   * @en Whether to show the clear button
   */
  @property({ type: Boolean, attribute: 'show-clear' })
  showClear = false;

  /**
   * @zh 标签分隔符
   * @en Tag separator
   */
  @property()
  separator: TagInputSeparator = ',';

  /**
   * @zh 自定义字符串拆分函数
   * @en Custom string split function
   */
  @property({ attribute: false })
  split?: TagInputSplit;

  /**
   * @zh 输入框尺寸
   * @en Input size
   */
  @property()
  size: TagInputSize = 'default';

  /**
   * @zh 校验状态
   * @en Validation status
   */
  @property({ attribute: 'validate-status' })
  validateStatus: TagInputValidateStatus = 'default';

  /**
   * @zh 占位文案
   * @en Placeholder
   */
  @property()
  placeholder = '';

  /**
   * @zh 内嵌标签
   * @en Inset label
   */
  @property({ attribute: 'inset-label' })
  insetLabel = '';

  /**
   * @zh 是否自动聚焦
   * @en Whether to focus automatically
   */
  @property({ type: Boolean, attribute: 'autofocus' })
  autoFocus = false;

  /**
   * @zh 是否展示标签内容提示
   * @en Whether to show the tag content tooltip
   */
  @property({ type: Boolean, attribute: 'show-content-tooltip' })
  showContentTooltip = true;

  @state()
  private _tags: string[] = [];

  @state()
  private _input = '';

  @state()
  private _focused = false;

  @state()
  private _hovering = false;

  @state()
  private _initialized = false;

  private _inputId = `semi-tag-input-${++tagInputId}`;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._initialized) {
      this._tags = [...(this.value ?? this.defaultValue ?? [])];
      this._input = this.inputValue ?? '';
      this._initialized = true;
    }
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('value') && this.value) {
      this._tags = [...this.value];
    }
    if (changed.has('inputValue') && this.inputValue !== undefined) {
      this._input = this.inputValue;
    }
  }

  protected firstUpdated(): void {
    if (this.autoFocus && !this.disabled) {
      this.focus();
    }
  }

  /**
   * Focus the inner input.
   */
  focus(options?: FocusOptions): void {
    this._innerInput?.focus(options);
  }

  /**
   * Blur the inner input.
   */
  blur(): void {
    this._innerInput?.blur();
  }

  private get _innerInput(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input');
  }

  private _dispatch(name: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _split(value: string): string[] {
    if (this.split) {
      return this.split(value, this.separator);
    }
    if (this.separator === null) {
      return [value];
    }
    const separators = Array.isArray(this.separator) ? this.separator : [this.separator];
    if (separators.length === 0) {
      return [value];
    }
    const escaped = separators
      .filter((item) => item.length > 0)
      .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (escaped.length === 0) {
      return [value];
    }
    return value.split(new RegExp(escaped.join('|')));
  }

  private _setInput(value: string, event?: Event): void {
    this._input = value;
    this._dispatch('input-change', { value, event });
  }

  private _setTags(next: string[]): void {
    this._tags = next;
    this._dispatch('change', { value: [...next] });
  }

  private _commit(raw: string = this._input, event?: Event): void {
    const splitTags = this._split(raw)
      .map((item) => item.trim())
      .filter((item) => item !== '');
    if (splitTags.length === 0) {
      this._setInput('', event);
      return;
    }

    const added: string[] = [];
    for (const tag of splitTags) {
      const value = this.maxLength ? tag.slice(0, this.maxLength) : tag;
      if (!this.allowDuplicates && (this._tags.includes(value) || added.includes(value))) {
        continue;
      }
      added.push(value);
    }

    let next = [...this._tags, ...added];
    if (this.max !== undefined && next.length > this.max) {
      const detail: TagInputExceedDetail = { value: next };
      this._dispatch('exceed', detail);
      next = next.slice(0, this.max);
    }

    if (next.length !== this._tags.length) {
      this._tags = next;
      this._dispatch('change', { value: [...next] });
      this._dispatch('add', { value: [...added] });
    }
    this._setInput('', event);
  }

  private _removeTag(tag: string, index: number): void {
    if (this.disabled) {
      return;
    }
    const next = this._tags.filter((_, i) => i !== index);
    this._tags = next;
    this._dispatch('remove', { value: tag, index });
    this._dispatch('change', { value: [...next] });
    this.focus();
  }

  private _handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.maxLength !== undefined) {
      const exceeds = this._split(value).some((item) => item.length > this.maxLength!);
      if (exceeds) {
        target.value = this._input;
        this._dispatch('input-exceed', { value });
        return;
      }
    }
    this._setInput(value, event);
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this._input !== '') {
        this._commit(this._input, event);
      }
      return;
    }
    if (event.key === 'Backspace' && this._input === '' && this._tags.length > 0) {
      event.preventDefault();
      this._removeTag(this._tags[this._tags.length - 1], this._tags.length - 1);
    }
  };

  private _handleFocus = (): void => {
    this._focused = true;
    this._dispatch('focus', {});
  };

  private _handleBlur = (event: FocusEvent): void => {
    this._focused = false;
    if (this.addOnBlur && !this.disabled) {
      this._commit(this._input, event);
    }
    this._dispatch('blur', { event });
  };

  private _handleClear = (event: Event): void => {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this._tags = [];
    this._setInput('');
    this._dispatch('change', { value: [] });
    this.focus();
  };

  private _handleContainerClick = (): void => {
    if (!this.disabled) {
      this.focus();
    }
  };

  private _handleMouseEnter = (): void => {
    this._hovering = true;
  };

  private _handleMouseLeave = (): void => {
    this._hovering = false;
  };

  protected render() {
    const tags = this._tags;
    const maxTagCount = this.maxTagCount;
    const visibleTags =
      maxTagCount !== undefined && maxTagCount >= 0 && tags.length > maxTagCount
        ? tags.slice(0, maxTagCount)
        : tags;
    const restTags = maxTagCount !== undefined && maxTagCount >= 0 ? tags.slice(maxTagCount) : [];
    const showClear = this.showClear && !this.disabled && (tags.length > 0 || this._input !== '');
    const classes = {
      'semi-tagInput': true,
      'semi-tagInput-focus': this._focused,
      'semi-tagInput-disabled': this.disabled,
      'semi-tagInput-hover': this._hovering,
      'semi-tagInput-small': this.size === 'small',
      'semi-tagInput-large': this.size === 'large',
      'semi-tagInput-error': this.validateStatus === 'error',
      'semi-tagInput-warning': this.validateStatus === 'warning',
      'semi-tagInput-success': this.validateStatus === 'success',
    };
    const ariaInvalid =
      this.validateStatus === 'error' || this.validateStatus === 'warning' ? 'true' : 'false';
    const label = this.getAttribute('aria-label') || '标签输入';
    const tagSize = this.size === 'small' ? 'small' : 'default';
    const hasInsetLabel = Boolean(this.insetLabel || this.querySelector('[slot="inset-label"]'));

    return html`
      <div
        class=${classMap(classes)}
        part="tag-input"
        @click=${this._handleContainerClick}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        ${hasInsetLabel
          ? html`<span class="semi-tagInput-inset-label" id=${`${this._inputId}-label`}>
              <slot name="inset-label">${this.insetLabel}</slot>
            </span>`
          : nothing}
        <slot name="prefix"></slot>
        <div class="semi-tagInput-wrapper">
          ${visibleTags.map(
            (tag, index) => html`<semi-tag
              class="semi-tagInput-tag"
              size=${tagSize}
              type="light"
              color="white"
              closable
              title=${this.showContentTooltip ? tag : nothing}
              @close=${(event: Event) => {
                event.stopPropagation();
                this._removeTag(tag, index);
              }}
            >${tag}</semi-tag>`
          )}
          ${restTags.length > 0
            ? html`<span
                class="semi-tagInput-rest"
                title=${restTags.join(', ')}
                aria-label=${`还有 ${restTags.length} 个标签`}
              >+${restTags.length}</span>`
            : nothing}
          <input
            id=${this._inputId}
            class="semi-tagInput-input"
            type="text"
            .value=${this._input}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            aria-label=${label}
            aria-invalid=${ariaInvalid}
            @input=${this._handleInput}
            @keydown=${this._handleKeyDown}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
          />
        </div>
        ${showClear
          ? html`<button
              class="semi-tagInput-clearBtn"
              type="button"
              aria-label="清空"
              @click=${this._handleClear}
            >
              <semi-icon-close></semi-icon-close>
            </button>`
          : nothing}
        <slot name="suffix"></slot>
      </div>
    `;
  }

  static styles = tagInputStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tag-input': SemiTagInput;
  }
}
