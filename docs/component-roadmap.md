# 官方组件补齐与对齐计划

基线：`d08ef1d`（P4.4 完成，48 个核心组件文档页，111 个单测 / 34 个 E2E）。B1a 完成后为 **51 / 67**；B1b 完成后为 **55 / 67**；B2a 完成后为 **57 / 67**；B2b 的 TimePicker、Cascader、TreeSelect 完成后为 **60 / 67**；B4a 的 Highlight 完成后为 **61 / 67**；B3a 的 Anchor 完成后为 **62 / 67**；B3b 的 Resizable 完成后为 **63 / 67**；B3c 的 Navigation 完成后为 **64 / 67**，缺少 3 个组件。

## 1. 盘点口径

本计划以 Semi Design 官方文档站的组件侧边栏与官方 `packages/semi-ui` 源码为准：

- 官方文档：https://semi.design/zh-CN/start/overview
- 官方源码：https://github.com/DouyinFE/semi-design/tree/main/packages/semi-ui
- 官方路由清单：https://semi.design/sitemap.xml

“核心组件”指官方文档中 **基础 / 反馈 / 输入 / 导航 / 展示 / 其他** 六类的组件，不含 Tokens、Icon 等非组件页面，也不含 Plus / AI 扩展组件。

当前核心组件覆盖：**63 / 67**，缺少 **4 个**。

### 缺口清单

| 分类 | 已实现 | 缺少 |
| --- | --- | --- |
| 基础 | Layout、Grid、Button、Typography、Divider、Space、FloatButton、Resizable | 无 |
| 反馈 | Banner、Notification、Popconfirm、Progress、Skeleton、Spin、Toast | 无 |
| 输入 | Checkbox、DatePicker、Form、Input、InputNumber、PinCode、Radio、Rating、Select、Switch、TagInput、Transfer、Upload、AutoComplete、Slider、TimePicker、Cascader、TreeSelect | ColorPicker |
| 导航 | Breadcrumb、Pagination、Steps、Tabs、Tree、BackTop、Anchor、Navigation | ColorPicker |
| 展示 | Avatar、Badge、Calendar、Card、Carousel、Collapse、Collapsible、Descriptions、Dropdown、Empty、Highlight、Image、List、Modal、Popover、SideSheet、Table、Tag、Timeline、Tooltip | OverflowList、ScrollList |
| 其他 | ConfigProvider、Locale | 无 |

> Scrollbar 是本仓库扩展组件，官方未内置；保留，不计入缺口。

### 扩展组件（第二阶段，不阻塞核心 1.0）

官方 Plus / AI / 多媒体组件：AIChatInput、AIChatDialogue、Sidebar、Chat、CodeHighlight、MarkdownRender、DragMove、JsonViewer、HotKeys、Lottie、AudioPlayer、VideoPlayer、Cropper、UserGuide。

这些组件依赖第三方库或 React 运行时能力，统一放入扩展批次；先记录契约，不纳入首轮核心覆盖。

## 2. 开发批次

每个批次独立完成“组件 + 文档 + 单测 + E2E + 截图 + 中文提交”，避免一次性堆积大量未验证代码。

### B1 轻量反馈与输入

> B1a 已完成：Spin、Rating、PinCode，对齐差异记录见 `docs/official-alignment.md`。B1b 已完成 TagInput、BackTop、FloatButton、Collapsible。

| 组件 | 路由 | 首批契约重点 | 复用 |
| --- | --- | --- | --- |
| Spin（已完成） | `/show/spin` | spinning、size、tip、delay、包裹内容 | Progress 的旋转样式思路 |
| Rating（已完成） | `/input/rating` | value/defaultValue、count、allowHalf、disabled、readonly、character、tooltips、change | Icon |
| PinCode（已完成） | `/input/pincode` | value/defaultValue、count、type、size、disabled、status、change/complete | Input、Space |
| TagInput（已完成） | `/input/tag-input` | value/defaultValue、max、separator、addOnBlur、disabled、change、tag 插槽 | Tag、Input |
| BackTop（已完成） | `/navigation/back-top` | visibilityHeight、target、click、滚动监听 | Icon、Scrollbar |
| FloatButton（已完成） | `/basic/float-button` | shape、size、colorful、icon、badge、href、click | Button、Badge |
| Collapsible（已完成） | `/show/collapsible` | isOpen、collapseHeight、fade、motion、motionEnd | 动画工具 |

