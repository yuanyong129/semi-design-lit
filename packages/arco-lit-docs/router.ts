import { html } from "lit";
import { PathRouteConfig } from "@lit-labs/router";

export const routers: PathRouteConfig[]  = [
  { name: 'Home', path: '/', render: () => html`` },
  { name: 'Button', path: '/button', render: () => html`<button-docs></button-docs>` },
  { name: 'Divider', path: '/divider', render: () => html`<divider-docs></divider-docs>` },
  { name: 'Empty', path: '/empty', render: () => html`<empty-docs></empty-docs>` },
  { name: 'Link', path: '/link', render: () => html`<link-docs></link-docs>` },
  { name: 'Radio', path: '/radio', render: () => html`<radio-docs></radio-docs>` },
  { name: 'Space', path: '/space', render: () => html`<space-docs></space-docs>` },
  { name: 'Switch', path: '/switch', render: () => html`<switch-docs></switch-docs>` },
  { name: 'Tag', path: '/tag', render: () => html`<tag-docs></tag-docs>` },
];
