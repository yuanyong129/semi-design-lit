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

### Cascader

官方契约：`value` / `defaultValue`、`treeData`、`keyMaps`、`multiple`、`changeOnSelect`、`autoMergeValue`、`leafOnly`、`checkRelation`、`loadData`、`separator`、`filterTreeNode`、`filterLeafOnly`、`remote`、`displayRender`、`showClear`、`defaultOpen`、`onChange` / `onSelect` / `onSearch` / `onClear` / `onDropdownVisibleChange`；官方以完整路径作为值，使用 `_SEMI_CASCADER_SPLIT_` 作为内部键分隔符。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 单值 / 多值 | 单值为路径数组，多值为路径数组的数组；标量归一化为单节点路径 | 同名 property 与归一化逻辑；内部键使用 `_SEMI_CASCADER_SPLIT_` | 已对齐 | — |
| 数据字段映射 | `keyMaps` 重命名 value/label/children/disabled/isLeaf | 同名 property，树构建与面板统一使用映射后的字段 | 已对齐 | — |
| 单选交互 | 非叶子点击展开；叶子点击 `select` + `change` 并关闭；`changeOnSelect` 允许选非叶子 | 已实现；叶子关闭、非叶子仅展开 | 部分对齐 | 补 `showNext='hover'` 的悬浮展开 |
| 多选交互 | 复选框级联、`autoMergeValue`、`leafOnly`、`checkRelation`、`max` 与 `onExceed` | 已实现；父级选中会合并后代，标签可删除 | 已对齐 | 补充极端 checkRelation 组合用例 |
| 搜索 | `filterTreeNode` 布尔或函数，默认只保留叶子；函数收到逗号连接的祖先标签路径；结果高亮 | 已实现布尔/函数过滤与叶子限制，结果保留完整路径并高亮 | 已对齐 | — |
| 远程搜索 | `remote` 跳过本地匹配，由使用方按 `onSearch` 回传数据 | `remote` 跳过本地匹配；受 `filterLeafOnly` 控制 | 部分对齐 | 明确远程模式下面板展示约定 |
| 异步加载 | `loadData` 返回 Promise，`onLoad` 在状态更新前触发；加载中显示 spinner | 已实现 Promise、loading/loaded 去重与 `load` 事件 | 已对齐 | — |
| 清除 | `showClear` 仅在有值且 hover/open 时显示，清空后触发 `onChange([])` | 同名 property，`clear` + `change` 事件 | 已对齐 | — |
| 显示文本 | `displayRender(selected, idx)`；`displayProp` 选择展示字段 | `displayRender` 已接入；`displayProp` 未生效 | 部分对齐 | 接入 `displayProp` |
| 对象回传 | `onChangeWithObject` 可回传完整数据对象 | 未实现 | 不可对齐 | 保持路径值；在文档中说明 |
| 自定义触发 / 挂载 | `triggerRender`、`getPopupContainer`、`zIndex` | 未提供；使用 `semi-trigger` 与宿主 CSS | 不可对齐 | 记录为 React 渲染差异 |
| 面板插槽 | `topSlot` / `bottomSlot` 为 ReactNode | property 接受 TemplateResult | 部分对齐 | 增加命名 slot |
| 键盘 | 仅 Esc 关闭、Enter 选择/触发；无方向键导航 | 已支持 Esc/Enter，并增加方向键导航（增强） | 已对齐（增强） | 保持差异记录 |
| 无障碍 | `role=combobox`、`role=listbox/menu/menuitem` | 已提供 combobox/listbox/menu/menuitem 与 `aria-expanded` | 已对齐（增强） | — |

### TreeSelect

