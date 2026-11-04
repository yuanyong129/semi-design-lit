import { describe, expect, it, afterEach } from 'vitest';
import { html } from 'lit';
import '../packages/semi-ui/components/upload/upload';
import { fixture, cleanup } from './helpers';

afterEach(cleanup);

function chooseFiles(upload: any, files: File[]) {
  const input = upload.shadowRoot.querySelector('input[type="file"]');
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Upload', () => {
  it('adds a selected file and removes it', async () => {
    const upload = await fixture<any>(html`
      <semi-upload></semi-upload>
    `);
    let detail: any;
    upload.addEventListener('change', (event: CustomEvent) => (detail = event.detail));

    chooseFiles(upload, [new File(['hello'], 'hello.txt', { type: 'text/plain' })]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await upload.updateComplete;

    expect(upload.shadowRoot.querySelector('.semi-upload-file-name').textContent).toBe('hello.txt');
    expect(detail.file.name).toBe('hello.txt');

    upload.shadowRoot.querySelector('.semi-upload-file-remove').click();
    await upload.updateComplete;

    expect(upload.shadowRoot.querySelector('.semi-upload-file')).toBeNull();
  });

  it('respects the file limit', async () => {
    const upload = await fixture<any>(html`
      <semi-upload limit="1" multiple></semi-upload>
    `);

    chooseFiles(upload, [
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await upload.updateComplete;

    expect(upload.shadowRoot.querySelectorAll('.semi-upload-file').length).toBe(1);
  });

  it('skips files rejected by beforeUpload', async () => {
    const upload = await fixture<any>(html`
      <semi-upload .beforeUpload=${() => false}></semi-upload>
    `);

    chooseFiles(upload, [new File(['a'], 'a.txt', { type: 'text/plain' })]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await upload.updateComplete;

    expect(upload.shadowRoot.querySelector('.semi-upload-file')).toBeNull();
  });

  it('renders picture cards in picture mode', async () => {
    const upload = await fixture<any>(html`
      <semi-upload list-type="picture" multiple></semi-upload>
    `);

    chooseFiles(upload, [new File(['a'], 'cover.png', { type: 'image/png' })]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await upload.updateComplete;

    expect(upload.shadowRoot.querySelectorAll('.semi-upload-picture-card').length).toBe(1);
    expect(upload.shadowRoot.querySelector('.semi-upload-picture-card').textContent).toContain('cover.png');
  });
});
