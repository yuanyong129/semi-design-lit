let lockCount = 0;
let previousOverflow = '';

/** Lock body scrolling while at least one overlay is open. */
export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

/** Release one body scroll lock. */
export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement
  );
}

export function focusFirst(root: HTMLElement) {
  const focusable = getFocusableElements(root);
  (focusable[0] ?? root).focus();
}

/** Keep Tab / Shift+Tab inside the overlay. Returns true when handled. */
export function trapTabKey(event: KeyboardEvent, root: HTMLElement): boolean {
  if (event.key !== 'Tab') return false;

  const focusable = getFocusableElements(root);
  if (!focusable.length) {
    event.preventDefault();
    root.focus();
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const rootNode = root.getRootNode() as ShadowRoot;
  const active = (rootNode.activeElement ?? document.activeElement) as HTMLElement | null;

  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}
