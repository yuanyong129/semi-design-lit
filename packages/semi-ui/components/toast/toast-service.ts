import { html, render, TemplateResult } from 'lit';
import { ToastType } from './toast';
import './toast';

export interface ToastOptions {
  content: string | TemplateResult;
  type?: ToastType;
  duration?: number;
  closable?: boolean;
  id?: string;
}

interface ToastItem extends Required<Pick<ToastOptions, 'content' | 'type' | 'duration' | 'closable' | 'id'>> {
  timer?: ReturnType<typeof setTimeout>;
}

let container: HTMLElement | null = null;
let items: ToastItem[] = [];
let uid = 0;

function ensureContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (container?.isConnected) return container;

  container = document.createElement('div');
  container.className = 'semi-toast-container';
  container.setAttribute('part', 'toast-container');
  Object.assign(container.style, {
    position: 'fixed',
    top: '24px',
    left: '50%',
    zIndex: '2000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    pointerEvents: 'none',
    transform: 'translateX(-50%)',
  });
  document.body.appendChild(container);
  return container;
}

function update() {
  const target = ensureContainer();
  if (!target) return;

  render(
    html`${items.map((item) => html`
      <semi-toast
        .type=${item.type}
        .content=${item.content}
        .closable=${item.closable}
        @close=${() => close(item.id)}
      ></semi-toast>
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

function normalize(options: ToastOptions | string, type: ToastType): ToastItem {
  const value = typeof options === 'string' ? { content: options } : options;
  return {
    id: value.id ?? `semi-toast-${++uid}`,
    content: value.content,
    type: value.type ?? type,
    duration: value.duration ?? 3000,
    closable: value.closable ?? false,
  };
}

function show(options: ToastOptions | string): string {
  const item = normalize(options, 'info');
  items = [...items, item];
  if (item.duration > 0) {
    item.timer = setTimeout(() => close(item.id), item.duration);
  }
  update();
  return item.id;
}

export const Toast = {
  show,
  open: show,
  info(options: ToastOptions | string) {
    return show({ ...(typeof options === 'string' ? { content: options } : options), type: 'info' });
  },
  success(options: ToastOptions | string) {
    return show({ ...(typeof options === 'string' ? { content: options } : options), type: 'success' });
  },
  warning(options: ToastOptions | string) {
    return show({ ...(typeof options === 'string' ? { content: options } : options), type: 'warning' });
  },
  error(options: ToastOptions | string) {
    return show({ ...(typeof options === 'string' ? { content: options } : options), type: 'error' });
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
