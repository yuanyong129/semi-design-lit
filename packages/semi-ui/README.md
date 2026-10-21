# @semi-design/semi-ui

Semi Design 组件的 Lit Web Components 实现，对应 Semi 官方仓库的 `packages/semi-ui`。

```ts
import '@semi-design/semi-ui';
import '@semi-design/semi-icons';
import '@semi-design/semi-theme-default/style.css';
```

```html
<semi-button type="primary" theme="solid">主要按钮</semi-button>
```

组件目录与 Semi 官方保持一致，每个组件一个目录：

```
components/
  button/
  config-provider/
  divider/
  empty/
  input/
  link/
  radio/
  scrollbar/
  space/
  switch/
  tag/
```

`config-provider` 提供语言、尺寸、暗色模式与 RTL 配置；`scrollbar` 为本项目扩展组件。
