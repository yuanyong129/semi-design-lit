# 官方组件对齐记录

基线：`d08ef1d`（P4.4）。对齐依据为 Semi Design 官方文档 API 表与官方源码：

- 文档：https://semi.design/zh-CN/start/overview
- 源码：https://github.com/DouyinFE/semi-design/tree/main/packages/semi-ui

状态说明：

- `已对齐`：公开属性、事件与关键行为均可用，只有 React 与 Web Components 的写法差异。
- `部分对齐`：主流程可用，但存在明确的能力或交互差异。
- `不可对齐`：受 Web Components / Lit 运行时限制，或依赖 React 专属能力。

## B1a 轻量反馈与输入

### Spin

官方契约：`spinning`、`size`（`small | middle | large`）、`tip`、`delay`、`indicator`、`wrapperClassName`、`childStyle`，包裹子元素时使用块级遮罩。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| `spinning` | 控制是否加载 | 同名 property / attribute | 已对齐 | — |
| `size` | 三档尺寸 | 三档尺寸，默认 `middle` | 已对齐 | — |
| `tip` | 指示器下方提示 | 同名 property | 已对齐 | — |
| `delay` | 延迟出现，避免闪烁 | 毫秒延迟；重新进入加载会先隐藏再计时 | 已对齐 | — |
| 包裹内容 | 子元素变淡并阻止交互 | 检测默认插槽内容，块级布局 + 半透明遮罩 | 已对齐 | 补充遮罩层级测试 |
| `indicator` | ReactNode | `TemplateResult` 或 `slot="indicator"` | 部分对齐 | 文档补充函数/模板用法 |
| `wrapperClassName` | 自定义外层类名 | 不提供 | 不可对齐 | 使用 `part="spin"` 与宿主 `class` 替代 |
| `childStyle` | 自定义子元素样式 | 不提供 | 不可对齐 | 由使用方直接给子元素写样式 |

### Rating

官方契约：`value` / `defaultValue`、`count`、`allowHalf`、`allowClear`、`disabled`、`size`（`small | default | number`）、`character`、`tooltips`、`onChange`、`onHoverChange`、无障碍属性。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 受控 / 非受控 | `value` / `defaultValue` | 同名 property | 已对齐 | — |
| `count` | 自定义星数 | 同名 property | 已对齐 | — |
| 半星 | 指针左半边为半星 | 按星体宽度计算 0.5 步进 | 已对齐 | — |
| 点击清除 | 再次点击当前分值归零 | `allowClear` 默认开启 | 已对齐 | — |
| 键盘 | 方向键 / Home / End / Enter | 支持同样的按键 | 已对齐 | 补充焦点环视觉 |
| 自定义字符 | ReactNode | 字符串或 `TemplateResult` | 部分对齐 | 增加函数式字符示例 |
| `tooltips` | 使用 Tooltip 组件 | 使用原生 `title` | 部分对齐 | 接入本项目 Tooltip 或记录为可接受差异 |
| `tabIndex` | 可配置 | 固定 `0` / 禁用时 `-1` | 部分对齐 | 增加 `tabIndex` property |
| `aria-label` | React 属性 | `ratingLabel` property，映射 `aria-label` | 部分对齐 | 文档说明 property 名称差异 |

### PinCode

官方契约：`value` / `defaultValue`、`count`（默认 6）、`format`（`number | mixed | RegExp | function`）、`disabled`、`size`、`validateStatus`、`autoFocus`、`onChange`、`onComplete`，支持逐格输入、退格、方向键、粘贴分配。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 受控 / 非受控 | `value` / `defaultValue` | 同名 property | 已对齐 | — |
| `count` | 默认 6 位 | 默认 6 位 | 已对齐 | — |
| `format` | 数字 / 混合 / 正则 / 函数 | 全部支持 | 已对齐 | 增加函数格式示例 |
| 键盘 | 退格、Delete、左右方向键 | 支持，并在退格时回退焦点 | 已对齐 | — |
| 粘贴 | 自动分配到后续格子 | 支持，过滤非法字符 | 已对齐 | — |
| `onComplete` | 填满时触发 | `complete` CustomEvent | 已对齐 | — |
| `autoFocus` | 默认聚焦第一格 | 默认开启，文档示例显式关闭 | 已对齐 | — |
| `aria-label` | React 属性 | `ariaLabel` property | 部分对齐 | 统一无障碍属性命名 |

## B1b 标签输入、回到顶部、悬浮按钮与折叠动画

### TagInput

