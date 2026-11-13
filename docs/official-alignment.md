# 官方组件对齐记录

基线：`9608ada`（B1b）。对齐依据为 Semi Design 官方文档 API 表与官方源码：

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

## B2a 自动补全与滑动输入条

### AutoComplete

官方契约：`value` / `defaultValue`、`data`、`onSearch`、`onChange`、`onSelect`、`loading`、`size`、`position`、`showClear`、`emptyContent`、`trigger`；官方不在组件内过滤 `data`，由使用方在 `onSearch` 中筛选后回传。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 受控值 | `value` / `defaultValue` 为字符串或数字 | 同名 property，字符串；额外提供 `inputValue` | 部分对齐 | 文档说明 `inputValue` 为本地扩展 |
| 数据过滤 | 组件不过滤，父级监听 `onSearch` 后回传 `data` | 同样不在组件内过滤，文档示例由父级筛选 | 已对齐 | — |
| 搜索与变更顺序 | 先 `onSearch(inputValue)`，再 `onChange(value)` | 先 `search { inputValue }`，再 `change { value }` | 已对齐 | — |
| 选择事件 | `onSelect(value, option)` | `select { value, item, event }` | 部分对齐 | 文档说明 detail 结构 |
| 清空 | 清空输入并重新打开候选，触发搜索与变更 | 新增 `clear` 事件，随后 `search` / `change`，并重新打开 | 部分对齐 | 事件命名差异，文档说明 |
| 空内容 | `emptyContent` 默认无内容 | 默认 `''`，无候选时保持空白 | 已对齐 | — |
| 弹出位置 | 默认 `bottomLeft`，支持自动翻转 | 复用 Trigger 的 `top` / `bottom` 与对齐参数 | 部分对齐 | 补充 `bottomLeft` 等别名或文档说明 |
| 键盘 | 打开后方向键移动、Enter 选择、Esc 关闭 | 支持；关闭时方向键 / Enter 先打开 | 已对齐 | — |
| 无障碍 | 官方实现较弱，无完整 combobox 语义 | 增加 `combobox`、`listbox`、`aria-activedescendant` | 已对齐（增强） | 保持与官方 DOM 的差异记录 |
| 自定义选项 | `renderItem` / `renderSelectedItem` 为 React 渲染函数 | 不提供函数式渲染，使用 `data.label` 与默认菜单 | 不可对齐 | 需要自定义时使用 `semi-auto-complete-menu` 或后续插槽 |
| 下拉显隐事件 | `onDropdownVisibleChange` | `open-change { open }` | 部分对齐 | 文档说明事件命名 |

### Slider

官方契约：`value` / `defaultValue`、`min` / `max` / `step`、`range`、`vertical`、`verticalReverse`、`reverse`、`marks`、`tooltip`、`included`、`showBoundary`、`disabled`、`onChange` / `onAfterChange`；官方步进以 0 为原点，范围为双滑块。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 单值与范围 | 单值数字，`range` 时为双值数组 | 同名 property；范围值自动排序 | 已对齐 | 排序为本地增强，写入差异说明 |
| 最小值 / 最大值 / 步长 | `min`、`max`、`step`；步进以 0 为原点 | 同名 property；步进以 `min` 为原点并夹取到边界 | 部分对齐 | 记录步进原点差异，避免边界值漂移 |
| 变更事件 | `onChange` 持续触发，`onAfterChange` 结束时触发 | `change` / `change-complete`，detail 为 `{ value }` | 已对齐 | 文档说明事件命名 |
| 垂直与反向 | `vertical`、`verticalReverse`、`reverse` | 同名 property；最小值在底部，反向轨道与把手一致 | 已对齐 | — |
| 刻度与标签 | `marks`、`showMarkLabel`、`tooltipOnMark` | 支持 `marks` / `showMarkLabel`；`tooltipOnMark` 尚未实现 | 部分对齐 | 补充刻度悬浮提示 |
| 提示框 | `tooltipVisible`、`tipFormatter`、`showArrow` | 同名 property，支持拖拽 / 悬浮 / 聚焦显示 | 已对齐 | — |
| 轨道与边界 | `included`、`showBoundary` | 同名 property；显示边界时隐藏端点重复刻度文字 | 已对齐 | 视觉细节与官方略有差异 |
| 禁用与键盘 | `disabled`，方向键 / Home / End 调节 | 支持；额外支持 PageUp / PageDown | 已对齐（增强） | — |
| 把手圆点 | `handleDot` 支持尺寸、颜色与数组 | 支持并作用在把手 | 部分对齐 | 核对官方数组索引语义 |
| 无障碍 | 每个把手提供 slider 语义 | 增加 `aria-valuenow` / `aria-valuetext` / `aria-orientation` | 已对齐（增强） | — |

