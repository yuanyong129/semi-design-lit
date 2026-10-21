# @semi-design/semi-theme-default

Semi Design 默认主题（亮色 / 暗色）的 Design Tokens，对应 Semi 官方仓库的 `packages/semi-theme-default`。

```ts
import '@semi-design/semi-theme-default/style.css';
```

- `tokens.css`：Semi 官方调色板与语义变量（`--semi-color-primary`、`--semi-color-text-0` 等）
- `normalize.css`：基础 reset
- `index.css`：全局入口，包含 Tokens、reset 与 body 字体

暗色模式：

```html
<body theme-mode="dark"></body>
```