官方契约：`value` / `defaultValue`、`inputValue`、`max`、`maxLength`、`maxTagCount`、`separator`、`addOnBlur`、`allowDuplicates`、`showClear`、`size`、`validateStatus`、`disabled`、`onChange` / `onAdd` / `onRemove` / `onExceed` / `onInputChange` / `onBlur`、`prefix` / `suffix` / `insetLabel`。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 受控 / 非受控 | `value` / `defaultValue` | 同名 property | 已对齐 | — |
| 添加与删除 | Enter 添加，空输入 Backspace 删除末项 | 相同；支持分隔符批量拆分 | 已对齐 | — |
| 数量与长度限制 | `max` / `maxLength` / `maxTagCount` | 同名 property；超限触发 `exceed` | 已对齐 | — |
| 折叠标签 | `+N` 使用 Popover 展示剩余标签 | `+N` 使用原生 `title` | 部分对齐 | 接入 Popover 后替换 |
| 前后缀与内嵌标签 | `prefix` / `suffix` / `insetLabel` | 命名插槽 / property | 已对齐 | — |
| `renderTagItem` / `draggable` | 自定义标签渲染与拖拽排序 | 不提供 | 不可对齐 | 使用 `semi-tag` 插槽组合；拖拽需业务层实现 |
| 标签弹出层属性 | `showRestTagsPopover` / `restTagsPopoverProps` | 不提供 | 不可对齐 | 由 `+N` 的 `title` 替代 |

### BackTop

官方契约：`target`、`visibilityHeight`（默认 400）、`duration`（默认 450）、`onClick`、`children`，滚动超过阈值后出现，点击平滑回顶。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 目标容器 | 函数返回 `window` 或元素 | 元素 / 选择器 / 函数，默认 `window` | 已对齐 | — |
| 阈值与时长 | `visibilityHeight` / `duration` | 同名 property，缓动函数一致 | 已对齐 | — |
| 点击回调 | `onClick` | `back-top-click` CustomEvent | 部分对齐 | 文档说明事件命名 |
| 自定义内容 | `children` | 默认插槽，保留默认图标 | 已对齐 | — |
| 动态目标切换 | 目标变化后重新绑定 | 支持；`target` 变更时解绑并重绑 | 已对齐 | 补充频繁切换测试 |

### FloatButton

官方契约：`shape`（`round | square`）、`size`、`colorful`、`icon`、`badge`、`href`、`target`、`disabled`、`onClick`；`FloatButtonGroup` 单独提供分组。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 形状与尺寸 | `round` / `square`，三档尺寸 | 同名 property 与类名 | 已对齐 | — |
| 彩色与图标 | `colorful`、ReactNode 图标 | `colorful`、`icon` property / `slot="icon"` | 已对齐 | — |
| 徽标 | `badge` 支持 Badge 配置对象 | 支持 `count` / `dot` / `overflowCount` / `showZero` / `type` 对象 | 部分对齐 | 增加 `badge` 插槽 |
| 链接与禁用 | `href` / `target` / `disabled` | 同名 property，禁用阻止跳转与点击 | 已对齐 | — |
| 分组 | `FloatButtonGroup` | 未实现 | 部分对齐 | 纳入后续批次 |
| 点击回调 | `onClick` | `click` 事件 | 部分对齐 | 文档说明事件命名 |

### Collapsible

官方契约：`isOpen`（默认 false）、`duration`（250）、`motion`、`keepDOM`、`lazyRender`、`fade`、`collapseHeight`、`collapseHeightAdaptive`、`reCalcKey`、`onMotionEnd`；无头部与键盘交互。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 展开状态 | `isOpen` | 同名 property / `is-open` attribute | 已对齐 | — |
| 高度动画 | 测量内容高度后过渡到 `auto` | 测量 inner 高度并过渡，结束后恢复 `auto` | 已对齐 | — |
| 关闭保留高度 | `collapseHeight` / adaptive | 同名 property，adaptive 取内容与配置的较小值 | 已对齐 | — |
| 延迟渲染与保留 DOM | `lazyRender` / `keepDOM` | 同名 property | 已对齐 | — |
| 淡出 | `fade` | 同名 property；仅在关闭高度为 0 时生效 | 已对齐 | — |
| 动画结束回调 | `onMotionEnd` | `motion-end` CustomEvent | 部分对齐 | 文档说明事件命名 |
| 内容尺寸变化 | ResizeObserver 持续测量 | `reCalcKey` 手动触发重新测量 | 部分对齐 | 接入 ResizeObserver |

## 通用差异

- React `ref` / `forwardRef`：改为元素公开方法（如 `focus()`、`blur()`）与 `updateComplete`。
- React Context：改为本项目 provider 组件与 CSS Token。
- `className` / `style`：改为宿主 `class`、CSS 自定义属性与 `part`。
- 官方内部 DOM 结构与类名不保证完全一致；公开类名、Token 与视觉结果保持一致。
