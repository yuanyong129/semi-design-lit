import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/typography/typography';
import '../packages/semi-ui/components/checkbox/checkbox';
import '../packages/semi-ui/components/checkbox/checkbox-group';
import '../packages/semi-ui/components/form/form';
import '../packages/semi-ui/components/form/form-item';
import '../packages/semi-ui/components/input/input';
import '../packages/semi-ui/components/textarea/textarea';
import '../packages/semi-ui/components/input-number/input-number';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

describe('Typography', () => {
  it('renders the requested heading level with typography classes', async () => {
    const title = await fixture<any>(html`<semi-typography-title heading="2">标题</semi-typography-title>`);
    const heading = title.shadowRoot.querySelector('h2');

    expect(heading).toBeTruthy();
    expect(heading.classList.contains('semi-typography-heading-2')).toBe(true);
  });

  it('applies text type and code classes', async () => {
    const text = await fixture<any>(html`<semi-typography-text type="danger" code>内容</semi-typography-text>`);
    const span = text.shadowRoot.querySelector('.semi-typography');

    expect(span.classList.contains('semi-typography-danger')).toBe(true);
    expect(span.classList.contains('semi-typography-code')).toBe(true);
  });
});

describe('Checkbox', () => {
  it('checks a checkbox in a group and emits the selected values', async () => {
    const group = await fixture<any>(html`
      <semi-checkbox-group .defaultValue=${['a']}>
        <semi-checkbox value="a">A</semi-checkbox>
        <semi-checkbox value="b">B</semi-checkbox>
      </semi-checkbox-group>
    `);
    const boxes = [...group.querySelectorAll('semi-checkbox')];
    let detail: any;
    group.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    expect(boxes[0].shadowRoot.querySelector('.semi-checkbox').classList.contains('semi-checkbox-checked')).toBe(true);

    boxes[1].shadowRoot.querySelector('input').click();
    await group.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(boxes[1].shadowRoot.querySelector('.semi-checkbox').classList.contains('semi-checkbox-checked')).toBe(true);
    expect(detail.value).toEqual(['a', 'b']);
  });
});

describe('Form', () => {
  it('registers fields, writes values and validates required/email rules', async () => {
    const form = await fixture<any>(html`
      <semi-form>
        <semi-form-item field="username" label="用户名" .rules=${[{ required: true, message: '请输入用户名' }]}>
          <semi-input></semi-input>
        </semi-form-item>
        <semi-form-item field="email" label="邮箱" .rules=${[{ type: 'email', message: '邮箱格式不正确' }]}>
          <semi-input></semi-input>
        </semi-form-item>
      </semi-form>
    `);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const emptyErrors = await form.validate();
    expect(emptyErrors.username.message).toBe('请输入用户名');

    const inputs = [...form.querySelectorAll('semi-input')];
    inputs[0].dispatchEvent(new CustomEvent('change', {
      detail: { value: 'Semi' },
      bubbles: true,
      composed: true,
    }));
    inputs[1].dispatchEvent(new CustomEvent('change', {
      detail: { value: 'not-an-email' },
      bubbles: true,
      composed: true,
    }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(form.getValues().username).toBe('Semi');
    const errors = await form.validate();
    expect(errors.email.message).toBe('邮箱格式不正确');
  });
});

describe('TextArea', () => {
  it('updates its value and emits change on input', async () => {
    const textarea = await fixture<any>(html`<semi-textarea></semi-textarea>`);
    const native = textarea.shadowRoot.querySelector('textarea');
    let detail: any;
    textarea.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    native.value = '多行文本';
    native.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await textarea.updateComplete;

    expect(native.value).toBe('多行文本');
    expect(detail.value).toBe('多行文本');
  });
});

describe('InputNumber', () => {
  it('steps and clamps the value', async () => {
    const input = await fixture<any>(html`<semi-input-number default-value="3" max="4"></semi-input-number>`);
    const native = input.shadowRoot.querySelector('input');
    const increase = input.shadowRoot.querySelector('.semi-input-number-control');

    expect(native.value).toBe('3');
    increase.click();
    await input.updateComplete;
    expect(native.value).toBe('4');

    increase.click();
    await input.updateComplete;
    expect(native.value).toBe('4');
  });
});
