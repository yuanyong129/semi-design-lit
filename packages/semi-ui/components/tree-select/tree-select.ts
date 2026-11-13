import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import type { TreeNode, TreeNodeKey } from '../tree/interface';
import type {
  TreeSelectCheckRelation,
  TreeSelectData,
  TreeSelectDisplayRender,
  TreeSelectFilterTreeNode,
  TreeSelectKeyMaps,
  TreeSelectSize,
  TreeSelectValidateStatus,
  TreeSelectValue,
} from './interface';
import '../trigger/trigger';
import '../tree/tree';
import './tree-select-popup';
import '../tag/tag';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/down';

const prefixCls = getPrefixCls('tree-select');
const p = unsafeCSS(prefixCls);

type TreeSelectTreeNode = TreeNode & {
  __data: TreeSelectData;
  __path: TreeSelectValue[];
};

@customElement('semi-tree-select')
export class SemiTreeSelect extends LitElement {
  /** 树形数据 */
  @property({ attribute: false })
  treeData: TreeSelectData[] = [];

  /** 当前值（受控） */
  @property({ attribute: false })
  value?: TreeSelectValue | TreeSelectValue[] | TreeSelectData | TreeSelectData[];

  /** 默认值 */
  @property({ attribute: false })
  defaultValue?: TreeSelectValue | TreeSelectValue[] | TreeSelectData | TreeSelectData[];

  /** 是否多选 */
  @property({ type: Boolean })
  multiple: boolean = false;

  /** 是否显示复选框 */
  @property({ type: Boolean })
  checkable: boolean = false;

  /** 父子勾选关系 */
  @property({ attribute: 'check-relation' })
  checkRelation: TreeSelectCheckRelation = 'related';

  /** 是否只提交叶子节点 */
  @property({ attribute: 'leaf-only', type: Boolean })
  leafOnly: boolean = false;

  /** 是否在父节点选中时合并子节点 */
  @property({ attribute: 'auto-merge-value', type: Boolean })
  autoMergeValue: boolean = true;

  /** 最多可选数量 */
  @property({ type: Number })
  max?: number;

  /** 最多展示的标签数量 */
  @property({ attribute: 'max-tag-count', type: Number })
  maxTagCount?: number;

  /** 自定义字段映射 */
  @property({ attribute: false })
  keyMaps?: TreeSelectKeyMaps;

