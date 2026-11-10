import { afterEach, describe, expect, it, vi } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/tree/tree';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

describe('Tree async loading', () => {
  it('loads children when expanding a node', async () => {
    const data: any[] = [
      { key: 'design', label: '设计系统' },
      { key: 'changelog', label: '更新日志', isLeaf: true },
    ];
    let resolveLoad!: () => void;
    const loadData = vi.fn(() => new Promise<void>((resolve) => (resolveLoad = resolve)));
    const element = await fixture<any>(html`
      <semi-tree .treeData=${data} .loadData=${loadData}></semi-tree>
    `);
    let loaded: any;
    element.addEventListener('load', (event: CustomEvent) => (loaded = event.detail));

    const switcher = element.shadowRoot.querySelector('.semi-tree-switcher');
    switcher.click();
    await element.updateComplete;

    expect(loadData).toHaveBeenCalledWith(data[0]);
    expect(switcher.getAttribute('aria-busy')).toBe('true');
    expect(element.shadowRoot.querySelector('.semi-tree-loading')).not.toBeNull();

    data[0].children = [{ key: 'semi', label: 'Semi Design' }];
    resolveLoad();
    await Promise.resolve();
    await Promise.resolve();
    await element.updateComplete;

    expect(loaded.node.key).toBe('design');
    expect(element.shadowRoot.querySelector('.semi-tree-loading')).toBeNull();
    expect(element.shadowRoot.textContent).toContain('Semi Design');
  });

  it('does not load a leaf node', async () => {
    const data = [{ key: 'changelog', label: '更新日志', isLeaf: true }];
    const loadData = vi.fn(() => Promise.resolve());
    const element = await fixture<any>(html`
      <semi-tree .treeData=${data} .loadData=${loadData}></semi-tree>
    `);

    expect(element.shadowRoot.querySelector('.semi-tree-spacer')).not.toBeNull();
    expect(loadData).not.toHaveBeenCalled();
  });
});

describe('Tree drag and drop', () => {
  it('emits drop information for an inside drop', async () => {
    const data = [
      {
        key: 'design',
        label: '设计系统',
        children: [{ key: 'semi', label: 'Semi Design' }],
      },
      { key: 'components', label: '组件', children: [] },
    ];
    const element = await fixture<any>(html`
      <semi-tree draggable .treeData=${data} default-expand-all></semi-tree>
    `);
    let dropped: any;
    element.addEventListener('drop', (event: CustomEvent) => (dropped = event.detail));

    const nodes = [...element.shadowRoot.querySelectorAll('.semi-tree-node')] as HTMLElement[];
    const source = nodes.find((node) => node.dataset.key === 'semi')!;
    const target = nodes.find((node) => node.dataset.key === 'components')!;
    const dataTransfer = { effectAllowed: '', dropEffect: '', setData: vi.fn() };
    const dragEvent = (type: string, clientY = 16) => {
      const event = new MouseEvent(type, { bubbles: true, clientY });
      Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
      return event;
    };
    target.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      right: 100,
      bottom: 32,
      width: 100,
      height: 32,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    source.dispatchEvent(dragEvent('dragstart'));
    target.dispatchEvent(dragEvent('dragover'));
    await element.updateComplete;
    expect(target.classList.contains('semi-tree-node-drop-inside')).toBe(true);

    target.dispatchEvent(dragEvent('drop'));
    expect(dropped.dragNode.key).toBe('semi');
    expect(dropped.dropNode.key).toBe('components');
    expect(dropped.dropPosition).toBe('inside');
  });
});
