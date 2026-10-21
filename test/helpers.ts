import { render, type TemplateResult } from 'lit';

/** Render a Lit template into a detached container attached to body. */
export async function fixture<T extends Element>(template: TemplateResult): Promise<T> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(template, container);

  const element = container.firstElementChild as T;
  await (element as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));

  return element;
}

export function cleanup() {
  document.body.innerHTML = '';
}
