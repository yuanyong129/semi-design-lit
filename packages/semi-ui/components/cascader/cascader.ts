import { css, html, LitElement, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import {
  CascaderCheckRelation,
  CascaderData,
  CascaderDisplayRender,
  CascaderFilterTreeNode,
  CascaderKeyMaps,
  CascaderPath,
  CascaderSearchPosition,
  CascaderSize,
  CascaderValidateStatus,
  CascaderValue,
  CascaderValueType,
} from './interface';
import '../trigger/trigger';
import '../tag/tag';
import './cascader-panel';
import { CascaderPanelNode, CascaderSearchRow } from './cascader-panel';
import '../../../semi-icons/build/down';
import '../../../semi-icons/build/close';

const p = unsafeCSS('semi-cascader');
const VALUE_SPLIT = '_SEMI_CASCADER_SPLIT_';

function normalizeValue(value: CascaderValueType | undefined): CascaderPath[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return [[value]];
  if (value.length === 0) return [];
  if (Array.isArray(value[0])) return (value as CascaderPath[]).map((path) => [...path]);
  return [[...(value as CascaderPath)]];
}

function isDescendantPath(path: CascaderPath, parent: CascaderPath): boolean {
  if (path.length <= parent.length) return false;
  return parent.every((value, index) => value === path[index]);
}

function pathKey(path: CascaderPath): string {
  return path.join(VALUE_SPLIT);
}

@customElement('semi-cascader')
export class SemiCascader extends LitElement {
  @property({ attribute: false })
  value?: CascaderValueType;

  @property({ attribute: false })
  defaultValue?: CascaderValueType;

  @property({ attribute: false })
  treeData: CascaderData[] = [];

  @property({ attribute: false })
  keyMaps?: CascaderKeyMaps;

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ attribute: 'change-on-select', type: Boolean })
  changeOnSelect: boolean = false;

  @property({ attribute: 'auto-merge-value', type: Boolean })
  autoMergeValue: boolean = true;

  @property({ attribute: 'leaf-only', type: Boolean })
  leafOnly: boolean = false;

  @property()
  checkRelation: CascaderCheckRelation = 'related';

  @property({ attribute: 'disable-strictly', type: Boolean })
  disableStrictly: boolean = false;

  @property({ type: Number })
  max?: number;

  @property({ attribute: 'enable-leaf-click', type: Boolean })
  enableLeafClick: boolean = false;

  @property({ attribute: 'click-to-select', type: Boolean })
  clickToSelect: boolean = false;

  @property({ attribute: false })
  loadData?: (selectOptions: CascaderData[]) => Promise<void>;

  @property()
  separator: string = ' / ';

  @property({
    attribute: 'filter-tree-node',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null || value === 'false') return false;
        if (value === '' || value === 'true') return true;
        return value;
      },
      toAttribute: (value: CascaderFilterTreeNode) => (value === true ? '' : null),
    },
  })
  filterTreeNode: CascaderFilterTreeNode = false;

  @property({ attribute: 'filter-leaf-only', type: Boolean })
  filterLeafOnly: boolean = true;

  @property({ attribute: 'tree-node-filter-prop' })
  treeNodeFilterProp: string = 'label';

  @property({ type: Boolean })
  remote: boolean = false;

  @property({ attribute: 'search-position' })
  searchPosition: CascaderSearchPosition = 'trigger';

  @property({ attribute: 'search-placeholder' })
  searchPlaceholder?: string;

  @property({ attribute: false })
  displayRender?: CascaderDisplayRender;

  @property({ attribute: 'display-prop' })
  displayProp: string = 'label';

  @property({ attribute: 'on-change-with-object', type: Boolean })
  onChangeWithObject: boolean = false;

  @property({ attribute: false })
  triggerRender?: (props: unknown) => string | TemplateResult;

  @property({ attribute: false })
  arrowIcon?: TemplateResult;

  @property({ attribute: false })
  clearIcon?: TemplateResult;

  @property({ attribute: false })
  expandIcon?: TemplateResult;

  @property()
  insetLabel?: string;

  @property()
  placeholder?: string;

  @property()
  size: CascaderSize = 'default';

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ attribute: 'show-clear', type: Boolean })
  showClear: boolean = false;

  @property({ attribute: 'default-open', type: Boolean })
  defaultOpen: boolean = false;

  @property()
  position: string = 'bottomLeft';

  @property({ type: Boolean })
  borderless: boolean = false;

  @property()
  validateStatus: CascaderValidateStatus = 'default';

  @property({ attribute: false })
  emptyContent: string | TemplateResult = '暂无数据';

  @property({ attribute: false })
  topSlot?: TemplateResult;

  @property({ attribute: false })
  bottomSlot?: TemplateResult;

  @property({ attribute: 'max-tag-count', type: Number })
  maxTagCount?: number;

  @property({ attribute: 'aria-label' })
  pickerLabel: string = 'Cascader';

  @state()
  private _selectedPaths: CascaderPath[] = [];

  @state()
  private _activePath: CascaderPath = [];

  @state()
  private _open: boolean = false;

  @state()
  private _searchValue: string = '';

  @state()
  private _focused: boolean = false;

  @state()
  private _hovering: boolean = false;

  @state()
  private _loadingKeys: Set<string> = new Set();

  @query('.semi-cascader-search-input')
  private _input?: HTMLInputElement;

  private _nodes: CascaderPanelNode[] = [];
  private _nodeMap = new Map<string, CascaderPanelNode>();
  private _valueInitialized = false;
  private _lastTreeData?: CascaderData[];
  private _lastKeyMaps?: CascaderKeyMaps;
  private _loadedKeys = new Set<string>();

  connectedCallback() {
    super.connectedCallback();
    this._selectedPaths = normalizeValue(this.value ?? this.defaultValue);
    this._valueInitialized = true;
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (
      !this._nodeMap.size ||
      changed.has('treeData') ||
      changed.has('keyMaps') ||
      this.treeData !== this._lastTreeData ||
      this.keyMaps !== this._lastKeyMaps
    ) {
      this._rebuildNodes();
    }
    if (changed.has('value')) {
      this._selectedPaths = this.value === undefined ? [] : normalizeValue(this.value);
      if (!this._selectedPaths.length) {
        this._activePath = [];
      } else if (!this._activePath.length) {
        this._syncActivePath();
      }
    }
  }

  protected firstUpdated() {
    if (this.defaultOpen && !this.disabled) {
      this._setOpen(true);
    }
  }

  private _keys(): Required<CascaderKeyMaps> {
    return {
      value: this.keyMaps?.value ?? 'value',
      label: this.keyMaps?.label ?? 'label',
      children: this.keyMaps?.children ?? 'children',
      disabled: this.keyMaps?.disabled ?? 'disabled',
      isLeaf: this.keyMaps?.isLeaf ?? 'isLeaf',
    };
  }

  private _rebuildNodes() {
    const maps = this._keys();
    const nodeMap = new Map<string, CascaderPanelNode>();

    const walk = (items: CascaderData[] | undefined, parentPath: CascaderPath, parent?: CascaderPanelNode) => {
      if (!Array.isArray(items)) return [] as CascaderPanelNode[];
      const result: CascaderPanelNode[] = [];
      items.forEach((data) => {
        if (!data || data[maps.value] === undefined) return;
        const value = data[maps.value] as CascaderValue;
        const path = [...parentPath, value];
        const key = pathKey(path);
        const rawChildren = data[maps.children] as CascaderData[] | undefined;
        const explicitLeaf = data[maps.isLeaf];
        const hasChildren = Array.isArray(rawChildren) && rawChildren.length > 0;
        let isLeaf = explicitLeaf === true;
        if (explicitLeaf === undefined) {
          isLeaf = !hasChildren && !this.loadData;
        }
        if (hasChildren) isLeaf = false;
        if (this.loadData && explicitLeaf === undefined && !hasChildren) isLeaf = false;
        const rawLabel = (data[maps.label] ?? String(value)) as string | TemplateResult;
        const labelText = typeof rawLabel === 'string' ? rawLabel : String(rawLabel);
        const node: CascaderPanelNode = {
          data,
          value,
          label: rawLabel,
          labelText,
          path,
          key,
          children: [],
          disabled: Boolean(data[maps.disabled]),
          isLeaf,
        };
        nodeMap.set(key, node);
        result.push(node);
        if (hasChildren) {
          node.children = walk(rawChildren, path, node);
          node.isLeaf = false;
        } else if (this.loadData && explicitLeaf !== true) {
          node.isLeaf = false;
        }
        if (parent) {
          // The parent relation is not exposed: paths are enough for all selection logic.
        }
      });
      return result;
    };

    this._nodes = walk(this.treeData, []);
    this._nodeMap = nodeMap;
    this._lastTreeData = this.treeData;
    this._lastKeyMaps = this.keyMaps;

    const activeNode = this._nodeMap.get(pathKey(this._activePath));
    if (this._activePath.length && !activeNode) {
      this._activePath = [];
    }
  }

  private _syncActivePath() {
    if (this._selectedPaths.length) {
      this._activePath = [...this._selectedPaths[0]];
    } else {
      this._activePath = [];
    }
  }

  private get _filterable(): boolean {
    return Boolean(this.filterTreeNode);
  }

  private get _searching(): boolean {
    return this._filterable && this._searchValue.trim().length > 0;
  }

  private _columns(): CascaderPanelNode[][] {
    const columns: CascaderPanelNode[][] = [];
    let level = this._nodes;
    let index = 0;
    while (level.length) {
      columns.push(level);
      const value = this._activePath[index];
      if (value === undefined) break;
      const next = level.find((node) => node.value === value);
      if (!next || !next.children.length) break;
      level = next.children;
      index += 1;
    }
    return columns;
  }

  private _expandedSelectedKeys(): string[] {
    const keys = new Set(this._selectedPaths.map(pathKey));
    if (this.multiple && this.checkRelation === 'related') {
      const visit = (node: CascaderPanelNode) => {
        if (keys.has(node.key)) {
          const addDescendants = (current: CascaderPanelNode) => {
            current.children.forEach((child) => {
              keys.add(child.key);
              addDescendants(child);
            });
          };
          addDescendants(node);
        }
        node.children.forEach(visit);
      };
      this._nodes.forEach(visit);
    }
    return [...keys];
  }

  private _halfKeys(): string[] {
    if (!this.multiple) return [];
    const selected = new Set(this._selectedPaths.map(pathKey));
    const half = new Set<string>();
    const visit = (node: CascaderPanelNode): boolean => {
      let descendantSelected = false;
      node.children.forEach((child) => {
        if (visit(child)) descendantSelected = true;
      });
      if (descendantSelected && !selected.has(node.key)) half.add(node.key);
      return descendantSelected || selected.has(node.key);
    };
    this._nodes.forEach(visit);
    return [...half];
  }

  private _searchRows(): CascaderSearchRow[] {
    if (!this._searching) return [];
    const query = this._searchValue.trim();
    const lower = query.toLowerCase();
    const rows: CascaderSearchRow[] = [];
    const visit = (node: CascaderPanelNode, ancestors: string[]) => {
      const labels = [...ancestors, node.labelText];
      let matched = false;
      if (this.remote) {
        matched = true;
      } else if (typeof this.filterTreeNode === 'function') {
        matched = Boolean(this.filterTreeNode(query, labels.join(','), node.data));
      } else {
        matched = labels.join('').toLowerCase().includes(lower);
      }
      if (matched && (!this.filterLeafOnly || node.isLeaf)) {
        const label = labels.join(this.separator);
        const matchStart = lower ? label.toLowerCase().indexOf(lower) : -1;
        rows.push({
          node,
          label,
          matchStart,
          matchLength: matchStart >= 0 ? query.length : 0,
        });
      }
      node.children.forEach((child) => visit(child, labels));
    };
    this._nodes.forEach((node) => visit(node, []));
    return rows;
  }

  private _nodeAtPath(path: CascaderPath): CascaderPanelNode | undefined {
    let level = this._nodes;
    let node: CascaderPanelNode | undefined;
    for (const value of path) {
      node = level.find((item) => item.value === value);
      if (!node) return undefined;
      level = node.children;
    }
    return node;
  }

  private _pathData(path: CascaderPath): CascaderData[] {
    const result: CascaderData[] = [];
    let level = this._nodes;
    for (const value of path) {
      const node = level.find((item) => item.value === value);
      if (!node) break;
      result.push(node.data);
      level = node.children;
    }
    return result;
  }

  private _pathLabel(path: CascaderPath, index?: number): string | TemplateResult {
    const nodes = path.map((value, depth) => this._nodeAtPath(path.slice(0, depth + 1))).filter(Boolean) as CascaderPanelNode[];
    const labels = nodes.map((node) => node.labelText);
    if (this.displayRender) {
      const selected = this.multiple ? nodes.map((node) => node.data) : labels;
      return this.displayRender(selected, index);
    }
    if (!labels.length) return path.join(this.separator);
    return labels.join(this.separator);
  }

  private _hasValue(): boolean {
    return this._selectedPaths.length > 0 || this._searchValue.length > 0;
  }

  private _showClearButton(): boolean {
    return this.showClear && !this.disabled && this._hasValue() && (this._open || this._hovering);
  }

  private _emitChange() {
    const value = this.multiple
      ? this._selectedPaths.map((path) => [...path])
      : this._selectedPaths[0]
        ? [...this._selectedPaths[0]]
        : [];
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _emitSelect(node: CascaderPanelNode) {
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: {
          value: [...node.path],
          option: node.data,
          selectedOptions: this._selectedPaths.map((path) => this._pathData(path).slice(-1)[0]).filter(Boolean),
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _setOpen(open: boolean) {
    if (this._open === open) return;
    this._open = open;
    if (!open) {
      this._searchValue = '';
    }
    this.dispatchEvent(
      new CustomEvent('open-change', {
        detail: { open },
        bubbles: true,
        composed: true,
      })
    );
    if (open) {
      this.updateComplete.then(() => {
        if (this._filterable && this.searchPosition === 'trigger') {
          this._input?.focus();
        }
      });
    }
  }

  private _toggleOpen() {
    if (this.disabled) return;
    this._setOpen(!this._open);
  }

  private _handleTriggerOpenChange = (event: CustomEvent<{ open: boolean }>) => {
    if (this.disabled) return;
    if (this._open === event.detail.open) return;
    this._setOpen(event.detail.open);
  };

  private _handleOptionClick(node: CascaderPanelNode, event: MouseEvent) {
    if (node.disabled) return;
    if (this.multiple) {
      this._activePath = [...node.path];
      if (!node.isLeaf) this._loadNode(node);
      if (this.clickToSelect || (node.isLeaf && this.enableLeafClick)) {
        this._toggleNode(node);
      }
      return;
    }
    this._selectSingle(node, false);
    event.stopPropagation();
  }

  private _handleOptionCheck(node: CascaderPanelNode, event: MouseEvent) {
    if (node.disabled) return;
    event.stopPropagation();
    this._activePath = [...node.path];
    this._toggleNode(node);
  }

  private _handleSearchSelect(row: CascaderSearchRow) {
    if (row.node.disabled) return;
    if (this.multiple) {
      this._toggleNode(row.node);
      return;
    }
    this._selectSingle(row.node, true);
  }

  private _selectSingle(node: CascaderPanelNode, searching: boolean) {
    if (!node.isLeaf && !this.changeOnSelect && !searching) {
      this._activePath = [...node.path];
      this._loadNode(node);
      return;
    }
    const changed = pathKey(this._selectedPaths[0] ?? []) !== node.key;
    this._selectedPaths = [[...node.path]];
    this._activePath = [...node.path];
    this._emitSelect(node);
    if (changed) this._emitChange();
    if (node.isLeaf || (!this.filterLeafOnly && searching)) {
      this._setOpen(false);
    }
  }

  private _leavesOf(node: CascaderPanelNode): CascaderPath[] {
    if (node.isLeaf) return [[...node.path]];
    return node.children.flatMap((child) => this._leavesOf(child));
  }

  private _toggleNode(node: CascaderPanelNode) {
    if (node.disabled) return;
    const key = node.key;
    const checked = this._selectedPaths.some((path) => pathKey(path) === key);
    let paths = [...this._selectedPaths];

    if (!checked) {
      if (this.max !== undefined && paths.length >= this.max) {
        this.dispatchEvent(
          new CustomEvent('exceed', {
            detail: { checkedItems: this._selectedPaths.map((path) => this._pathData(path).slice(-1)[0]).filter(Boolean) },
            bubbles: true,
            composed: true,
          })
        );
        return;
      }
      if (this.autoMergeValue) {
        paths = paths.filter((path) => !isDescendantPath(path, node.path) && !isDescendantPath(node.path, path));
      }
      if (this.leafOnly && !node.isLeaf) {
        paths.push(...this._leavesOf(node));
      } else {
        paths.push([...node.path]);
      }
    } else {
      paths = paths.filter((path) => !isDescendantPath(path, node.path) && !isDescendantPath(node.path, path));
    }

    this._selectedPaths = paths;
    this._activePath = [...node.path];
    this._emitChange();
    if (!checked) this._emitSelect(node);
  }

  private async _loadNode(node: CascaderPanelNode) {
    if (!this.loadData || node.isLeaf || node.children.length || node.data?.loading) return;
    if (this._loadingKeys.has(node.key) || this._loadedKeys.has(node.key)) return;
    const loadingKeys = new Set(this._loadingKeys);
    loadingKeys.add(node.key);
    this._loadingKeys = loadingKeys;
    try {
      await this.loadData(this._pathData(node.path));
      this._loadedKeys.add(node.key);
      this._rebuildNodes();
      this.dispatchEvent(
        new CustomEvent('load', {
          detail: { loadedKeys: new Set(this._loadedKeys), data: node.data },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      const next = new Set(this._loadingKeys);
      next.delete(node.key);
      this._loadingKeys = next;
      this.requestUpdate();
    }
  }

  private _handleTagClose(path: CascaderPath, event: MouseEvent) {
    event.stopPropagation();
    this._selectedPaths = this._selectedPaths.filter((item) => pathKey(item) !== pathKey(path));
    this._emitChange();
  }

  private _handleClear(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('clear', {
        detail: { event },
        bubbles: true,
        composed: true,
      })
    );
    this._selectedPaths = [];
    this._activePath = [];
    this._searchValue = '';
    this._emitChange();
    this._setOpen(false);
  }

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._searchValue = input.value;
    if (!this._open) this._setOpen(true);
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { value: input.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleInputKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    if (event.key === 'Escape') {
      this._setOpen(false);
    }
  }

  private _handleRootKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this._setOpen(false);
      return;
    }
    if (event.key === 'Enter' && event.target === event.currentTarget) {
      event.preventDefault();
      this._toggleOpen();
    }
  }

  private _renderSelection() {
    if (this.multiple) {
      const visible = this.maxTagCount === undefined ? this._selectedPaths : this._selectedPaths.slice(0, this.maxTagCount);
      const rest = this.maxTagCount === undefined ? 0 : this._selectedPaths.length - this.maxTagCount;
      return html`
        <div class="${p}-selection ${p}-selection-multiple">
          ${visible.map(
            (path) => html`
              <semi-tag
                size=${this.size === 'small' ? 'small' : 'default'}
                type="light"
                color="white"
                closable
                @close=${(event: CustomEvent) => {
                  event.stopPropagation();
                  this._handleTagClose(path, event as unknown as MouseEvent);
                }}
              >
                ${this._pathLabel(path)}
              </semi-tag>
            `
          )}
          ${rest > 0
            ? html`<span class="${p}-selection-n" title=${this._selectedPaths.slice(this.maxTagCount).map((path) => String(this._pathLabel(path))).join(', ')}>+${rest}</span>`
            : nothing}
          ${this._filterable
            ? html`<input
                class="${p}-search-input"
                .value=${this._searchValue}
                placeholder=${this._selectedPaths.length ? '' : (this.searchPlaceholder ?? this.placeholder ?? '')}
                @input=${this._handleInput}
                @keydown=${this._handleInputKeydown}
                @focus=${() => (this._focused = true)}
                @blur=${() => (this._focused = false)}
              />`
            : nothing}
        </div>
      `;
    }

    const selected = this._selectedPaths[0];
    if (this._filterable && this._open) {
      return html`
        <div class="${p}-selection">
          <input
            class="${p}-search-input"
            .value=${this._searchValue}
            placeholder=${selected ? String(this._pathLabel(selected)) : (this.searchPlaceholder ?? this.placeholder ?? '')}
            @input=${this._handleInput}
            @keydown=${this._handleInputKeydown}
            @focus=${() => (this._focused = true)}
            @blur=${() => (this._focused = false)}
          />
        </div>
      `;
    }
    return html`
      <div class="${p}-selection">
        ${selected
          ? html`<span class="${p}-selection-text">${this._pathLabel(selected)}</span>`
          : html`<span class="${p}-selection-placeholder">${this.placeholder ?? ''}</span>`}
      </div>
    `;
  }

  private _renderRoot() {
    const classes = [
      p,
      this.multiple ? `${p}-multiple` : `${p}-single`,
      this.size !== 'default' ? `${p}-${this.size}` : '',
      this.borderless ? `${p}-borderless` : '',
      this.disabled ? `${p}-disabled` : '',
      this._open ? `${p}-focus` : '',
      this._filterable ? `${p}-filterable` : '',
      this.validateStatus !== 'default' ? `${p}-${this.validateStatus}` : '',
      this.insetLabel ? `${p}-with-inset-label` : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div
        class=${classes}
        role="combobox"
        aria-label=${this.pickerLabel}
        aria-haspopup="listbox"
        aria-expanded=${this._open ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? -1 : 0}
        @click=${this._toggleOpen}
        @keydown=${this._handleRootKeydown}
        @mouseenter=${() => (this._hovering = true)}
        @mouseleave=${() => (this._hovering = false)}
      >
        ${this.insetLabel
          ? html`<span class="${p}-inset-label"><slot name="inset-label">${this.insetLabel}</slot></span>`
          : nothing}
        <slot name="prefix"></slot>
        ${this._renderSelection()}
        ${this._showClearButton()
          ? html`<span
              class="${p}-clearbtn"
              role="button"
              tabindex="0"
              aria-label="Clear"
              @click=${this._handleClear}
            >
              ${this.clearIcon ?? html`<semi-icon-close></semi-icon-close>`}
            </span>`
          : nothing}
        <span class="${p}-arrow">${this.arrowIcon ?? html`<semi-icon-down></semi-icon-down>`}</span>
        <slot name="suffix"></slot>
      </div>
    `;
  }

  private _renderPanel() {
    return html`
      <semi-cascader-panel
        .columns=${this._columns()}
        .searchRows=${this._searchRows()}
        .selectedKeys=${this._expandedSelectedKeys()}
        .halfKeys=${this._halfKeys()}
        .activeKey=${pathKey(this._activePath)}
        .multiple=${this.multiple}
        .searching=${this._searching}
        .loadingKeys=${[...this._loadingKeys]}
        .emptyContent=${this.emptyContent}
        .topSlot=${this.topSlot}
        .bottomSlot=${this.bottomSlot}
        @option-click=${(event: CustomEvent<{ node: CascaderPanelNode; event: MouseEvent }>) =>
          this._handleOptionClick(event.detail.node, event.detail.event)}
        @option-check=${(event: CustomEvent<{ node: CascaderPanelNode; event: MouseEvent }>) =>
          this._handleOptionCheck(event.detail.node, event.detail.event)}
        @search-select=${(event: CustomEvent<{ row: CascaderSearchRow; event: MouseEvent }>) =>
          this._handleSearchSelect(event.detail.row)}
      ></semi-cascader-panel>
    `;
  }

  public open() {
    this._setOpen(true);
  }

  public close() {
    this._setOpen(false);
  }

  public focus() {
    this._input?.focus();
    (this.renderRoot.querySelector(`.${p}`) as HTMLElement | null)?.focus();
  }

  public blur() {
    this._input?.blur();
    (this.renderRoot.querySelector(`.${p}`) as HTMLElement | null)?.blur();
  }

  public search(value: string) {
    this._searchValue = value;
    this._setOpen(true);
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <semi-trigger
        trigger="custom"
        .open=${this._open}
        .content=${this._renderPanel()}
        .popupPlain=${true}
        .showArrow=${false}
        popupRole="listbox"
        position=${this.position.startsWith('top') ? 'top' : 'bottom'}
        align=${this.position.endsWith('Right') ? 'end' : 'start'}
        @openChange=${this._handleTriggerOpenChange}
      >
        ${this._renderRoot()}
      </semi-trigger>
    `;
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      color: var(--semi-color-text-0);
      font-size: 14px;
    }

    .${p} {
      display: inline-flex;
      align-items: center;
      width: 100%;
      height: 32px;
      padding: 0 11px;
      border: 1px solid var(--semi-color-border);
      border-radius: var(--semi-border-radius-small);
      background: var(--semi-color-fill-0);
      box-sizing: border-box;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s, background-color 0.2s;
      gap: 8px;
    }

    .${p}:hover {
      background: var(--semi-color-fill-1);
    }

    .${p}-focus {
      border-color: var(--semi-color-focus-border);
      background: var(--semi-color-bg-2);
    }

    .${p}-error {
      border-color: var(--semi-color-danger);
    }

    .${p}-warning {
      border-color: var(--semi-color-warning);
    }

    .${p}-disabled {
      color: var(--semi-color-disabled-text);
      background: var(--semi-color-disabled-fill);
      cursor: not-allowed;
    }

    .${p}-borderless {
      border-color: transparent;
      background: transparent;
    }

    .${p}-small {
      height: 24px;
      padding: 0 7px;
    }

    .${p}-large {
      height: 40px;
      padding: 0 15px;
    }

    .${p}-inset-label {
      flex: 0 0 auto;
      padding-right: 8px;
      color: var(--semi-color-text-2);
    }

    .${p}-selection {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
    }

    .${p}-selection-multiple {
      flex-wrap: wrap;
      gap: 4px;
      overflow: visible;
    }

    .${p}-selection-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-selection-placeholder {
      color: var(--semi-color-text-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-selection-n {
      flex: 0 0 auto;
      padding: 0 4px;
      color: var(--semi-color-text-2);
    }

    .${p}-search-input {
      flex: 1 1 auto;
      min-width: 40px;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      color: inherit;
      font: inherit;
    }

    .${p}-arrow {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      color: var(--semi-color-text-2);
      transition: transform 0.2s;
    }

    .${p}-focus .${p}-arrow {
      transform: rotate(180deg);
    }

    .${p}-clearbtn {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      color: var(--semi-color-text-2);
      cursor: pointer;
    }

    .${p}-clearbtn:hover {
      color: var(--semi-color-text-1);
    }

    .${p}-arrow semi-icon-down,
    .${p}-clearbtn semi-icon-close {
      width: 16px;
      height: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-cascader': SemiCascader;
  }
}
