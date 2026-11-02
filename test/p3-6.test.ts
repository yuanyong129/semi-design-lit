import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/transfer/transfer';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

const dataSource = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
  { key: 'c', label: 'Gamma', disabled: true },
];

describe('Transfer', () => {
  it('moves selected items between panels', async () => {
    const transfer = await fixture<any>(html`
      <semi-transfer
        .dataSource=${dataSource}
        .defaultTargetKeys=${['a']}
      ></semi-transfer>
    `);
    let detail: any;
    transfer.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    const panels = transfer.shadowRoot.querySelectorAll('.semi-transfer-panel');
    expect(panels[0].textContent).toContain('Beta');
    expect(panels[1].textContent).toContain('Alpha');

    panels[0].querySelectorAll('.semi-transfer-item input')[0].click();
    await transfer.updateComplete;
    transfer.shadowRoot.querySelectorAll('.semi-transfer-operation')[0].click();
    await transfer.updateComplete;

    expect(detail.direction).toBe('right');
    expect(detail.targetKeys).toEqual(['a', 'b']);

    const nextPanels = transfer.shadowRoot.querySelectorAll('.semi-transfer-panel');
    expect(nextPanels[0].textContent).not.toContain('Beta');
    expect(nextPanels[1].textContent).toContain('Beta');
  });

  it('filters items with search', async () => {
    const transfer = await fixture<any>(html`
      <semi-transfer .dataSource=${dataSource} show-search></semi-transfer>
    `);
    const search = transfer.shadowRoot.querySelector('.semi-transfer-panel .semi-transfer-search input') as HTMLInputElement;
    search.value = 'beta';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await transfer.updateComplete;

    const source = transfer.shadowRoot.querySelector('.semi-transfer-panel');
    expect(source.textContent).toContain('Beta');
    expect(source.textContent).not.toContain('Alpha');
  });

  it('does not move disabled items', async () => {
    const transfer = await fixture<any>(html`
      <semi-transfer .dataSource=${dataSource}></semi-transfer>
    `);
    const disabled = transfer.shadowRoot.querySelectorAll('.semi-transfer-item input')[2] as HTMLInputElement;
    expect(disabled.disabled).toBe(true);
  });
});
