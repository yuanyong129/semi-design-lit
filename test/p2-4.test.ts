import { describe, expect, it, afterEach } from 'vitest';
import { Toast } from '../packages/semi-ui/components/toast';
import { Notification } from '../packages/semi-ui/components/notification';
import { cleanup } from './helpers';

afterEach(() => {
  Toast.destroyAll();
  Notification.destroyAll();
  cleanup();
});

describe('Toast', () => {
  it('renders a toast and closes it by id', async () => {
    const id = Toast.success({ content: '保存成功', duration: 0, closable: true });
    const container = document.querySelector('.semi-toast-container');
    const item = container?.querySelector('semi-toast') as any;

    expect(item).toBeTruthy();
    await item.updateComplete;
    expect(item.shadowRoot.querySelector('.semi-toast-success')).toBeTruthy();
    expect(item.shadowRoot.textContent).toContain('保存成功');

    Toast.close(id);
    expect(document.querySelector('.semi-toast-container')).toBeNull();
  });

  it('supports multiple types and destroyAll', () => {
    Toast.info('信息');
    Toast.warning('警告');
    Toast.error('错误');
    const items = document.querySelectorAll('.semi-toast-container semi-toast');
    expect(items.length).toBe(3);

    Toast.destroyAll();
    expect(document.querySelector('.semi-toast-container')).toBeNull();
  });
});

describe('Notification', () => {
  it('renders title/content and closes', async () => {
    const id = Notification.success({
      title: '发布成功',
      content: '新版本已发布',
      duration: 0,
    });
    const container = document.querySelector('.semi-notification-container');
    const item = container?.querySelector('semi-notification') as any;

    expect(item).toBeTruthy();
    await item.updateComplete;
    expect(item.shadowRoot.textContent).toContain('发布成功');
    expect(item.shadowRoot.textContent).toContain('新版本已发布');

    Notification.close(id);
    expect(document.querySelector('.semi-notification-container')).toBeNull();
  });
});