官方契约：`value` / `defaultValue`（单值为 value/key，多值为数组）、`treeData`、`keyMaps`、`multiple`、`checkRelation`、`leafOnly`、`autoMergeValue`、`disableStrictly`、`maxTagCount`、`showRestTagsPopover`、`loadData` / `loadedKeys`、`filterTreeNode`、`treeNodeFilterProp`、`searchPosition`、`searchAutoFocus`、`showSearchClear`、`remote`、`showClear`、`defaultOpen`、`position`、`triggerRender`、`renderSelectedItem`、`outerTopSlot` / `outerBottomSlot`、`onChange` / `onSelect` / `onSearch` / `onClear` / `onVisibleChange` / `onLoad`；官方 `multiple` 自动启用复选框模式。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 数据与字段 | `treeData` + `keyMaps` 映射 value/label/children | 同名 property，构建统一的 tree 数据 | 已对齐 | — |
| 单选 | 点击叶子选中；非叶子展开；`changeOnSelect` 可选非叶子 | 已实现；叶子选中后关闭 | 已对齐 | — |
| 多选 / 勾选 | `multiple` 自动显示复选框，支持 `checkRelation`、`leafOnly`、`autoMergeValue`、`disableStrictly` | 已实现；`multiple` 自动启用勾选，同时兼容显式 `checkable`（非官方属性） | 已对齐 | 文档说明 `checkable` 为兼容属性 |
| 值合并 | `autoMergeValue` 去掉已选父节点的后代；`leafOnly` 只保留叶子 | 已实现父级合并、标签删除与受控值同步 | 已对齐 | — |
| 搜索 | 下拉面板内搜索；`searchPosition`、`searchAutoFocus`、`showSearchClear` 可配置；匹配高亮 | 已实现下拉搜索、过滤与高亮；`searchPosition` 等配置未完整 | 部分对齐 | 补 trigger 搜索与自动聚焦配置 |
| 异步加载 | `loadData` 返回 Promise，加载中显示 spinner，`onLoad(Set,node)` | 已实现 Promise、loading/loaded 去重与 `load` 事件 | 已对齐 | — |
| 清除 / 标签 | `showClear` 仅 hover/open 显示；`maxTagCount`、`showRestTagsPopover` 折叠标签 | `showClear` 默认 false；`maxTagCount` 用 `+N` 与原生 title，无 Popover | 部分对齐 | 增加剩余标签 Popover |
| 展开事件 | `onVisibleChange(visible)` | `open-change` 事件 | 部分对齐 | 文档说明命名；可补 `visibleChange` 别名 |
| 选择 / 变更参数 | `onChange(value,node,e)`、`onSelect(key,selected,node)` | `change {value,selectedOptions}`、`select {value,option,selectedOptions}` | 部分对齐 | 补 node 参数与官方参数顺序 |
| 插槽 / 自定义渲染 | `outerTopSlot` / `outerBottomSlot`、`triggerRender`、`renderSelectedItem` | `topSlot` / `bottomSlot` 为 property；无 `triggerRender` / `renderSelectedItem` | 部分对齐 / 不可对齐 | 增加命名 slot；React render prop 记录为不可对齐 |
| 键盘 / 无障碍 | 仅 Esc、Enter；无方向键导航 | 支持 Esc/Enter，并增加方向键与 combobox/listbox 语义 | 已对齐（增强） | 保持差异记录 |

## B3a 锚点

官方契约：`items` / `Anchor.Link`、`defaultAnchor`、`getContainer`、`offsetTop`、`targetOffset`、`scrollMotion`、`autoCollapse`、`railTheme`、`size`、`maxHeight` / `maxWidth`、`showTooltip` / `position`、`onChange(current, previous)`、`onClick(e, current)`；滚动监听 100ms 节流，取视口内最后一个越过阈值的目标，切换时才触发 `onChange`。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 链接数据 | `items` 或 `Anchor.Link` 子元素，支持嵌套 | `items` property 或 `semi-anchor-link` 子元素；递归读取 href/title/disabled/children | 已对齐 | — |
| 滚动监听 | 监听 window 或 `getContainer` 元素，取最大负 top | 已实现 100ms 节流、容器相对 top、offsetTop | 已对齐 | — |
| 点击滚动 | 点击后滚动到目标，支持 `scrollMotion` 与 `targetOffset` | 已实现 window/元素两种滚动、平滑或即时、点击后短暂抑制监听 | 已对齐 | — |
| 默认锚点 | `defaultAnchor` 初始化时滚动并高亮 | 已实现初始化滚动与高亮，但不派发 `change` | 已对齐 | — |
| 嵌套与收起 | `autoCollapse` 只展开当前分支；层级缩进 8px | 已实现按 active 分支展开、8px/级缩进 | 已对齐 | — |
| 滑轨主题 / 尺寸 | `railTheme`、`size`；muted 隐藏滑轨 | 已实现 primary/tertiary/muted、small/default 与滑轨定位 | 已对齐 | — |
| 容器与尺寸 | `getContainer`、`maxHeight`、`maxWidth` | 已实现；`getContainer` 回调抛错时回退 window | 已对齐 | — |
| 事件参数 | `onChange(current, previous)`、`onClick(e, current)` | `change {currentLink, previousLink, event}`；无独立 `click` 事件 | 部分对齐 | 文档说明事件对象；可补 `click` |
| Tooltip / 定位 | `showTooltip`、`position` 控制悬浮提示 | 未实现 Tooltip，仅原生 `title`；`position` 仅保留属性 | 部分对齐 | 补 Tooltip 或明确记录为不可对齐 |
| 键盘 / 无障碍 | 仅 Enter 激活 | 支持 Enter/Space，增加 `role="navigation"`、`role="link"`、`tabindex`、`aria-current` | 已对齐（增强） | 保持差异记录 |