### B2 选择器

> B2a 已完成：AutoComplete、Slider，对齐差异记录见 `docs/official-alignment.md`；B2b 已完成：TimePicker、Cascader、TreeSelect。

| 组件 | 路由 | 首批契约重点 | 复用 |
| --- | --- | --- | --- |
| AutoComplete（已完成） | `/input/auto-complete` | value/defaultValue、data、onSearch、onSelect、onChange、loading、size、position、showClear、emptyContent | Input、Trigger、Spin |
| Slider（已完成） | `/input/slider` | value/defaultValue、min/max/step、range、vertical、marks、tooltip、disabled、change/changeComplete | Trigger/Tooltip |
| TimePicker（已完成） | `/input/time-picker` | value/defaultValue、format、type、disabled、hideDisabledOptions、onChange、panelHeader | DatePicker 面板、ScrollList |
| Cascader（已完成） | `/input/cascader` | value/defaultValue、treeData、multiple、changeOnSelect、loadData、keyMaps、separator、filter、onChange | Trigger、Checkbox、ScrollList |
| TreeSelect（已完成） | `/input/tree-select` | value/defaultValue、treeData、multiple、checkable、onSearch、loadData、keyMaps、onChange | Tree、Trigger、Tag |

### B3 导航与容器

| 组件 | 路由 | 首批契约重点 | 复用 |
| --- | --- | --- | --- |
| Anchor | `/navigation/anchor` | items/link 列表、offsetTop、targetOffset、getContainer、scrollMotion、autoCollapse、railTheme、change | Scrollbar、affix 逻辑 |
| Navigation（已完成） | `/navigation/navigation` | items、mode、selectedKeys、openKeys、onSelect、onOpenChange、header/footer、collapse | Collapsible、Dropdown、Icon |
| Resizable（已完成） | `/layout/resizable` | size/defaultSize、8 方向、min/max、grid/snap、lockAspectRatio、handle、onResizeStart/onChange/onResizeEnd | ResizeObserver |
| ColorPicker | `/input/colorpicker` | value/defaultValue、format、alpha、presets、disabled、usePopover、onChange | Trigger、Input、Slider |

### B4 展示与列表

> B4a 已完成：Highlight，对齐差异记录见 `docs/official-alignment.md`。

| 组件 | 路由 | 首批契约重点 | 复用 |
| --- | --- | --- | --- |
| Highlight（已完成） | `/show/highlight` | sourceString、searchWords、caseSensitive、highlightClassName、component | 无 |
| OverflowList | `/show/overflowlist` | items、visibleItemRenderer、overflowRenderer、minVisibleItems、collapseFrom、onOverflow | ResizeObserver、Popover |
| ScrollList | `/show/scrolllist` | dataSource、renderItem、loading、onReachBottom、scrollLoad、threshold | Scrollbar、IntersectionObserver |

## 3. 官方对齐流程

每个组件开发完成后，按以下步骤做第二轮对齐，不能以“能渲染”作为完成标准。

1. **抓取官方契约**
   - 官方文档页 API 表；
   - 官方源码 `packages/semi-ui/<component>/index.tsx` 的 `Props` 接口；
   - 必要时参考 `packages/semi-foundation/<component>` 的默认值与事件语义。
2. **建立 API 映射**
   - React `prop` → Lit property/attribute；
   - `onXxx` → 冒泡 CustomEvent，detail 保持语义；
   - `ReactNode` / `renderXxx` → 默认插槽 / 命名插槽 / 函数属性；
   - `ref` / 命令式方法 → 元素公开方法；
   - `className` / `style` → `class` / CSS 自定义属性 / `part`。
3. **行为矩阵**
   - 受控与非受控；
   - 键盘、焦点、Esc、点击外部；
   - disabled / loading / empty / error；
   - 暗色模式、RTL、三种尺寸；
   - 移动端与窄容器。
4. **视觉对齐**
   - 使用 `--semi-*` Token；
   - 类名遵循 `semi-<component>-<state>`；
   - 关键状态截图，不只截默认态。
5. **记录差异**
   - 在 `docs/official-alignment.md` 增加一行；
   - 状态：`已对齐` / `部分对齐` / `不可对齐`；
   - 必须写清“官方行为 / 本项目行为 / 原因 / 后续动作”。

