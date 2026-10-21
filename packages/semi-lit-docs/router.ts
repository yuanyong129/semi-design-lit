import { html } from "lit";
import { PathRouteConfig } from "@lit-labs/router";

export const routers: PathRouteConfig[] = [
  { name: 'Home', path: '/', render: () => html`` },
  { name: 'Button', path: '/basic/button', render: () => html`<button-docs></button-docs>` },
  { name: 'Divider', path: '/basic/divider', render: () => html`<divider-docs></divider-docs>` },
  { name: 'Link', path: '/basic/link', render: () => html`<link-docs></link-docs>` },
  { name: 'Space', path: '/basic/space', render: () => html`<space-docs></space-docs>` },
  { name: 'Input', path: '/input/input', render: () => html`<input-docs></input-docs>` },
  { name: 'Radio', path: '/input/radio', render: () => html`<radio-docs></radio-docs>` },
  { name: 'Switch', path: '/input/switch', render: () => html`<switch-docs></switch-docs>` },
  { name: 'Empty', path: '/show/empty', render: () => html`<empty-docs></empty-docs>` },
  { name: 'Tag', path: '/show/tag', render: () => html`<tag-docs></tag-docs>` },
  { name: 'Scrollbar', path: '/other/scrollbar', render: () => html`<scrollbar-docs></scrollbar-docs>` },
];
