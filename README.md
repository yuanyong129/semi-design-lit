# Semi Design Lit

[Semi Design](https://semi.design/zh-CN/) 组件的 Lit Web Components 实现。

## 官方参考（已记录）

| 参考 | 地址 |
| --- | --- |
| Semi Design React 仓库 | [https://github.com/DouyinFE/semi-design](https://github.com/DouyinFE/semi-design) |
| 文档站样式与布局参考 | [https://semi.design/zh-CN/basic/space](https://semi.design/zh-CN/basic/space) |
| 设计变量 | [https://semi.design/zh-CN/basic/tokens](https://semi.design/zh-CN/basic/tokens) |

Semi Design 是由字节跳动（Douyin FE）开源的设计系统与 React UI 组件库。本仓库以其设计规范、设计变量（Design Tokens）、组件 API 与官方文档布局为准，使用 [Lit](https://lit.dev/) 提供对应的 Web Components 实现。

这个项目最初是 Arco Design 的 Lit 移植版本（`arco-design-lit`），现已整体迁移到 Semi Design：

- 包组织参考 Semi 仓库：`semi-ui` / `semi-foundation` / `semi-icons` / `semi-theme-default`
- 自定义元素前缀：`<semi-*>`
- 类名前缀：`semi-*`
- CSS 变量：`--semi-*`（与 Semi Design 官方默认主题一致，内置亮色 / 暗色）
- 组件 API：对齐 Semi Design（`type` / `theme` / `size` / `block` 等）

## 快速开始

```bash
pnpm install
pnpm dev:docs        # 启动文档站点 http://localhost:18888
pnpm build           # 构建组件库与文档
pnpm build:component # 仅构建 @semi-design/semi-ui
pnpm typecheck       # TypeScript 类型检查
pnpm test            # Vitest 组件单测
pnpm test:e2e        # Playwright 文档站冒烟测试
pnpm test:all        # 单测 + E2E
```

### 使用组件

```ts
import '@semi-design/semi-ui';
import '@semi-design/semi-icons';
import '@semi-design/semi-theme-default/style.css';
```

```html
<semi-space>
  <semi-button type="primary" theme="solid">主要按钮</semi-button>
  <semi-button>默认按钮</semi-button>
  <semi-tag color="blue" closable>标签</semi-tag>
  <semi-switch checked-text="开" unchecked-text="关"></semi-switch>
</semi-space>
```

## 组件

| 组件 | 自定义元素 | 说明 |
| --- | --- | --- |
| Button | `<semi-button>` | 5 种类型 × 4 种主题 × 3 种尺寸 |
| ButtonGroup | `<semi-button-group>` | 组合按钮，统一类型 / 主题 / 尺寸 |
| Divider | `<semi-divider>` | 水平 / 垂直 / 带文字 / 多种线型 |
| Empty | `<semi-empty>` | 竖向 / 横向布局，支持自定义插画 |
| Input | `<semi-input>` | 前后缀、清除、前后置标签、尺寸 |
| InputNumber | `<semi-input-number>` | 步进、范围、精度、尺寸 |
| TextArea | `<semi-textarea>` | 多行输入、字数统计、自适应高度 |
| InputGroup | `<semi-input-group>` | 多个输入框 / 按钮组合 |
| Checkbox | `<semi-checkbox>` / `<semi-checkbox-group>` | 受控 / 非受控、半选、选项组 |
| Form | `<semi-form>` / `<semi-form-item>` | 字段注册、规则校验、布局与标签 |
| Typography | `<semi-typography-title>` / `-text` / `-paragraph` | 标题、文本、段落、复制 |
| Link | `<semi-link>` | 6 种主题、下划线、禁用、图标 |
| Radio | `<semi-radio>` / `<semi-radio-group>` | 普通 / 按钮 / 卡片三种形态 |
| Space | `<semi-space>` | 水平 / 垂直、自定义间距、折行 |
| Switch | `<semi-switch>` | 尺寸、文案、加载、禁用 |
| Tag | `<semi-tag>` | 17 种内置颜色、light / solid / ghost、可关闭 |
| Scrollbar | `<semi-scrollbar>` | 扩展组件（Semi Design 未内置） |
| ConfigProvider | `<semi-config-provider>` | 语言、方向、尺寸、主题模式、弹层容器 |
| LocaleProvider | `<semi-locale-provider>` | 语言包上下文，支持嵌套覆盖 |

## 设计变量

Semi Design 的默认亮色与暗色 Design Tokens 位于
[`packages/semi-theme-default/tokens.css`](packages/semi-theme-default/tokens.css)。
暗色模式通过 `theme-mode="dark"` 启用：

```html
<semi-config-provider theme-mode="dark">
  <semi-button type="primary">暗色模式</semi-button>
</semi-config-provider>
```

也可以在 `body` 上直接设置：

```html
<body theme-mode="dark"></body>
```

## 文档站

文档站的布局参考 Semi 官方组件文档（[Space 间距](https://semi.design/zh-CN/basic/space)）：

- 顶部渐变公告条、顶部导航、搜索框、GitHub 入口
- 左侧分组导航（开始 / 基础 / 输入类 / 展示 / 其他）
- 中间内容区：面包屑、大标题、描述、演示与代码左右双栏
- 右侧「本页目录」，支持滚动高亮

### 线上预览（GitHub Pages）

`main` 推送后，CI 的 `deploy` job 会把文档站发布到 GitHub Pages：

- 地址：<https://yuanyong129.github.io/semi-design-lit/>
- 首次使用需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
- 子路径前缀由部署构建的 `DOCS_BASE=/semi-design-lit/` 注入（本地构建仍以 `/` 为基址），路由与 `history.pushState` 都基于 `import.meta.env.BASE_URL`
- 深链（如 `/basic/button`）依赖构建产物里的 `404.html` 回退到 `index.html`
- 本地预览：`pnpm build:docs && node scripts/serve-docs.mjs`，访问 <http://127.0.0.1:18888>

## 测试与 CI

组件 API、事件、插槽与可访问性约定见 [docs/component-conventions.md](docs/component-conventions.md)。

- **单元测试**：Vitest + jsdom，覆盖 Button、Input、Switch、RadioGroup、Tag、ConfigProvider、LocaleProvider，位于 `test/*.test.ts`
- **E2E 测试**：Playwright，覆盖文档站路由、Input 交互与 LocaleProvider 语言切换，位于 `test/e2e/`
- **CI**：GitHub Actions 执行 `typecheck → test → build → e2e`，见 `.github/workflows/ci.yml`
- **包构建**：`semi-foundation`、`semi-icons`、`semi-theme-default` 均有独立 `build` 脚本，产物输出到各自 `dist/`

## 从 Arco Design 迁移

迁移说明与 API 对照见 [docs/migration-from-arco.md](docs/migration-from-arco.md)。

主要变化：

| 维度 | Arco Design | Semi Design |
| --- | --- | --- |
| 元素前缀 | `<a-button>` | `<semi-button>` |
| 类名前缀 | `arco-btn` | `semi-button` |
| CSS 变量 | `--color-primary-6` / `--arco-*` | `--semi-color-primary` / `--semi-*` |
| 按钮类型 | `primary/secondary/dashed/outline/text` | `primary/secondary/tertiary/warning/danger` |
| 按钮主题 | 无 | `solid/light/outline/borderless` |
| 按钮宽度 | `long` | `block` |
| 分割线方向 | `direction` | `layout` |
| 链接状态 | `status` | `theme` |
| 标签形态 | `bordered/checkable/loading` | `type=light/solid/ghost`、`shape` |

## 目录结构

```
packages/
  semi-ui/             # @semi-design/semi-ui 组件库
    components/        # 组件逻辑与组件样式
  semi-foundation/     # @semi-design/semi-foundation 设计变量辅助与基础样式
  semi-icons/          # @semi-design/semi-icons 图标 Web Components
  semi-theme-default/  # @semi-design/semi-theme-default 默认亮/暗色 Tokens
  semi-lit-docs/       # 文档站点（Vite + Lit）
```

## License

MIT. Semi Design 的 Design Tokens 与设计规范版权归 Semi Design 团队所有。
