import { css, html, LitElement, nothing, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TreeNode, TreeNodeKey } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../../../semi-icons/build/right';

const prefixCls = getPrefixCls('tree');
const p = unsafeCSS(prefixCls);

function collectKeys(nodes: TreeNode[]): TreeNodeKey[] {
  const keys: TreeNodeKey[] = [];
  const walk = (items: TreeNode[]) => {
    items.forEach((node) => {
      if (node.children?.length) {
        keys.push(node.key);
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return keys;
}

function flatten(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  const walk = (items: TreeNode[]) => {
    items.forEach((node) => {
      result.push(node);
      if (node.children?.length) walk(node.children);
    });
  };
  walk(nodes);
  return result;
}

@customElement('semi-tree')
export class SemiTree extends LitElement {
  /**
   * @zh 树节点数据
   * @en Tree nodes
   */
  @property({ attribute: false })
  treeData: TreeNode[] = [];

  /**
   * @zh 展开的节点 key（受控）
   * @en Expanded keys (controlled)
   */
  @property({ attribute: false })
  expandedKeys?: TreeNodeKey[];

  /**
   * @zh 默认展开的节点 key
   * @en Default expanded keys
   */
  @property({ attribute: false })
  defaultExpandedKeys: TreeNodeKey[] = [];

  /**
   * @zh 默认展开全部
   * @en Expand all by default
   */
  @property({ attribute: 'default-expand-all', type: Boolean })
  defaultExpandAll: boolean = false;

  /**
   * @zh 选中的节点 key（受控）
   * @en Selected keys (controlled)
   */
  @property({ attribute: false })
  selectedKeys?: TreeNodeKey[];

  /**
   * @zh 默认选中的节点 key
   * @en Default selected keys
   */
  @property({ attribute: false })
  defaultSelectedKeys: TreeNodeKey[] = [];

  /**
   * @zh 是否多选
   * @en Whether multiple selection is enabled
   */
  @property({ type: Boolean })
  multiple: boolean = false;

  /**
   * @zh 是否显示连接线
   * @en Whether to show connecting lines
   */
  @property({ attribute: 'show-line', type: Boolean })
  showLine: boolean = false;

  /**
   * @zh 是否可选中
   * @en Whether nodes are selectable
   */
  @property({ type: Boolean })
  selectable: boolean = true;

  /**
   * @zh 空数据文案
   * @en Empty text
   */
  @property({ attribute: 'empty-text' })
  emptyText: string = '暂无数据';

  @state()
  private _expanded = new Set<TreeNodeKey>();

  @state()
  private _selected = new Set<TreeNodeKey>();

  connectedCallback() {
    super.connectedCallback();
    const expanded = this.defaultExpandAll
      ? collectKeys(this.treeData)
      : this.defaultExpandedKeys;
    this._expanded = new Set(expanded);
    this._selected = new Set(this.defaultSelectedKeys);
  }

  private get _expandedSet(): Set<TreeNodeKey> {
    return new Set(this.expandedKeys ?? [...this._expanded]);
  }

  private get _selectedSet(): Set<TreeNodeKey> {
    return new Set(this.selectedKeys ?? [...this._selected]);
  }

  private _toggleExpand(node: TreeNode) {
    if (!node.children?.length || node.disabled) return;
    const current = this._expandedSet;
    const expanded = !current.has(node.key);
    if (expanded) current.add(node.key);
    else current.delete(node.key);

    if (this.expandedKeys === undefined) {
      this._expanded = current;
    }
    this.dispatchEvent(new CustomEvent('expand', {
      detail: { expanded, node, expandedKeys: [...current] },
      bubbles: true,
      composed: true,
    }));
  }

  private _select(node: TreeNode) {
    if (!this.selectable || node.disabled) return;
    const current = this._selectedSet;
    const selected = current.has(node.key);
    if (this.multiple) {
      if (selected) current.delete(node.key);
      else current.add(node.key);
    } else {
      current.clear();
      if (!selected) current.add(node.key);
    }

    if (this.selectedKeys === undefined) {
      this._selected = current;
    }
    const selectedNodes = flatten(this.treeData).filter((item) => current.has(item.key));
    this.dispatchEvent(new CustomEvent('select', {
      detail: { selected: !selected, node, selectedKeys: [...current], selectedNodes },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderNodes(nodes: TreeNode[], level: number): TemplateResult[] {
    const expandedKeys = this._expandedSet;
    const selectedKeys = this._selectedSet;

    return nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const expanded = expandedKeys.has(node.key);
      const selected = selectedKeys.has(node.key);

      return html`
        <div class="${prefixCls}-node-wrapper" role="none">
          <div
            class="${prefixCls}-node ${selected ? `${prefixCls}-node-selected` : ''} ${node.disabled ? `${prefixCls}-node-disabled` : ''}"
            role="treeitem"
            aria-selected=${selected ? 'true' : 'false'}
            aria-expanded=${hasChildren ? (expanded ? 'true' : 'false') : nothing}
            style="padding-left: ${level * 20 + 4}px;"
          >
            ${hasChildren
              ? html`<button
                  class="${prefixCls}-switcher ${expanded ? `${prefixCls}-switcher-expanded` : ''}"
                  type="button"
                  aria-label=${expanded ? 'Collapse' : 'Expand'}
                  @click=${(event: MouseEvent) => {
                    event.stopPropagation();
                    this._toggleExpand(node);
                  }}
                ><semi-icon-right></semi-icon-right></button>`
              : html`<span class="${prefixCls}-spacer"></span>`}
            ${node.icon ? html`<span class="${prefixCls}-icon">${node.icon}</span>` : nothing}
            <span class="${prefixCls}-label" @click=${() => this._select(node)}>${node.label}</span>
          </div>
          ${hasChildren && expanded
            ? html`<div class="${prefixCls}-children" role="group">${this._renderNodes(node.children!, level + 1)}</div>`
            : nothing}
        </div>
      `;
    });
  }

  render() {
    const cls = handleClsList([
      prefixCls,
      this.showLine ? `${prefixCls}-show-line` : '',
    ]);

    return html`
      <div class="${cls}" role="tree">
        ${this.treeData.length
          ? this._renderNodes(this.treeData, 0)
          : html`<div class="${prefixCls}-empty">${this.emptyText}</div>`}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p} {
      color: var(--semi-color-text-0);
      font-size: 14px;
    }

    .${p}-node {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      min-height: 32px;
      padding-right: 8px;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-node:hover {
      background-color: var(--semi-color-fill-0);
    }

    .${p}-node-selected {
      color: var(--semi-color-primary);
      background-color: var(--semi-color-primary-light-default);
    }

    .${p}-node-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }

    .${p}-switcher {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      color: var(--semi-color-text-2);
      font-size: 10px;
      background: transparent;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .${p}-switcher-expanded {
      transform: rotate(90deg);
    }

    .${p}-spacer {
      display: inline-block;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    .${p}-icon {
      display: inline-flex;
      align-items: center;
      margin-right: 6px;
      color: var(--semi-color-text-2);
    }

    .${p}-label {
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 24px;
      white-space: nowrap;
    }

    .${p}-children {
      position: relative;
    }

    .${p}-show-line .${p}-children {
      margin-left: 13px;
      border-left: 1px dashed var(--semi-color-border);
    }

    .${p}-empty {
      padding: 16px;
      color: var(--semi-color-text-3);
      font-size: 13px;
      text-align: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-tree': SemiTree
  }
}