### 预期不可完全对齐的部分

- React Context、`forwardRef`、`render props`：改用 Lit Context、元素方法、插槽与函数属性。
- `getPopupContainer` 的 React 节点参数：Web Components 侧改为选择器或元素属性。
- 官方内部 DOM 结构与 CSS 类名：只保证公开类名、Token 与视觉结果，不保证内部节点完全一致。
- 虚拟滚动、超长列表、复杂 Table 内部实现：优先保证公开行为，内部性能实现允许不同。
- Toast / Notification / Modal 的命令式 API：保留同名静态方法，但返回句柄与销毁语义按 Web Components 调整。
- Plus / AI 组件：Lottie、Markdown、Cropper 等依赖第三方库，作为可选扩展包处理。
- SSR / React 生命周期：不提供 React 生命周期钩子，改用 CustomEvent 与 `updateComplete`。

## 4. 既有组件对齐优先级

补齐 12 个缺口后，对既有组件做契约复核，优先处理高风险组件：

| 优先级 | 组件 | 重点 |
| --- | --- | --- |
| P0 | Table | 列配置、排序/筛选、行选择、展开、固定列、虚拟滚动、受控分页 |
| P0 | Form | 字段注册、校验规则、错误展示、布局、动态字段 |
| P0 | Select | 远程搜索、分组、自定义渲染、多选标签、虚拟滚动 |
| P0 | Tree | 半选、受控展开、拖拽、异步加载、虚拟滚动 |
| P0 | DatePicker | 范围选择、时间面板、快捷选择、禁用日期、国际化 |
| P1 | Upload / Transfer | 受控文件列表、自定义请求、拖拽、校验 |
| P1 | Tabs / Modal / SideSheet | 焦点管理、键盘、受控、动画 |
| P1 | Toast / Notification | 命令式 API、最大数量、更新/销毁、位置 |
| P1 | ConfigProvider / Locale | 主题、RTL、语言包、弹层容器 |
| P2 | 其余展示类 | 视觉状态、尺寸、暗色模式、RTL |

## 5. 文档完善

- 每个组件页增加“API”表：属性、事件、插槽、方法、默认值、对应官方字段。
- 每个组件页增加“与官方差异”小节，内容来自 `docs/official-alignment.md`。
- 文档示例覆盖：基础、受控、尺寸、状态、禁用、暗色、边界情况。
- 增加组件总览页的覆盖状态：已实现 / 部分对齐 / 未实现。
- 文档构建产物按路由拆分，降低单 chunk 体积。

## 6. 版本发布计划

| 版本 | 范围 | 出口条件 |
| --- | --- | --- |
| 0.2.0 | B1 + B2（12 个组件） | 单测/E2E/构建通过；新增页面与 API 表完成 |
| 0.3.0 | B3 + B4（7 个组件） | 核心组件 67/67 覆盖；缺口清单归零 |
| 0.4.0 | 既有 P0/P1 组件对齐 | 高风险组件契约复核完成；差异记录完整 |
| 1.0.0 | 文档、可访问性、稳定性 | 核心 API 覆盖率 ≥ 90%；无 P0 差异；发布检查表通过 |

发布检查表：

1. `pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`
2. 文档站构建与路由巡检
3. `CHANGELOG.md` 与迁移说明
4. `package.json` 版本、导出、files 字段检查
5. npm 包内容与类型声明检查
6. 由仓库所有者手动执行 `npm publish`，CI/代理不自动发布

## 7. 进度

| 批次 | 状态 | 提交 |
| --- | --- | --- |
| 盘点与计划 | 已完成 | `docs/component-roadmap.md` |
| B1 轻量反馈与输入 | 已完成 | `6344d36` + `9608ada` |
| B2 选择器 | 已完成（B2a AutoComplete/Slider；B2b TimePicker/Cascader/TreeSelect） | 本批次 |
| B3 导航与容器 | 进行中（Anchor、Resizable、Navigation 已完成；ColorPicker 待开始） | 本批次 |
| B4 展示与列表 | 进行中（Highlight 已完成；OverflowList、ScrollList 待开始） | 本批次 |
| 既有组件对齐 | 待开始 | - |
| 文档与发布 | 待开始 | - |
