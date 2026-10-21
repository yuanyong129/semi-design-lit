# 组件约定

本仓库的组件是对 Semi Design React 组件与样式的 Web Components 实现。新增或修改组件时，请遵循以下约定，避免不同组件出现两套 API。

## 元素与属性

- 自定义元素统一使用 `semi-` 前缀，例如 `<semi-button>`、`<semi-input>`。
- 组件类使用 `Semi` 前缀，例如 `SemiButton`，并使用 `@customElement` 注册。
- JS 属性使用 camelCase；HTML 属性使用 kebab-case：
  - `showClear` ↔ `show-clear`
  - `defaultValue` ↔ `default-value`
  - `validateStatus` ↔ `validate-status`
- 布尔属性使用 Lit 的 `type: Boolean`，HTML 中直接写属性名表示 `true`。
- 受控/非受控组件同时支持 `value` 与 `defaultValue`。
- 优先复用 `Size`、`TagColor` 等公共类型，尺寸统一为 `small | default | large`。

## 事件

- 对外事件使用 CustomEvent，并设置 `bubbles: true`、`composed: true`，保证可以穿透 Shadow DOM。
- 值变更事件的 `detail` 至少包含：

```ts
{
  value: string;
  event: Event;
}
```

- 例如 Input：

```ts
input.addEventListener('change', (event) => {
  const { value, event: nativeEvent } = event.detail;
});
```

- 关闭、清除等附加动作使用独立事件，例如 `close`、`clear`。
- 键盘事件按需提供 `keydown`、`keyup`、`keypress`、`enterpress`，detail 中同时带 `value` 与原始事件。

## 插槽与样式

- 默认插槽承载主体内容；前后缀使用命名插槽：

```html
<semi-input>
  <semi-icon-star slot="prefix"></semi-icon-star>
  <span slot="suffix">Semi</span>
</semi-input>
```

- 组件内部关键节点通过 `part` 暴露，例如 `part="input-wrapper"`、`part="tag"`。
- 颜色、间距、圆角、字号只使用 `--semi-*` Token，不写死颜色值。
- 组件样式放在 `components/<name>/style/*.style.ts`，使用 Lit `css`。
- 尺寸类名统一为 `semi-<component>-<size>`，状态类名使用 `-disabled`、`-focus`、`-error` 等后缀。

## 可访问性

- 可交互的非原生元素补充 `role`、`tabindex` 与键盘处理。
- 输入组件在错误状态设置 `aria-invalid="true"`。
- 图标按钮、关闭按钮必须提供 `aria-label`。
- 不要在 Shadow DOM 中依赖外部 DOM 选择器；需要跨组件能力时使用 `@lit/context`。

## 文档与测试

每个新组件至少包含：

1. `components/<name>/<name>.ts` 与样式文件
2. `packages/semi-lit-docs/docs/<name>/index.ts` 文档页与路由
3. `test/<name>.test.ts` 单元测试
4. README 组件表与迁移文档更新（如有 API 差异）

提交前执行：

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```
