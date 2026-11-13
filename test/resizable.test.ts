import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/resizable/resizable';
import { cleanup, fixture } from './helpers';

afterEach(() => {
  cleanup();
});

const drag = async (
  element: any,
  direction: string,
  deltaX: number,
  deltaY: number
): Promise<void> => {
  const handle = element.shadowRoot.querySelector(
    `.semi-resizable-resizableHandler-${direction}`
  ) as HTMLElement;
  handle.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      composed: true,
      button: 0,
      clientX: 100,
      clientY: 100,
    })
  );
  window.dispatchEvent(
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 100 + deltaX,
      clientY: 100 + deltaY,
    })
  );
  window.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      clientX: 100 + deltaX,
      clientY: 100 + deltaY,
    })
  );
  await element.updateComplete;
};

const size = (element: any) => ({
  width: element.shadowRoot.host.style.width,
  height: element.shadowRoot.host.style.height,
});

describe('Resizable', () => {
  it('renders all eight handles and applies the default size', async () => {
    const element = await fixture<any>(html`
      <semi-resizable .defaultSize=${{ width: 200, height: 120 }}></semi-resizable>
    `);

    expect(element.shadowRoot.querySelectorAll('.semi-resizable-resizableHandler')).toHaveLength(8);
    expect(size(element)).toEqual({ width: '200px', height: '120px' });
    expect(element.classList.contains('semi-resizable-resizable')).toBe(true);
  });

  it('hides handles when enable is false and filters disabled directions', async () => {
    const hidden = await fixture<any>(html`<semi-resizable .enable=${false}></semi-resizable>`);
    expect(hidden.shadowRoot.querySelectorAll('.semi-resizable-resizableHandler')).toHaveLength(0);

    const partial = await fixture<any>(html`
      <semi-resizable
        .enable=${{ top: false, left: false, topLeft: false, bottomLeft: false }}
      ></semi-resizable>
    `);
    const directions = Array.from(
      partial.shadowRoot.querySelectorAll('.semi-resizable-resizableHandler')
    ).map((node: any) => node.getAttribute('data-direction'));
    expect(directions).toEqual(['right', 'bottom', 'topRight', 'bottomRight']);
  });

  it('resizes from the bottom-right handle and emits change/resize-end', async () => {
    const element = await fixture<any>(html`
      <semi-resizable .defaultSize=${{ width: 200, height: 120 }}></semi-resizable>
    `);
    const changes: any[] = [];
    element.addEventListener('change', (event: CustomEvent) => changes.push(event.detail));

    await drag(element, 'bottomRight', 60, 40);

    expect(size(element)).toEqual({ width: '260px', height: '160px' });
    expect(changes.at(-1)).toMatchObject({ width: 260, height: 160, direction: 'bottomRight' });
  });

  it('resizes from the left/top direction using the negative delta', async () => {
    const element = await fixture<any>(html`
      <semi-resizable .defaultSize=${{ width: 200, height: 120 }}></semi-resizable>
    `);

    await drag(element, 'topLeft', 50, 30);

    expect(size(element)).toEqual({ width: '150px', height: '90px' });
  });

  it('rounds to the grid and respects min/max constraints', async () => {
    const element = await fixture<any>(html`
      <semi-resizable
        .defaultSize=${{ width: 200, height: 120 }}
        .grid=${[20, 20]}
        min-width="180"
        max-width="240"
      ></semi-resizable>
    `);

    await drag(element, 'right', 53, 0);
    expect(size(element).width).toBe('240px');

    await drag(element, 'right', -200, 0);
    expect(size(element).width).toBe('180px');
  });

  it('snaps to configured points', async () => {
    const element = await fixture<any>(html`
      <semi-resizable
        .defaultSize=${{ width: 200, height: 120 }}
        .snap=${{ x: [220, 300] }}
        .snapGap=${20}
      ></semi-resizable>
    `);

    await drag(element, 'right', 18, 0);

    expect(size(element).width).toBe('220px');
  });

  it('locks the aspect ratio while dragging', async () => {
    const element = await fixture<any>(html`
      <semi-resizable
        .defaultSize=${{ width: 200, height: 100 }}
        lock-aspect-ratio
      ></semi-resizable>
    `);

    await drag(element, 'bottomRight', 50, 10);

    expect(size(element)).toEqual({ width: '250px', height: '125px' });
  });

  it('reports the controlled size and keeps the supplied size', async () => {
    const element = await fixture<any>(html`
      <semi-resizable .size=${{ width: 300, height: 160 }}></semi-resizable>
    `);

    expect(size(element)).toEqual({ width: '300px', height: '160px' });
    await drag(element, 'right', 40, 0);
    expect(size(element)).toEqual({ width: '300px', height: '160px' });
  });
});
