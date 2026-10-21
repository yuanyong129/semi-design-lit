# @semi-design/semi-icons

Semi Design 图标的 Lit Web Components 实现，对应 Semi 官方仓库的 `packages/semi-icons`。

```ts
import '@semi-design/semi-icons';
```

```html
<semi-icon-plus></semi-icon-plus>
<semi-icon-loading spin></semi-icon-loading>
<semi-icon-close></semi-icon-close>
```

图标基类位于 `icon-component/`，所有图标使用 Shadow DOM 渲染 SVG，并继承 `currentColor` 与 `1em` 尺寸。
