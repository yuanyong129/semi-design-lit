import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import type { HighlightSearchWord, HighlightSearchWords } from './interface';

interface HighlightChunk {
  start: number;
  end: number;
  highlight: boolean;
  className?: string;
  style?: Record<string, string | number>;
}

const escapeRegExp = (value: string): string =>
  value.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&');

const normalizeWords = (words: HighlightSearchWords): HighlightSearchWord[] => {
  const list = Array.isArray(words) ? words : [];
  return list
    .map((word) => (typeof word === 'string' ? { text: word } : word))
    .filter((word): word is HighlightSearchWord => Boolean(word?.text));
};

/**
 * Highlights occurrences of search words inside a source string.
 *
 * The component is inline by default so it can be used directly inside text.
 */
@customElement('semi-highlight')
export class SemiHighlight extends LitElement {
  /**
   * @zh 需要高亮的原始文本
   * @en Source text to highlight
   */
  @property({ attribute: 'source-string' })
  sourceString = '';

  /**
   * @zh 搜索词，支持字符串或带样式的对象
   * @en Search words, as strings or objects with per-word styles
   */
  @property({ attribute: false })
  searchWords: HighlightSearchWords = [];

  /**
   * @zh 是否区分大小写
   * @en Whether matching is case sensitive
   */
  @property({ attribute: 'case-sensitive', type: Boolean })
  caseSensitive = false;

  /**
   * @zh 是否自动转义搜索词中的正则字符
   * @en Whether to escape regular-expression characters in search words
   */
  @property({ attribute: 'auto-escape', type: Boolean })
  autoEscape = true;

  /**
   * @zh 高亮节点的额外类名
   * @en Extra class name for highlighted nodes
   */
  @property({ attribute: 'highlight-class-name' })
  highlightClassName = '';

  /**
   * @zh 高亮节点的额外样式
   * @en Extra styles for highlighted nodes
   */
  @property({ attribute: false })
  highlightStyle: Record<string, string | number> = {};

  /**
   * @zh 高亮节点标签名，默认 mark
   * @en Highlight tag name, defaults to mark
   */
  @property()
  component = 'mark';

  private _findChunks(): HighlightChunk[] {
    const source = this.sourceString ?? '';
    const words = normalizeWords(this.searchWords);
    const matches: HighlightChunk[] = [];

    words.forEach((word) => {
      let pattern = word.text;
      if (this.autoEscape) pattern = escapeRegExp(pattern);
      let regex: RegExp;
      try {
        regex = new RegExp(pattern, this.caseSensitive ? 'g' : 'gi');
      } catch {
        return;
      }
      let match: RegExpExecArray | null;
      while ((match = regex.exec(source))) {
        const start = match.index;
        const end = regex.lastIndex;
        if (end > start) {
          matches.push({
            start,
            end,
            highlight: true,
            className: word.className,
            style: word.style,
          });
        }
        if (match.index === regex.lastIndex) regex.lastIndex += 1;
      }
    });

    if (!matches.length) {
      return source ? [{ start: 0, end: source.length, highlight: false }] : [];
    }

    const merged: HighlightChunk[] = [];
    matches
      .sort((a, b) => a.start - b.start)
      .forEach((chunk) => {
        const previous = merged[merged.length - 1];
        if (previous && chunk.start <= previous.end) {
          previous.end = Math.max(previous.end, chunk.end);
          previous.className = previous.className || chunk.className;
          previous.style = { ...previous.style, ...chunk.style };
        } else {
          merged.push({ ...chunk });
        }
      });

    const result: HighlightChunk[] = [];
    let cursor = 0;
    merged.forEach((chunk) => {
      if (chunk.start > cursor) {
        result.push({ start: cursor, end: chunk.start, highlight: false });
      }
      result.push(chunk);
      cursor = chunk.end;
    });
    if (cursor < source.length) {
      result.push({ start: cursor, end: source.length, highlight: false });
    }
    return result;
  }

  private _renderHighlight(content: string, chunk: HighlightChunk): TemplateResult {
    const name = ['mark', 'span', 'strong', 'em', 'b', 'i'].includes(this.component)
      ? this.component
      : 'mark';
    const tag = unsafeStatic(name);
    return staticHtml`<${tag}
      part="highlight"
      class=${['semi-highlight-tag', this.highlightClassName, chunk.className]
        .filter(Boolean)
        .join(' ')}
      style=${styleMap({ ...this.highlightStyle, ...chunk.style })}
    >${content}</${tag}>`;
  }

  protected render() {
    const source = this.sourceString ?? '';
    if (!source) return nothing;
    return html`${this._findChunks().map((chunk) => {
      const content = source.slice(chunk.start, chunk.end);
      return chunk.highlight ? this._renderHighlight(content, chunk) : content;
    })}`;
  }

  static styles = css`
    :host {
      display: inline;
    }

    .semi-highlight-tag {
      padding: 0;
      color: inherit;
      background: var(--semi-color-highlight-bg, rgba(255, 232, 0, 0.35));
      border-radius: 2px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-highlight': SemiHighlight;
  }
}
