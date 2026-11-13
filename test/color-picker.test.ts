import { afterEach, describe, expect, it } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/color-picker/color-picker';
import { SemiColorPicker } from '../packages/semi-ui/components/color-picker/color-picker';
import { colorStringToValue } from '../packages/semi-ui/components/color-picker';
import { cleanup, fixture } from './helpers';

afterEach(cleanup);

const rect = (width: number, height: number): DOMRect =>
  ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  }) as DOMRect;

const panelOf = (element: any) =>
  element.shadowRoot.querySelector('semi-color-picker-panel') as any;

const settle = async (element: any) => {
  await element.updateComplete;
  await panelOf(element)?.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await element.updateComplete;
  await panelOf(element)?.updateComplete;
};

const press = (target: EventTarget, x: number, y: number) => {
  target.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      composed: true,
      button: 0,
      clientX: x,
      clientY: y,
    })
  );
  document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }));
};

describe('ColorPicker', () => {
  it('renders the default color and converts color strings', async () => {
    const element = await fixture<any>(html`<semi-color-picker></semi-color-picker>`);
    await settle(element);

    expect(panelOf(element).color.hex).toBe('#39c5bb');
    expect(panelOf(element).shadowRoot.querySelector('.semi-colorPicker-colorPickerInput').value).toBe('#39c5bb');
    expect(colorStringToValue('#ff0000').rgba).toMatchObject({ r: 255, g: 0, b: 0, a: 1 });
    expect(SemiColorPicker.colorStringToValue('rgba(1,2,3,0.5)').hex).toBe('#01020380');
    expect(() => colorStringToValue('not-a-color')).toThrow(
      'Semi ColorPicker: error on static colorStringToValue method, input value is invalid: not-a-color'
    );
  });

  it('updates saturation and brightness from the choose area', async () => {
    const element = await fixture<any>(html`
      <semi-color-picker .defaultValue=${colorStringToValue('#39c5bb')}></semi-color-picker>
    `);
    await settle(element);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));
    const area = panelOf(element).shadowRoot.querySelector('.semi-colorPicker-colorChooseArea') as HTMLElement;
    area.getBoundingClientRect = () => rect(280, 280);

    press(area, 140, 70);
    await settle(element);

    expect(changes.at(-1).value.hsva).toMatchObject({ s: 50, v: 75 });
    expect(panelOf(element).shadowRoot.querySelector('.semi-colorPicker-handle')).toBeTruthy();
  });

  it('updates hue and alpha from their sliders', async () => {
    const element = await fixture<any>(html`
      <semi-color-picker alpha .defaultValue=${colorStringToValue('#39c5bb')}></semi-color-picker>
    `);
    await settle(element);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));
    const hue = panelOf(element).shadowRoot.querySelector('.semi-colorPicker-colorSlider') as HTMLElement;
    const alpha = panelOf(element).shadowRoot.querySelector('.semi-colorPicker-alphaSlider') as HTMLElement;
    hue.getBoundingClientRect = () => rect(280, 10);
    alpha.getBoundingClientRect = () => rect(280, 10);

    press(hue, 70, 5);
    await settle(element);
    press(alpha, 140, 5);
    await settle(element);

    expect(changes.at(-1).value.hsva.h).toBe(90);
    expect(changes.at(-1).value.hsva.a).toBe(0.5);
    expect(changes.at(-1).value.hex.endsWith('80')).toBe(true);
  });

  it('accepts hex, rgba and hsva input formats', async () => {
    const element = await fixture<any>(html`<semi-color-picker alpha></semi-color-picker>`);
    await settle(element);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));
    const panel = panelOf(element);
    const input = panel.shadowRoot.querySelector('.semi-colorPicker-colorPickerInput') as HTMLInputElement;
    const select = panel.shadowRoot.querySelector('.semi-colorPicker-formatSelect') as HTMLSelectElement;

    input.value = '#112233';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await settle(element);
    expect(changes.at(-1).value.hex).toBe('#112233');

    select.value = 'rgba';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    expect(input.value).toBe('17,34,51');

    input.value = '10,20,30,0.75';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await settle(element);
    expect(changes.at(-1).value.rgba).toMatchObject({ r: 10, g: 20, b: 30, a: 0.75 });

    select.value = 'hsva';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(element);
    input.value = '200,50,60';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await settle(element);
    expect(changes.at(-1).value.hsva).toMatchObject({ h: 200, s: 50, v: 60 });
  });

  it('applies the alpha number input', async () => {
    const element = await fixture<any>(html`<semi-color-picker alpha></semi-color-picker>`);
    await settle(element);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));
    const input = panelOf(element).shadowRoot.querySelector(
      '.semi-colorPicker-colorPickerInputNumber'
    ) as HTMLInputElement;

    input.value = '35';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(element);

    expect(changes.at(-1).value.rgba.a).toBe(0.35);
    expect(changes.at(-1).value.hex.endsWith('59')).toBe(true);
  });

  it('honours controlled value instead of updating the internal color', async () => {
    const initial = colorStringToValue('#39c5bb');
    const element = await fixture<any>(html`
      <semi-color-picker .value=${initial}></semi-color-picker>
    `);
    await settle(element);
    const changes: any[] = [];
    element.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail));
    const area = panelOf(element).shadowRoot.querySelector('.semi-colorPicker-colorChooseArea') as HTMLElement;
    area.getBoundingClientRect = () => rect(280, 280);

    press(area, 200, 40);
    await settle(element);

    expect(changes).toHaveLength(1);
    expect(panelOf(element).color.hex).toBe(initial.hex);
  });

  it('opens the popover and renders custom trigger, slots and dimensions', async () => {
    const element = await fixture<any>(html`
      <semi-color-picker use-popover width="240" height="160">
        <button>Pick</button>
      </semi-color-picker>
    `);
    await settle(element);
    const trigger = element.shadowRoot.querySelector('semi-trigger') as any;
    const button = element.shadowRoot.querySelector('.semi-colorPicker-popover-trigger') as HTMLElement;
    button.click();
    await settle(element);
    await trigger.updateComplete;

    expect(trigger.open).toBe(true);
    const triggerRoot = trigger.renderRoot as ParentNode;
    const popupPanel = triggerRoot.querySelector('semi-color-picker-panel') as any;
    expect(popupPanel).toBeTruthy();
    const popupArea = popupPanel.shadowRoot.querySelector('.semi-colorPicker-colorChooseArea') as HTMLElement;
    expect(popupArea.getAttribute('style')).toContain('width:240px');
    expect(popupArea.getAttribute('style')).toContain('height:160px');

    const slotted = await fixture<any>(html`
      <semi-color-picker
        .topSlot=${html`<span class="top-slot">Top</span>`}
        .bottomSlot=${html`<span class="bottom-slot">Bottom</span>`}
      ></semi-color-picker>
    `);
    await settle(slotted);
    expect(panelOf(slotted).shadowRoot.querySelector('.top-slot').textContent).toBe('Top');
    expect(panelOf(slotted).shadowRoot.querySelector('.bottom-slot').textContent).toBe('Bottom');
  });

  it('omits alpha controls when alpha is disabled', async () => {
    const element = await fixture<any>(html`<semi-color-picker></semi-color-picker>`);
    await settle(element);

    expect(panelOf(element).shadowRoot.querySelector('.semi-colorPicker-alphaSlider')).toBeNull();
    expect(panelOf(element).shadowRoot.querySelector('.semi-colorPicker-colorPickerInputNumber')).toBeNull();
  });
});
