import { html, render, TemplateResult } from 'lit';
import { NotificationType } from './notification';
import './notification';

export interface NotificationOptions {
  title?: string;
  content?: string | TemplateResult;
  type?: NotificationType;
  duration?: number;
  closable?: boolean;
  id?: string;
}

interface NotificationItem extends Required<Pick<NotificationOptions, 'id'>> {
  title: string;
  content?: string | TemplateResult;
  type: NotificationType;
  duration: number;
  closable: boolean;
  timer?: ReturnType<typeof setTimeout>;
}

let container: HTMLElement | null = null;
let items: NotificationItem[] = [];
let uid = 0;

function ensureContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (container?.isConnected) return container;

  container = document.createElement('div');
  container.className = 'semi-notification-container';
  container.setAttribute('part', 'notification-container');
  Object.assign(container.style, {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: '2010',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px',
    pointerEvents: 'none',
  });
  document.body.appendChild(container);
  return container;
}

function update() {
  const target = ensureContainer();
  if (!target) return;

  render(
    html`${items.map((item) => html`
      <semi-notification
        .type=${item.type}
        .title=${item.title}
        .content=${item.content}
        .closable=${item.closable}
        @close=${() => close(item.id)}
      ></semi-notification>
    `)}`,
    target
  );

  if (!items.length) {
    target.remove();
    container = null;
  }
}

function close(id: string) {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return;
  const [item] = items.splice(index, 1);
  if (item?.timer) clearTimeout(item.timer);
  update();
}

function normalize(options: NotificationOptions, type: NotificationType): NotificationItem {
  return {
    id: options.id ?? `semi-notification-${++uid}`,
    title: options.title ?? '',
    content: options.content,
    type: options.type ?? type,
    duration: options.duration ?? 4500,
    closable: options.closable ?? true,
  };
}

function show(options: NotificationOptions): string {
  const item = normalize(options, 'info');
  items = [...items, item];
  if (item.duration > 0) {
    item.timer = setTimeout(() => close(item.id), item.duration);
  }
  update();
  return item.id;
}

export const Notification = {
  open: show,
  show,
  info(options: NotificationOptions) {
    return show({ ...options, type: 'info' });
  },
  success(options: NotificationOptions) {
    return show({ ...options, type: 'success' });
  },
  warning(options: NotificationOptions) {
    return show({ ...options, type: 'warning' });
  },
  error(options: NotificationOptions) {
    return show({ ...options, type: 'error' });
  },
  close,
  destroyAll() {
    items.forEach((item) => item.timer && clearTimeout(item.timer));
    items = [];
    if (container) {
      container.remove();
      container = null;
    }
  },
};