## B2b 时间选择器

### TimePicker

官方契约：`type`（`time` / `timeRange`）、`value` / `defaultValue`、`format`、`use12Hours`、`rangeSeparator`、`open` / `defaultOpen`、`showClear`、`size`、`validateStatus`、`borderless`、`inputReadOnly`、`autoFocus`、`focusOnOpen`、`hideDisabledOptions`、`hourStep` / `minuteStep` / `secondStep`、`disabledHours` / `disabledMinutes` / `disabledSeconds` / `disabledTime`、`panelHeader` / `panelFooter`、`onChange` / `onOpenChange`；官方使用 date-fns 解析和格式化。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 单值 / 范围 | `type` 为 `time` 或 `timeRange`，范围用分隔符连接两个值 | 同名 property；支持字符串、数字、`Date` 与数组 | 已对齐 | 文档说明值类型 |
| 格式与解析 | date-fns 任意 format token | 支持 `HH/H/hh/h/mm/m/ss/s/a/A` 常用 token | 部分对齐 | 补充更多 token 或说明支持范围 |
| 12 小时制 | `use12Hours`，默认格式 `a h:mm:ss`，面板含上午/下午 | 同名 property；面板提供上午/下午列 | 已对齐 | — |
| 受控展开 | `open` / `defaultOpen`，`onOpenChange` | 同名 property，`open-change` 事件 | 已对齐 | 文档说明事件命名 |
| 时间步长 | `hourStep` / `minuteStep` / `secondStep` | 同名 property | 已对齐 | — |
| 禁用时段 | `disabledHours` / `disabledMinutes` / `disabledSeconds` / `disabledTime` | 支持前三个与 `hideDisabledOptions`；范围 `disabledTime` 未实现 | 部分对齐 | 增加范围 `disabledTime` 回调 |
| 面板头尾 | `panelHeader` / `panelFooter` 为 ReactNode | property 接受 TemplateResult / 文本 | 部分对齐 | 增加 `slot="panel-header"` / `slot="panel-footer"` |
| 输入与键盘 | 输入、Enter 提交、Esc 关闭、方向键打开 | 支持；面板选中后保持展开 | 已对齐 | 如需“选中即关闭”可增加配置 |
| 清除 | `showClear`，清空并触发变更 | 同名 property，触发 `clear` 与 `change` | 已对齐 | 事件命名与 detail 写入文档 |
| 尺寸与状态 | `size`、`validateStatus`、`borderless`、`inputReadOnly` | 同名 property | 已对齐 | — |
| 焦点 | `autoFocus` / `focusOnOpen` | 同名 property；打开时按需聚焦输入框 | 已对齐 | — |
| 自定义触发 / 样式 | `triggerRender`、`inputStyle`、`zIndex` | 未提供 | 不可对齐 | 使用宿主 CSS 与 Trigger 组合；记录为 React 渲染差异 |
| 无障碍 | 官方输入框未提供完整 dialog / listbox 语义 | 输入框增加 `aria-label`、`aria-invalid` | 已对齐（增强） | 保持差异记录 |

## 通用差异

- React `ref` / `forwardRef`：改为元素公开方法（如 `focus()`、`blur()`）与 `updateComplete`。
- React Context：改为本项目 provider 组件与 CSS Token。
- `className` / `style`：改为宿主 `class`、CSS 自定义属性与 `part`。
- 官方内部 DOM 结构与类名不保证完全一致；公开类名、Token 与视觉结果保持一致。
