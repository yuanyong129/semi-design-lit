# @semi-design/semi-foundation

Semi Design Lit 的 foundation 层，对应 Semi 官方仓库的 `packages/semi-foundation`。

当前包含：

- `style/theme/global.ts`：Semi Design Token 常量（颜色语义、尺寸、圆角、字号等）
- `style/theme/index.ts`：全局字体、动效、z-index 等基础变量
- `style/theme/icon.ts`：图标基础样式（`semi-icon`、spin 动画）

组件库 `@semi-design/semi-ui` 通过相对路径引用这里的样式常量，避免在组件内重复硬编码设计变量。
