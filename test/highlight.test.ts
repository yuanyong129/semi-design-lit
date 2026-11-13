import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/highlight/highlight';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const text = (element: any) =>
  Array.from(element.shadowRoot.childNodes)
    .filter(
      (node: any) =>
        node.nodeName !== 'STYLE' && (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
    )
    .map((node: any) => node.textContent)
    .join('');

describe('Highlight', () => {
  it('highlights multiple words and leaves other text intact', async () => {
    const element = await fixture<any>(html`
      <semi-highlight
        .sourceString=${'Semi Design 是一个设计系统'}
        .searchWords=${['Semi', '设计']}
      ></semi-highlight>
    `);

    const marks = element.shadowRoot.querySelectorAll('mark');
    expect(Array.from(marks).map((node: any) => node.textContent)).toEqual(['Semi', '设计']);
    expect(text(element)).toBe('Semi Design 是一个设计系统');
    expect(marks[0].className).toContain('semi-highlight-tag');
  });

  it('respects case-sensitive matching', async () => {
    const element = await fixture<any>(html`
      <semi-highlight
        case-sensitive
        .sourceString=${'semi Semi semi'}
        .searchWords=${['Semi']}
      ></semi-highlight>
    `);

    expect(element.shadowRoot.querySelectorAll('mark')).toHaveLength(1);
    expect(element.shadowRoot.querySelector('mark').textContent).toBe('Semi');
  });

  it('escapes regular-expression characters by default', async () => {
    const element = await fixture<any>(html`
      <semi-highlight
        .sourceString=${'a.b axb a.b'}
        .searchWords=${['a.b']}
      ></semi-highlight>
    `);

    expect(Array.from(element.shadowRoot.querySelectorAll('mark')).map((node: any) => node.textContent)).toEqual([
      'a.b',
      'a.b',
    ]);
  });

  it('merges overlapping matches', async () => {
    const element = await fixture<any>(html`
      <semi-highlight
        .sourceString=${'Semi Design Lit'}
        .searchWords=${['Semi', 'Design', 'Design Lit']}
      ></semi-highlight>
    `);

    expect(Array.from(element.shadowRoot.querySelectorAll('mark')).map((node: any) => node.textContent)).toEqual([
      'Semi',
      'Design Lit',
    ]);
  });

  it('applies global and per-word styles', async () => {
    const element = await fixture<any>(html`
      <semi-highlight
        highlight-class-name="custom-highlight"
        .highlightStyle=${{ padding: '0 2px' }}
        .sourceString=${'Semi 设计'}
        .searchWords=${[
          { text: 'Semi' },
          { text: '设计', style: { color: 'rgb(216, 57, 49)' } },
        ]}
      ></semi-highlight>
    `);

    const marks = element.shadowRoot.querySelectorAll('mark');
    expect(marks[0].className).toContain('custom-highlight');
    expect(marks[0].style.padding).toBe('0px 2px');
    expect(marks[1].style.color).toBe('rgb(216, 57, 49)');
  });

  it('supports a custom highlight tag and falls back to mark', async () => {
    const strong = await fixture<any>(html`
      <semi-highlight
        component="strong"
        .sourceString=${'Semi Design'}
        .searchWords=${['Semi']}
      ></semi-highlight>
    `);
    expect(strong.shadowRoot.querySelector('strong').textContent).toBe('Semi');

    const fallback = await fixture<any>(html`
      <semi-highlight
        component="script"
        .sourceString=${'Semi Design'}
        .searchWords=${['Semi']}
      ></semi-highlight>
    `);
    expect(fallback.shadowRoot.querySelector('script')).toBeNull();
    expect(fallback.shadowRoot.querySelector('mark').textContent).toBe('Semi');
  });

  it('renders empty source as empty and preserves unmatched text', async () => {
    const empty = await fixture<any>(html`<semi-highlight></semi-highlight>`);
    expect(text(empty)).toBe('');

    const unmatched = await fixture<any>(html`
      <semi-highlight
        .sourceString=${'Semi Design'}
        .searchWords=${['Vue']}
      ></semi-highlight>
    `);
    expect(unmatched.shadowRoot.querySelectorAll('mark')).toHaveLength(0);
    expect(text(unmatched)).toBe('Semi Design');
  });
});
