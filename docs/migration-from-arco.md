# 从 Arco Design 迁移到 Semi Design

本仓库原先是一个 Arco Design 的 Lit 移植项目（`arco-design-lit`），现在已整体迁移为
Semi Design 的 Lit 实现（`semi-design-lit`）。

- Semi Design 上游仓库：<https://github.com/DouyinFE/semi-design>
- Semi Design 官网：<https://semi.design/zh-CN/>
- 设计变量：<https://semi.design/zh-CN/basic/tokens>

## 1. 命名

| 项目 | Arco | Semi |
| --- | --- | --- |
| 包名 | `@arco-design/web-lit` | `@semi-design/web-lit` |
| 文档包 | `@arco-design/arco-lit-docs` | `@semi-design/semi-lit-docs` |
| 自定义元素 | `a-button` | `semi-button` |
| JS 类名 | `ArcoButton` | `SemiButton` |
| 组件类名前缀 | `arco-btn` | `semi-button` |
| CSS 变量 | `--color-primary-6`、`--arco-*` | `--semi-color-primary`、`--semi-*` |

## 2. 设计变量

Arco 的调色板是 `--primary-1` ~ `--primary-10` 的 10 阶数字色板，Semi 使用
语义化变量 + 具名调色板：

```css
/* Semi 语义变量 */
--semi-color-primary
--semi-color-primary-hover
--semi-color-primary-active
--semi-color-primary-light-default
--semi-color-text-0 ~ --semi-color-text-3
--semi-color-fill-0 ~ --semi-color-fill-2
--semi-color-border
--semi-border-radius-small (3px)
--semi-border-radius-medium (6px)
--semi-border-radius-large (12px)

/* Semi 调色板：amber / blue / cyan / green / grey / indigo / ... */
--semi-blue-0 ~ --semi-blue-9
```

Semi 的暗色主题会反转调色板的明暗（`-0` 为深色、`-9` 为浅色），因此组件中直接使用
`rgba(var(--semi-blue-0), 1)` 这类写法即可同时适配亮色与暗色。

本仓库内置的 Token 文件：

```
packages/web-lit/components/style/theme/tokens.css
```

## 3. 组件 API 对照

### Button

| Arco | Semi | 说明 |
| --- | --- | --- |
| `type="primary"` | `type="primary"` | 一致 |
| `type="secondary"` | `type="secondary"` | Semi 默认类型为 primary |
| `type="dashed"` | `type="tertiary"` 或 `theme="outline"` | Semi 无 dashed 类型 |
| `type="outline"` | `theme="outline"` | 由 type 改为 theme |
| `type="text"` | `theme="borderless"` | 由 type 改为 theme |
| `status="warning"` | `type="warning"` | 状态合并进 type |
| `status="danger"` | `type="danger"` | 状态合并进 type |
| `long` | `block` | 属性重命名 |
| `size="mini/small/medium/large"` | `size="small/default/large"` | 尺寸收敛 |
| `shape="round/circle"` | 无 | 仅图标时自动正方形 |
| — | `theme="solid/light/outline/borderless"` | 新增主题 |
| — | `icon` / `icon-position` | 新增图标 API |

### ButtonGroup

| Arco | Semi |
| --- | --- |
| `type` / `status` / `size` / `shape` | `type` / `theme` / `size` |
| `disabled` | `disabled` |

### Divider

| Arco | Semi |
| --- | --- |
| `direction="horizontal/vertical"` | `layout="horizontal/vertical"` |
| `orientation="left/center/right"` | `orientation`（一致） |
| `type="solid/dashed/dotted/double"` | `type="solid/dashed/dotted"` |
| `size` | 移除 |
| `margin` | `margin`（一致） |

### Empty

| Arco | Semi |
| --- | --- |
| `description` | `description` |
| `imgSrc` | `image-src` |
| `imageSlot` | `image` 或 `slot="image"` |
| — | `title` / `layout="vertical/horizontal"` |

### Input

| Arco | Semi |
| --- | --- |
| `allowClear` | `show-clear` |
| `prependSlot` / `appendSlot` | `addon-before` / `addon-after` |
| `size="mini/small/medium/large"` | `size="small/default/large"` |
| `error` | `error`（一致） |
| — | `prefix` / `suffix` / `borderless` |

### Link

| Arco | Semi |
| --- | --- |
| `status="normal/success/warning/danger"` | `theme="primary/secondary/tertiary/success/warning/danger"` |
| `hoverable` | 移除（默认无底色） |
| — | `underline` |
| `loading` | 移除 |

### Radio / RadioGroup

| Arco | Semi |
| --- | --- |
| `type="radio/button"` | `type="default/button/card"` |
| `direction` | `direction`（一致） |
| `options` | `options`（一致） |
| `size` | 移除 |
| — | `button-style="solid/outline"` |

### Space

| Arco | Semi |
| --- | --- |
| `size` | `spacing` |
| `size="mini/small/medium/large"` | `spacing="tight/medium/loose"` 或数字 |
| `align` / `direction` / `wrap` | 一致 |
| `fill` / `split` | 移除 |

### Switch

| Arco | Semi |
| --- | --- |
| `defaultChecked` | `default-checked` |
| `checkedValue` / `uncheckedValue` | 移除，改用 `checked` |
| `type="circle/round/line"` | 移除 |
| `checkedColor` / `uncheckedColor` | 移除（由主题 Token 控制） |
| `beforeChange` | 移除 |
| `checkedText` / `uncheckedText` | `checked-text` / `unchecked-text` |
| `size="small/medium"` | `size="small/default/large"` |

### Tag

| Arco | Semi |
| --- | --- |
| `bordered` | `type="light/ghost/solid"` |
| `checkable` / `checked` | 移除（请使用 Checkbox + Tag） |
| `loading` | 移除 |
| `color`（red/orangered/...） | `color`（amber/blue/cyan/...） |
| `size="small/medium/large"` | `size="small/default/large"` |
| — | `shape="square/circle"`、`prefix-icon` / `suffix-icon` |

### ConfigProvider

| Arco | Semi |
| --- | --- |
| `prefixCls="arco"` | `prefix-cls="semi"` |
| `locale` | `locale` |
| `size` | `size` |
| `rtl` | `rtl` |
| — | `theme-mode="light/dark"` |

## 4. 样式实现方式

- **删除了 Arco 的 Less 主题体系**（`style/theme/*.less`、`style/color/*`、`components/**/*.less`），
  改为 Lit 的 `css` 模板 + Semi Design Token CSS 变量。
- 每个组件自带 Shadow DOM 样式，主题变量通过 `body` / `:root` 继承进入 Shadow DOM。
- 全局样式入口：`packages/web-lit/components/style/index.css`，包含
  `normalize.css` 与 Semi Tokens，并导出为包的 `style.css`。

## 5. 暗色模式

```html
<semi-config-provider theme-mode="dark">
  ...
</semi-config-provider>
```

`ConfigProvider` 会把 `theme-mode="dark"` 同步到 `document.body`，从而启用
`body[theme-mode='dark']` 下的 Semi 暗色变量。

## 6. 仍待补充的组件

当前仓库聚焦于以下 10 个组件：Button、ButtonGroup、Divider、Empty、Input、Link、
Radio、Space、Switch、Tag（外加扩展组件 Scrollbar）。Semi Design 的其余组件
（Table、Select、DatePicker、Form 等）尚未移植，可按相同的 Token + Lit 模式继续实现。