## B3b 可调整尺寸

官方契约：`Resizable` 支持 `size` / `defaultSize`、`minWidth` / `minHeight` / `maxWidth` / `maxHeight`、`grid`、`snap`、`snapGap`、`lockAspectRatio`、`enable`、`boundElement`、`boundsByDirection`、`handleStyle` / `handleClass` / `handleNode`、`scale` / `ratio`、`onResizeStart` / `onChange` / `onResizeEnd`，共 8 个拖拽方向；`ResizeGroup` / `ResizeItem` / `ResizeHandler` 支持分组联动。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 初始 / 受控尺寸 | `size` 受控、`defaultSize` 非受控；保留 `%`、`vw`、`vh` 等单位 | 同名 property；宿主 width/height 应用单位；受控时每次变更后重新应用 `size` | 已对齐 | 补更多单位回归测试 |
| 拖拽方向 | 8 个方向；`enable` 可关闭单个方向或全部 | 已实现 8 个手柄、`enable` 对象/false；方向判断大小写不敏感 | 已对齐 | — |
| 约束 / 网格 / 吸附 | min/max、父级/窗口/元素边界、grid 取整、snap 数组与 snapGap | 已实现 min/max、三类边界、grid、snap、`boundsByDirection` | 已对齐 | 增加边界与 snap 组合测试 |
| 宽高比 / 缩放 | `lockAspectRatio` 布尔或数字、`scale`、`ratio` | 已实现布尔/数字宽高比、scale、ratio（单值或数组） | 已对齐 | 补 ratio 元组测试 |
| 回调 / 事件 | `onResizeStart` 返回 false 中止、`onChange(size,e,dir)`、`onResizeEnd` | 同名 property；另派发 `change` / `resize-end` 事件 | 已对齐（增强） | 文档说明事件对象 |
| 手柄自定义 | `handleStyle` / `handleClass` / `handleNode`、包裹层样式 | 已支持样式/类名/节点函数；手柄位于 Shadow DOM，暴露 `part="handle handle-<dir>"` | 部分对齐 | 外部 CSS 需通过 `::part` |
| 分组联动 | `ResizeGroup` / `ResizeItem` / `ResizeHandler` | 未实现分组；单个 `Resizable` 已覆盖主要场景 | 部分对齐 | 第二阶段补分组 |
| 键盘 / 无障碍 | 以鼠标/触摸拖拽为主 | 手柄增加 `role="separator"`、方向 aria，但不可键盘调整 | 部分对齐（增强语义） | 可补方向键调整 |

## B3c 导航