  /** 是否开启搜索 */
  @property({
    attribute: 'filter-tree-node',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === 'false') return false;
        if (value === '' || value === 'true') return true;
        return value;
      },
      toAttribute: (value: TreeSelectFilterTreeNode) => (value === true ? '' : null),
    },
  })
  filterTreeNode: TreeSelectFilterTreeNode = false;

  /** 搜索时是否只保留叶子节点 */
  @property({ attribute: 'filter-leaf-only', type: Boolean })
  filterLeafOnly: boolean = true;

  /** 搜索使用的字段 */
  @property({ attribute: 'tree-node-filter-prop' })
  treeNodeFilterProp: string = 'label';

  /** 远程搜索模式 */
  @property({ type: Boolean })
  remote: boolean = false;

  @property({ attribute: 'search-placeholder' })
  searchPlaceholder?: string;

  @property({ attribute: 'display-prop' })
  displayProp: string = 'label';

  @property({ attribute: false })
  displayRender?: TreeSelectDisplayRender;

  @property({ attribute: 'change-on-select', type: Boolean })
  changeOnSelect: boolean = false;

  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = false;

  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  @property()
  position: string = 'bottomLeft';

  @property({ type: Boolean })
  disabled: boolean = false;

  @property()
  size: TreeSelectSize = 'default';

  @property({ attribute: 'validate-status' })
  validateStatus: TreeSelectValidateStatus = 'default';

  @property({ type: Boolean })
  borderless: boolean = false;

  @property()
  placeholder?: string;

  @property({ attribute: 'empty-content' })
  emptyContent: string = '暂无数据';

  @property({ attribute: 'inset-label' })
  insetLabel?: string;

  @property({ attribute: 'default-expand-all', type: Boolean })
  defaultExpandAll: boolean = false;

  @property({ attribute: false })
  expandedKeys?: TreeSelectValue[];

  @property({ attribute: false })
  defaultExpandedKeys: TreeSelectValue[] = [];

  @property({ attribute: false })
  loadData?: (data: TreeSelectData) => Promise<unknown>;

  @property({ attribute: 'on-change-with-object', type: Boolean })
  onChangeWithObject: boolean = false;

  @property({ attribute: 'picker-label' })
  pickerLabel: string = 'TreeSelect';

  @property({ attribute: 'show-arrow', type: Boolean })
  showArrow: boolean = true;

  @property({ attribute: false })
  topSlot?: TemplateResult;

  @property({ attribute: false })
  bottomSlot?: TemplateResult;

  @state()
  private _value?: TreeSelectValue | TreeSelectValue[];

  @state()
  private _open: boolean = false;

  @state()
  private _search: string = '';

  @state()
  private _expanded: TreeSelectValue[] = [];

  @state()
  private _focused: boolean = false;

  @state()
  private _hovering: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this._value = this._rawValueToKeys(this.defaultValue);
    this._expanded = [...this.defaultExpandedKeys];
    if (this.defaultExpandAll) {
      this._expanded = this._allValues(this.treeData);
    }
    this._open = this.defaultOpen;
  }

  /** 打开下拉面板 */
  open() {
    this._setOpen(true);
  }

  /** 关闭下拉面板 */
  close() {
    this._setOpen(false);
  }

  /** 展开或收起 */
  toggle() {
    this._setOpen(!this._open);
  }

  /** 聚焦触发器 */
  focus() {
    this.renderRoot.querySelector<HTMLElement>(`.${p}`)?.focus();
  }

  /** 让触发器失焦 */
  blur() {
    this.renderRoot.querySelector<HTMLElement>(`.${p}`)?.blur();
  }

  /** 设置搜索关键词 */
  search(value: string) {
    this._setSearch(value);
  }

  private get _selectedValues(): TreeSelectValue[] {
    const raw = this.value !== undefined ? this.value : this._value;
    return this._rawValueToKeys(raw) ?? [];
  }

  private _rawValueToKeys(
    raw: TreeSelectValue | TreeSelectValue[] | TreeSelectData | TreeSelectData[] | undefined
  ): TreeSelectValue[] | undefined {
    if (raw === undefined) return undefined;
    const list = Array.isArray(raw) ? raw : [raw];
    return list.map((item) =>
      item !== null && typeof item === 'object' ? (item as TreeSelectData).value : item
    );
  }

  private _field(data: TreeSelectData, name: string, fallback: string): unknown {
    const key = (this.keyMaps as Record<string, string> | undefined)?.[name] ?? fallback;
    return data[key];
  }

  private _valueOf(data: TreeSelectData): TreeSelectValue {
    return this._field(data, 'value', 'value') as TreeSelectValue;
  }

  private _labelOf(data: TreeSelectData): string {
    return String(this._field(data, 'label', 'label') ?? '');
  }

  private _childrenOf(data: TreeSelectData): TreeSelectData[] | undefined {
    return this._field(data, 'children', 'children') as TreeSelectData[] | undefined;
  }

  private _disabledOf(data: TreeSelectData): boolean {
    return Boolean(this._field(data, 'disabled', 'disabled'));
  }

  private _isLeaf(data: TreeSelectData): boolean {
    const explicit = this._field(data, 'isLeaf', 'isLeaf');
    if (explicit !== undefined) return Boolean(explicit);
    if (this.loadData) return false;
    return !this._childrenOf(data)?.length;
  }

  private _allData(): Map<TreeSelectValue, TreeSelectData> {
    const result = new Map<TreeSelectValue, TreeSelectData>();
    const walk = (nodes: TreeSelectData[]) => {
      nodes.forEach((node) => {
        result.set(this._valueOf(node), node);
        const children = this._childrenOf(node);
        if (children) walk(children);
      });
    };
    walk(this.treeData);
    return result;
  }

  private _allValues(nodes: TreeSelectData[]): TreeSelectValue[] {
    const result: TreeSelectValue[] = [];
    const walk = (list: TreeSelectData[]) => {
      list.forEach((node) => {
        result.push(this._valueOf(node));
        const children = this._childrenOf(node);
        if (children) walk(children);
      });
    };
    walk(nodes);
    return result;
  }

  private _displayValue(value: TreeSelectValue): string {
    const data = this._allData().get(value);
    if (!data) return String(value);
    return String(data[this.displayProp] ?? this._labelOf(data));
  }

  private _labelFor(data: TreeSelectData): string {
    return String(data[this.displayProp] ?? this._labelOf(data));
  }

  private _pathValues(value: TreeSelectValue): TreeSelectValue[] {
    const path: TreeSelectValue[] = [];
    const walk = (nodes: TreeSelectData[], trail: TreeSelectValue[]): boolean => {
      for (const node of nodes) {
        const next = [...trail, this._valueOf(node)];
        if (this._valueOf(node) === value) {
          path.push(...next);
          return true;
        }
        const children = this._childrenOf(node);
        if (children && walk(children, next)) return true;
      }
      return false;
    };
    walk(this.treeData, []);
    return path;
  }

  private _isDescendantOf(value: TreeSelectValue, ancestor: TreeSelectValue): boolean {
    const path = this._pathValues(value);
    return path.length > 1 && path[path.length - 2] === ancestor;
  }

  private _collectDescendants(value: TreeSelectValue): TreeSelectValue[] {
    const data = this._allData().get(value);
    if (!data) return [];
    return this._allValues(this._childrenOf(data) ?? []);
  }

  private _normalizeChecked(values: TreeSelectValue[]): TreeSelectValue[] {
    let next = [...values];
    const map = this._allData();
    if (this.leafOnly) {
      next = next.filter((value) => {
        const data = map.get(value);
        return data ? this._isLeaf(data) : false;
      });
    } else if (this.autoMergeValue) {
      next = next.filter((value) => {
        const path = this._pathValues(value);
        return !path.slice(0, -1).some((ancestor) => next.includes(ancestor));
      });
    }
    return next;
  }

  private _setValue(keys: TreeSelectValue[]) {
    if (this.value === undefined) {
      this._value = this.multiple ? keys : keys[keys.length - 1];
    }
  }

  private _emitChange(keys: TreeSelectValue[]) {
    const map = this._allData();
    const selectedOptions = keys
      .map((value) => map.get(value))
      .filter((item): item is TreeSelectData => Boolean(item));
    let emitted: TreeSelectValue | TreeSelectValue[] | TreeSelectData | TreeSelectData[] | undefined;
    if (this.multiple) {
      emitted = this.onChangeWithObject ? selectedOptions : keys;
    } else if (this.onChangeWithObject) {
      emitted = selectedOptions[0];
    } else {
      emitted = keys[keys.length - 1];
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: emitted, selectedOptions },
      bubbles: true,
      composed: true,
    }));
  }

  private _commit(keys: TreeSelectValue[]): boolean {
    if (this.max !== undefined && keys.length > this.max) {
      const map = this._allData();
      const checkedItems = keys
        .map((value) => map.get(value))
        .filter((item): item is TreeSelectData => Boolean(item));
      this.dispatchEvent(new CustomEvent('exceed', {
        detail: { checkedItems },
        bubbles: true,
        composed: true,
      }));
      return false;
    }
    this._setValue(keys);
    this._emitChange(keys);
    return true;
  }

  private _handleSelect = (event: CustomEvent<{ node: TreeSelectTreeNode }>) => {
    event.stopPropagation();
    const node = event.detail.node;
    const data = node.__data;
    if (!data || this._disabledOf(data)) return;
    if (this.checkable || this.multiple) return;
    if (!this.changeOnSelect && !this._isLeaf(data)) return;

    const value = this._valueOf(data);
    const current = this._selectedValues;
    const next = this.multiple
      ? current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      : [value];
    if (!this._commit(next)) return;

    this.dispatchEvent(new CustomEvent('select', {
      detail: { value, option: data, selectedOptions: next.map((item) => this._allData().get(item)).filter(Boolean) },
      bubbles: true,
      composed: true,
    }));
    if (!this.multiple) this._setOpen(false);
  };

  private _handleCheck = (event: CustomEvent<{ checkedKeys: TreeNodeKey[] }>) => {
    event.stopPropagation();
    if (!(this.checkable || this.multiple)) return;
    const keys = event.detail.checkedKeys as TreeSelectValue[];
    const next = this._normalizeChecked(keys);
    if (!this._commit(next)) return;
  };

  private _handleExpand = (event: CustomEvent<{ expandedKeys: TreeNodeKey[] }>) => {
    if (this.expandedKeys === undefined) {
      this._expanded = event.detail.expandedKeys as TreeSelectValue[];
    }
  };

  private _handleLoad = (event: CustomEvent<{ node: TreeSelectTreeNode; loadedKeys: TreeNodeKey[] }>) => {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('load', {
      detail: {
        loadedKeys: event.detail.loadedKeys as TreeSelectValue[],
        data: event.detail.node.__data,
      },
      bubbles: true,
      composed: true,
    }));
  };

  private _handleTriggerClick = () => {
    if (this.disabled) return;
    this._setOpen(!this._open);
  };

  private _handleOpenChange = (event: CustomEvent<{ open: boolean }>) => {
    if (event.detail.open === this._open) return;
    this._open = event.detail.open;
    if (!event.detail.open) this._search = '';
    this.dispatchEvent(new CustomEvent('open-change', {
      detail: { open: this._open },
      bubbles: true,
      composed: true,
    }));
  };

  private _setOpen(open: boolean) {
    if (this.disabled || this._open === open) return;
    this._open = open;
    if (!open) this._search = '';
    this.dispatchEvent(new CustomEvent('open-change', {
      detail: { open },
      bubbles: true,
      composed: true,
    }));
    if (open && this.filterTreeNode) {
      this.updateComplete.then(() => {
        this.renderRoot
          .querySelector<HTMLElement & { focusSearch?: () => void }>('semi-tree-select-popup')
          ?.focusSearch?.();
      });
    }
  }

  private _setSearch(value: string) {
    if (this._search === value) return;
    this._search = value;
    this.dispatchEvent(new CustomEvent('search', {
      detail: { value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleSearchInput = (event: CustomEvent<{ value: string }>) => {
    this._setSearch(event.detail.value);
  };

  private _handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    const next: TreeSelectValue[] = [];
    this._setValue(next);
    this._emitChange(next);
    this.dispatchEvent(new CustomEvent('clear', {
      detail: { event },
      bubbles: true,
      composed: true,
    }));
    this._setOpen(false);
  };

  private _removeValue = (value: TreeSelectValue) => {
    const next = this._selectedValues.filter((item) => item !== value);
    if (!this._commit(next)) return;
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        value,
        option: this._allData().get(value),
        selectedOptions: next.map((item) => this._allData().get(item)).filter(Boolean),
      },
      bubbles: true,
      composed: true,
    }));
  };

  private _filterData(nodes: TreeSelectData[], path: TreeSelectValue[] = []): TreeSelectData[] {
    const query = this._search.trim();
    if (!query) return nodes;
    const result: TreeSelectData[] = [];
    nodes.forEach((data) => {
      const value = this._valueOf(data);
      const nextPath = [...path, value];
      const children = this._childrenOf(data);
      const filteredChildren = children ? this._filterData(children, nextPath) : [];
      const labels = nextPath
        .map((item) => {
          const found = this._allData().get(item);
          return found ? this._labelOf(found) : String(item);
        })
        .join(',');
      let matched: boolean;
      if (typeof this.filterTreeNode === 'function') {
        matched = this.filterTreeNode(query, labels, data);
      } else {
        const text = String(data[this.treeNodeFilterProp] ?? this._labelOf(data));
        matched = text.toLowerCase().includes(query.toLowerCase());
      }
      if (matched && !this.filterLeafOnly) {
        result.push(data);
      } else if (matched && this.filterLeafOnly && !children?.length) {
        result.push(data);
      } else if (filteredChildren.length) {
        result.push({ ...data, children: filteredChildren });
      }
    });
    return result;
  }

  private _searchAncestors(nodes: TreeSelectData[], path: TreeSelectValue[] = []): TreeSelectValue[] {
    const result: TreeSelectValue[] = [];
    const walk = (list: TreeSelectData[], trail: TreeSelectValue[]): boolean => {
      let any = false;
      list.forEach((data) => {
        const value = this._valueOf(data);
        const next = [...trail, value];
        const children = this._childrenOf(data);
        const childMatched = children ? walk(children, next) : false;
        const query = this._search.trim().toLowerCase();
        const text = String(data[this.treeNodeFilterProp] ?? this._labelOf(data)).toLowerCase();
        if (childMatched || (query && text.includes(query))) {
          if (children?.length) result.push(value);
          any = true;
        }
      });
      return any;
    };
    walk(nodes, path);
    return result;
  }

  private _mapNodes(nodes: TreeSelectData[], path: TreeSelectValue[] = []): TreeSelectTreeNode[] {
    return nodes.map((data) => {
      const value = this._valueOf(data);
      const children = this._childrenOf(data);
      const nextPath = [...path, value];
      return {
        key: value,
        label: this._labelOf(data),
        disabled: this._disabledOf(data),
        isLeaf: this._isLeaf(data),
        children: children ? this._mapNodes(children, nextPath) : undefined,
        __data: data,
        __path: nextPath,
      };
    });
  }

  private _renderSelection(): TemplateResult | typeof nothing {
    const values = this._selectedValues;
    if (!values.length) {
      return html`<span class="${p}-placeholder">${this.placeholder ?? ''}</span>`;
    }

    if (!this.multiple) {
      const label = this._displayValue(values[0]);
      return html`<span class="${p}-value">${this.displayRender
        ? this.displayRender([label], 0)
        : label}</span>`;
    }

    const shown = this.maxTagCount !== undefined ? values.slice(0, this.maxTagCount) : values;
    const rest = this.maxTagCount !== undefined ? values.length - shown.length : 0;
    return html`
      ${shown.map((value, index) => {
        const data = this._allData().get(value);
        const label = data ? this._labelFor(data) : String(value);
        return html`<semi-tag
          size="small"
          .closable=${!this.disabled}
          @close=${(event: CustomEvent) => {
            event.stopPropagation();
            this._removeValue(value);
          }}
        >${this.displayRender ? this.displayRender([label], index) : label}</semi-tag>`;
      })}
      ${rest > 0
        ? html`<span class="${p}-selection-n" title=${values.slice(shown.length).map((item) => this._displayValue(item)).join(', ')}>+${rest}</span>`
        : nothing}
    `;
  }

  private _renderPopup() {
    const source = this.filterTreeNode && this._search && !this.remote
      ? this._filterData(this.treeData)
      : this.treeData;
    const treeData = this._mapNodes(source);
    const expanded = this._search
      ? this._searchAncestors(source)
      : this.expandedKeys ?? this._expanded;
    const isCheckable = this.checkable || this.multiple;
    return html`
      <semi-tree-select-popup
        .treeData=${treeData}
        .expandedKeys=${expanded}
        .selectedKeys=${isCheckable ? [] : this._selectedValues}
        .checkedKeys=${isCheckable ? this._selectedValues : []}
        .multiple=${this.multiple}
        .checkable=${isCheckable}
        .checkStrictly=${this.checkRelation === 'unRelated'}
        .emptyText=${this.emptyContent}
        .searchable=${Boolean(this.filterTreeNode)}
        .searchValue=${this._search}
        .searchPlaceholder=${this.searchPlaceholder ?? this.placeholder ?? ''}
        .topSlot=${this.topSlot}
        .bottomSlot=${this.bottomSlot}
        .loadData=${this.loadData
          ? (node: TreeNode) => this.loadData?.((node as TreeSelectTreeNode).__data)
          : undefined}
        @search-input=${this._handleSearchInput}
        @select=${this._handleSelect}
        @check=${this._handleCheck}
        @expand=${this._handleExpand}
        @load=${this._handleLoad}
      ></semi-tree-select-popup>
    `;
  }

  render() {
    const values = this._selectedValues;
    const hasValue = values.length > 0;
    const cls = handleClsList([
      prefixCls,
      `${prefixCls}-${this.size}`,
      this.multiple ? `${prefixCls}-multiple` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
      this.borderless ? `${prefixCls}-borderless` : '',
      this._open ? `${prefixCls}-focus` : '',
      this.validateStatus !== 'default' ? `${prefixCls}-${this.validateStatus}` : '',
    ]);
    const [position, align] = this._triggerPlacement();

    return html`
      <semi-trigger
        .trigger=${'custom'}
        .open=${this._open}
        position=${position}
        align=${align}
        .content=${this._renderPopup()}
        .disabled=${this.disabled}
        .showArrow=${this.showArrow}
        .popupPlain=${true}
        popupRole="listbox"
        @openChange=${this._handleOpenChange}
      >
        <div
          class="${cls}"
          role="combobox"
          tabindex=${this.disabled ? -1 : 0}
          aria-haspopup="tree"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-label=${this.pickerLabel}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this._handleTriggerClick}
          @mouseenter=${() => { this._hovering = true; }}
          @mouseleave=${() => { this._hovering = false; }}
          @focus=${() => { this._focused = true; }}
          @blur=${() => { this._focused = false; }}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === 'Escape') this._setOpen(false);
            else if (event.key === 'Enter' || event.key === 'ArrowDown') {
              event.preventDefault();
              this._setOpen(!this._open);
            }
          }}
        >
          <span class="${p}-prefix"><slot name="prefix"></slot></span>
          <div class="${p}-selection">
            ${this.insetLabel
              ? html`<span class="${p}-inset-label">${this.insetLabel}</span>`
              : nothing}
            <slot name="inset-label"></slot>
            ${this._renderSelection()}
          </div>
          <span class="${p}-suffix">
            <slot name="suffix"></slot>
            ${this.showClear && hasValue && !this.disabled && (this._hovering || this._open)
              ? html`<span
                  class="${p}-clear"
                  role="button"
                  aria-label="清除"
                  @click=${this._handleClear}
                ><semi-icon-close></semi-icon-close></span>`
              : nothing}
            ${this.showArrow && !(this.showClear && hasValue && !this.disabled && (this._hovering || this._open))
              ? html`<span class="${p}-arrow"><semi-icon-down></semi-icon-down></span>`
              : nothing}
          </span>
        </div>
      </semi-trigger>
    `;
  }

  private _triggerPlacement(): ['top' | 'bottom', 'start' | 'center' | 'end'] {
    const position = this.position.toLowerCase();
    const vertical = position.startsWith('top') ? 'top' : 'bottom';
    const align = position.endsWith('right') ? 'end' : position.endsWith('center') ? 'center' : 'start';
    return [vertical, align];
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
    }

    .${p} {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-height: 32px;
      padding: 0 12px;
      color: var(--semi-color-text-0);
      font-size: 14px;
      background-color: var(--semi-color-fill-0);
      border: 1px solid transparent;
      border-radius: 3px;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .${p}:hover {
      background-color: var(--semi-color-fill-1);
    }

    .${p}-focus {
      background-color: var(--semi-color-fill-1);
      border-color: var(--semi-color-focus-border);
    }

    .${p}-small {
      min-height: 24px;
      padding: 0 8px;
      font-size: 12px;
    }

    .${p}-large {
      min-height: 40px;
      padding: 0 16px;
      font-size: 16px;
    }

    .${p}-borderless {
      background-color: transparent;
    }

    .${p}-disabled {
      color: var(--semi-color-disabled-text);
      background-color: var(--semi-color-disabled-fill);
      cursor: not-allowed;
    }

    .${p}-error {
      border-color: var(--semi-color-danger);
    }

    .${p}-warning {
      border-color: var(--semi-color-warning);
    }

    .${p}-success {
      border-color: var(--semi-color-success);
    }

    .${p}-prefix,
    .${p}-suffix {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
    }

    .${p}-suffix {
      gap: 4px;
      color: var(--semi-color-text-2);
    }

    .${p}-selection {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      min-width: 0;
    }

    .${p}-placeholder {
      color: var(--semi-color-text-3);
    }

    .${p}-inset-label {
      flex-shrink: 0;
      color: var(--semi-color-text-2);
      font-size: 12px;
    }

    .${p}-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-selection-n {
      padding: 0 6px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      line-height: 20px;
      background-color: var(--semi-color-fill-1);
      border-radius: 3px;
    }

    .${p}-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      color: var(--semi-color-text-3);
      font-size: 12px;
      background-color: var(--semi-color-fill-1);
      border-radius: 50%;
      cursor: pointer;
    }

    .${p}-arrow {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      transition: transform 0.2s ease;
    }

    .${p}-focus .${p}-arrow {
      transform: rotate(180deg);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tree-select': SemiTreeSelect;
  }
}