官方契约：`Nav` 支持 `items`、`mode`（vertical / horizontal）、`isCollapsed` / `defaultIsCollapsed`、`selectedKeys` / `defaultSelectedKeys`、`openKeys` / `defaultOpenKeys`、`multiple`、`limitIndent`、`header` / `footer`、`expandIcon`、`renderWrapper`、`onSelect` / `onOpenChange` / `onClick` / `onCollapseChange`；选中子项时同时标记顶层父级，折叠与水平模式用浮层展开子菜单；`onDeselect` 在官方实现中未被读取。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 菜单数据 / 子菜单 | `items` 数据或 `Nav.Item` / `Nav.Sub` 复合组件 | `items` 数据递归渲染；无 `semi-nav-item` / `semi-nav-sub` 复合标签 | 部分对齐 | 保持不变，文档以 items 为主 |
| 选中 / 展开受控 | 传入 `selectedKeys` / `openKeys` 即受控；`multiple` 切换多选 | 同名 property；受控时仍先更新内部状态并派发事件；`multiple` 可切换 | 已对齐 | — |
| 父级联动 | 选中嵌套项时同时标记顶层父级 | 已实现按父级链补齐 selectedKeys | 已对齐 | — |
| 折叠 | `isCollapsed` / `defaultIsCollapsed`；折叠后隐藏文字，子菜单浮层 | 已实现 64px 折叠、header 文字隐藏、子菜单右侧浮层与 footer 收起按钮 | 已对齐 | — |
| 水平模式 | `mode="horizontal"`，子菜单向下浮层 | 已实现水平布局与下浮层 | 已对齐 | 宽屏溢出时需配合外层滚动 |
| Header / Footer | `logo` / `text` / `link`，`collapseButton` / `collapseText` | 已支持 logo/text/link 与布尔 `collapseButton`、`collapseText(collapsed)` | 部分对齐 | 补自定义 footer 节点与 `linkOptions` |
| 事件 | `onSelect(OnSelectedData)`、`onOpenChange`、`onClick`、`onCollapseChange` | 同名 callback property，另派发 `select` / `open-change` / `click` / `collapse-change`；detail 含 itemKey、keys、domEvent、isOpen | 已对齐（增强） | — |
| 自定义渲染 | `renderWrapper`、`expandIcon`、`subDropdownProps`、`getPopupContainer`、`prefixCls` | 支持 `expandIcon`；无 `renderWrapper` / `getPopupContainer`，浮层挂在宿主内 | 部分对齐 / 不可对齐 | React render prop 与 portal 记录为不可对齐 |
| 缩进 / 浮层细节 | `limitIndent`、`toggleIconPosition`、tooltip 延迟、`subNavMotion` | 固定子级缩进；未实现 `limitIndent` 限制、`toggleIconPosition`、tooltip 延迟与子菜单动画 | 部分对齐 | 后续按官方补细节 |
| 键盘 / 无障碍 | 无方向键漫游，Enter 激活 | 支持 Enter/Space，增加 `role="navigation"` / `menu` / `menuitem`、`aria-expanded`、`aria-disabled` | 已对齐（增强） | 保持差异记录 |

## B4a 高亮文本

官方契约：`sourceString`、`searchWords`（字符串或 `{ text, className, style }`）、`caseSensitive`、`autoEscape`、`highlightStyle`、`highlightClassName`、`component`；`component` 是高亮节点本身的标签，不是外层容器；匹配区间会合并重叠部分。

| 能力 | 官方行为 | 本项目行为 | 状态 | 后续动作 |
| --- | --- | --- | --- | --- |
| 文本与搜索词 | `sourceString` + `searchWords` | 同名 property；支持字符串与对象搜索词 | 已对齐 | — |
| 大小写 / 转义 | `caseSensitive`、`autoEscape` | 同名 property，默认 `false` / `true` | 已对齐 | — |
| 重叠区间 | 合并重叠与相邻命中 | 已实现排序、合并、补齐非高亮片段 | 已对齐 | — |
| 自定义样式 | 全局 `highlightStyle` / `highlightClassName`，搜索词可单独设置 | 行内样式逐词合并；类名写入内部节点 | 部分对齐 | Shadow DOM 下外部类选择器无法穿透，文档使用 `::part(highlight)` 与行内样式 |
| 自定义标签 | `component` 支持 mark/span/strong/em/b/i | 已支持并校验，非法标签回退 `mark` | 已对齐 | — |
| 外部样式入口 | 直接给 `.semi-highlight-tag` 写样式 | 暴露 `part="highlight"`；类名仅作为内部标记 | 部分对齐 | 文档推荐 `::part(highlight)` |

## 通用差异

- React `ref` / `forwardRef`：改为元素公开方法（如 `focus()`、`blur()`）与 `updateComplete`。
- React Context：改为本项目 provider 组件与 CSS Token。
- `className` / `style`：改为宿主 `class`、CSS 自定义属性与 `part`。
- 官方内部 DOM 结构与类名不保证完全一致；公开类名、Token 与视觉结果保持一致。
