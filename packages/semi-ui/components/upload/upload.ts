import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { UploadFile, UploadRequestOptions } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { handleClsList } from '../_utils/web-utils';
import '../../../semi-icons/build/plus';
import '../../../semi-icons/build/close';
import '../../../semi-icons/build/check-circle-fill';
import '../../../semi-icons/build/close-circle';
import '../../../semi-icons/build/loading';
import '../../../semi-icons/build/edit';

const prefixCls = getPrefixCls('upload');
const p = unsafeCSS(prefixCls);

let uid = 0;

function formatSize(size?: number): string {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

@customElement('semi-upload')
export class SemiUpload extends LitElement {
  /**
   * @zh 文件列表（受控）
   * @en File list (controlled)
   */
  @property({ attribute: false })
  fileList?: UploadFile[];

  /**
   * @zh 默认文件列表
   * @en Default file list
   */
  @property({ attribute: false })
  defaultFileList: UploadFile[] = [];

  /**
   * @zh 是否支持多选
   * @en Whether multiple files are allowed
   */
  @property({ type: Boolean })
  multiple: boolean = false;

  /**
   * @zh 接受的文件类型
   * @en Accepted file types
   */
  @property()
  accept?: string;

  /**
   * @zh 是否禁用
   * @en Whether the upload is disabled
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * @zh 是否使用拖拽区域
   * @en Whether to use a drag area
   */
  @property({ type: Boolean })
  drag: boolean = false;

  /**
   * @zh 最大文件数
   * @en Maximum file count
   */
  @property({ type: Number })
  limit?: number;

  /**
   * @zh 是否显示文件列表
   * @en Whether to show the file list
   */
  @property({ attribute: 'show-file-list', type: Boolean })
  showFileList: boolean = true;

  /**
   * @zh 列表类型
   * @en List type
   * @values 'text','picture'
   * @defaultValue 'text'
   */
  @property({ attribute: 'list-type' })
  listType: 'text' | 'picture' = 'text';

  /**
   * @zh 拖拽区域提示文字
   * @en Drag area tip
   */
  @property()
  tip: string = '支持单个或批量上传';

  /**
   * @zh 上传按钮文字
   * @en Upload button text
   */
  @property({ attribute: 'button-text' })
  buttonText: string = '选择文件';

  /**
   * @zh 上传前校验，返回 false 跳过文件
   * @en Validate before upload, return false to skip
   */
  @property({ attribute: false })
  beforeUpload?: (file: File, files: File[]) => boolean | File | Promise<boolean | File>;

  /**
   * @zh 自定义上传请求
   * @en Custom upload request
   */
  @property({ attribute: false })
  customRequest?: (options: UploadRequestOptions) => void;

  @state()
  private _files: UploadFile[] = [];

  @state()
  private _dragging = false;

  private _objectUrls = new Map<string, string>();

  @query('input[type="file"]')
  private _input?: HTMLInputElement;

  connectedCallback() {
    super.connectedCallback();
    this._files = (this.fileList ?? this.defaultFileList).map((file) => ({
      ...file,
      status: file.status ?? 'success',
    }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this._objectUrls.clear();
  }

  private _previewUrl(file: File, uid: string): string | undefined {
    if (!file.type.startsWith('image/') || typeof URL.createObjectURL !== 'function') {
      return undefined;
    }
    const url = URL.createObjectURL(file);
    this._objectUrls.set(uid, url);
    return url;
  }

  private get _currentFiles(): UploadFile[] {
    return this.fileList ?? this._files;
  }

  private get _canAdd(): boolean {
    return !this.disabled && (!this.limit || this._currentFiles.length < this.limit);
  }

  private _open() {
    if (!this._canAdd) return;
    this._input?.click();
  }

  private _emitChange(file?: UploadFile) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { fileList: this._currentFiles, file },
      bubbles: true,
      composed: true,
    }));
  }

  private _updateFile(uid: string, patch: Partial<UploadFile>) {
    this._files = this._files.map((file) => file.uid === uid ? { ...file, ...patch } : file);
  }

  private _startUpload(file: UploadFile) {
    if (!file.file) return;
    if (this.customRequest) {
      this._updateFile(file.uid, { status: 'uploading', percent: 0 });
      this.customRequest({
        file: file.file,
        onProgress: (percent) => {
          this._updateFile(file.uid, { percent });
        },
        onSuccess: (response) => {
          this._updateFile(file.uid, { status: 'success', percent: 100, url: response?.url });
          this._emitChange(file);
        },
        onError: (error) => {
          this._updateFile(file.uid, { status: 'error', error: error.message });
          this._emitChange(file);
        },
      });
    } else {
      this._updateFile(file.uid, { status: 'success', percent: 100 });
    }
  }

  private async _addFiles(files: File[]) {
    if (this.disabled || !files.length) return;
    const current = this._currentFiles;
    const room = this.limit ? Math.max(0, this.limit - current.length) : files.length;
    const selected = files.slice(0, room);
    const accepted: File[] = [];

    for (const file of selected) {
      let result: boolean | File = true;
      if (this.beforeUpload) {
        result = await this.beforeUpload(file, selected);
      }
      if (result === false) continue;
      accepted.push(result instanceof File ? result : file);
    }

    if (!accepted.length) return;

    const additions: UploadFile[] = accepted.map((file) => {
      const fileUid = `upload-${Date.now()}-${uid++}`;
      return {
        uid: fileUid,
        name: file.name,
        size: file.size,
        status: 'ready',
        percent: 0,
        url: this._previewUrl(file, fileUid),
        file,
      };
    });

    this._files = [...current, ...additions];
    additions.forEach((file) => this._startUpload(file));
    this._emitChange(additions[additions.length - 1]);
  }

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    void this._addFiles(files);
  }

  private _handleDrop(event: DragEvent) {
    event.preventDefault();
    this._dragging = false;
    if (this.disabled) return;
    const files = Array.from(event.dataTransfer?.files ?? []);
    void this._addFiles(files);
  }

  private _remove(file: UploadFile, event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    const previewUrl = this._objectUrls.get(file.uid);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      this._objectUrls.delete(file.uid);
    }
    this._files = this._currentFiles.filter((item) => item.uid !== file.uid);
    this.dispatchEvent(new CustomEvent('remove', {
      detail: { file },
      bubbles: true,
      composed: true,
    }));
    this._emitChange(file);
  }

  private _renderFile(file: UploadFile) {
    return html`
      <li class="${prefixCls}-file ${prefixCls}-file-${file.status}">
        <span class="${prefixCls}-file-icon">
          ${file.status === 'success'
            ? html`<semi-icon-check-circle-fill></semi-icon-check-circle-fill>`
            : file.status === 'error'
              ? html`<semi-icon-close-circle></semi-icon-close-circle>`
              : file.status === 'uploading'
                ? html`<semi-icon-loading></semi-icon-loading>`
                : html`<span class="${prefixCls}-file-dot"></span>`}
        </span>
        <span class="${prefixCls}-file-name" title=${file.name}>${file.name}</span>
        <span class="${prefixCls}-file-size">${formatSize(file.size)}</span>
        <button
          class="${prefixCls}-file-remove"
          type="button"
          aria-label="Remove"
          ?disabled=${this.disabled}
          @click=${(event: MouseEvent) => this._remove(file, event)}
        ><semi-icon-close></semi-icon-close></button>
        ${file.status === 'uploading'
          ? html`<span class="${prefixCls}-progress"><span style="width: ${file.percent ?? 0}%"></span></span>`
          : nothing}
      </li>
    `;
  }

  private _renderPictureCard(file: UploadFile) {
    return html`
      <div class="${prefixCls}-picture-card ${prefixCls}-file-${file.status}">
        ${file.url
          ? html`<img class="${prefixCls}-picture-image" src=${file.url} alt=${file.name} />`
          : html`<span class="${prefixCls}-picture-placeholder"><semi-icon-edit></semi-icon-edit></span>`}
        <div class="${prefixCls}-picture-actions">
          <button
            class="${prefixCls}-file-remove"
            type="button"
            aria-label="Remove"
            ?disabled=${this.disabled}
            @click=${(event: MouseEvent) => this._remove(file, event)}
          ><semi-icon-close></semi-icon-close></button>
        </div>
        ${file.status === 'uploading'
          ? html`<span class="${prefixCls}-progress"><span style="width: ${file.percent ?? 0}%"></span></span>`
          : nothing}
        <span class="${prefixCls}-picture-name" title=${file.name}>${file.name}</span>
      </div>
    `;
  }

  render() {
    const files = this._currentFiles;
    const cls = handleClsList([
      prefixCls,
      this.drag ? `${prefixCls}-drag` : '',
      this.listType === 'picture' ? `${prefixCls}-picture` : '',
      this.disabled ? `${prefixCls}-disabled` : '',
    ]);

    return html`
      <div class="${cls}" part="upload">
        <input
          class="${prefixCls}-input"
          type="file"
          ?multiple=${this.multiple}
          accept=${this.accept ?? nothing}
          ?disabled=${this.disabled}
          @change=${this._handleInput}
        />
        ${this.listType === 'picture'
          ? html`
              ${this.drag
                ? html`<div
                    class="${prefixCls}-dragger ${this._dragging ? `${prefixCls}-dragger-active` : ''}"
                    role="button"
                    tabindex="0"
                    aria-disabled=${this.disabled ? 'true' : 'false'}
                    @click=${this._open}
                    @dragover=${(event: DragEvent) => {
                      event.preventDefault();
                      if (!this.disabled) this._dragging = true;
                    }}
                    @dragleave=${() => (this._dragging = false)}
                    @drop=${this._handleDrop}
                  >
                    <span class="${prefixCls}-dragger-icon"><semi-icon-plus></semi-icon-plus></span>
                    <span class="${prefixCls}-dragger-text">${this.buttonText}</span>
                    <span class="${prefixCls}-dragger-tip">${this.tip}</span>
                  </div>`
                : nothing}
              <div class="${prefixCls}-picture-list">
                ${this.showFileList ? files.map((file) => this._renderPictureCard(file)) : nothing}
                ${!this.drag && this._canAdd
                  ? html`<div
                      class="${prefixCls}-picture-trigger"
                      role="button"
                      tabindex="0"
                      @click=${this._open}
                      @keydown=${(event: KeyboardEvent) => {
                        if (event.key === 'Enter' || event.key === ' ') this._open();
                      }}
                    >
                      <semi-icon-plus></semi-icon-plus>
                      <span>${this.buttonText}</span>
                    </div>`
                  : nothing}
              </div>
            `
          : html`
              ${this.drag
                ? html`
                    <div
                      class="${prefixCls}-dragger ${this._dragging ? `${prefixCls}-dragger-active` : ''}"
                      role="button"
                      tabindex="0"
                      aria-disabled=${this.disabled ? 'true' : 'false'}
                      @click=${this._open}
                      @keydown=${(event: KeyboardEvent) => {
                        if (event.key === 'Enter' || event.key === ' ') this._open();
                      }}
                      @dragover=${(event: DragEvent) => {
                        event.preventDefault();
                        if (!this.disabled) this._dragging = true;
                      }}
                      @dragleave=${() => (this._dragging = false)}
                      @drop=${this._handleDrop}
                    >
                      <span class="${prefixCls}-dragger-icon"><semi-icon-plus></semi-icon-plus></span>
                      <span class="${prefixCls}-dragger-text">${this.buttonText}</span>
                      <span class="${prefixCls}-dragger-tip">${this.tip}</span>
                    </div>
                  `
                : html`
                    <button
                      class="${prefixCls}-trigger"
                      type="button"
                      ?disabled=${!this._canAdd}
                      @click=${this._open}
                    ><semi-icon-plus></semi-icon-plus><span>${this.buttonText}</span></button>
                  `}
              ${this.showFileList && files.length
                ? html`<ul class="${prefixCls}-list">${files.map((file) => this._renderFile(file))}</ul>`
                : nothing}
            `}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .${p}-input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    }

    .${p}-trigger {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 16px;
      color: var(--semi-color-white);
      font-family: inherit;
      font-size: 14px;
      background-color: var(--semi-color-primary);
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    .${p}-trigger:hover {
      background-color: var(--semi-color-primary-hover);
    }

    .${p}-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 32px 16px;
      color: var(--semi-color-text-2);
      text-align: center;
      background-color: var(--semi-color-fill-0);
      border: 1px dashed var(--semi-color-border);
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .${p}-dragger:hover,
    .${p}-dragger-active {
      background-color: var(--semi-color-primary-light-default);
      border-color: var(--semi-color-primary);
    }

    .${p}-dragger-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-bottom: 8px;
      color: var(--semi-color-primary);
      font-size: 20px;
      background-color: var(--semi-color-bg-2);
      border-radius: 50%;
    }

    .${p}-dragger-text {
      color: var(--semi-color-text-0);
      font-size: 14px;
    }

    .${p}-dragger-tip {
      margin-top: 4px;
      color: var(--semi-color-text-3);
      font-size: 12px;
    }

    .${p}-list {
      margin: 12px 0 0;
      padding: 0;
      list-style: none;
    }

    .${p}-file {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      margin-bottom: 4px;
      padding: 0 8px;
      color: var(--semi-color-text-0);
      font-size: 13px;
      background-color: var(--semi-color-fill-0);
      border-radius: 3px;
    }

    .${p}-file-icon {
      display: inline-flex;
      flex-shrink: 0;
      color: var(--semi-color-success);
    }

    .${p}-file-error .${p}-file-icon {
      color: var(--semi-color-danger);
    }

    .${p}-file-uploading .${p}-file-icon {
      color: var(--semi-color-primary);
    }

    .${p}-file-dot {
      width: 8px;
      height: 8px;
      background-color: var(--semi-color-text-3);
      border-radius: 50%;
    }

    .${p}-file-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${p}-file-size {
      flex-shrink: 0;
      color: var(--semi-color-text-3);
      font-size: 12px;
    }

    .${p}-file-remove {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      color: var(--semi-color-text-3);
      font-size: 12px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .${p}-file-remove:hover {
      color: var(--semi-color-text-0);
    }

    .${p}-progress {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      overflow: hidden;
      background-color: var(--semi-color-fill-1);
      border-radius: 1px;
    }

    .${p}-progress span {
      display: block;
      height: 100%;
      background-color: var(--semi-color-primary);
      transition: width 0.2s ease;
    }

    .${p}-picture-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .${p}-picture-card,
    .${p}-picture-trigger {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 104px;
      height: 104px;
      overflow: hidden;
      background-color: var(--semi-color-fill-0);
      border: 1px solid var(--semi-color-border);
      border-radius: 6px;
    }

    .${p}-picture-trigger {
      flex-direction: column;
      gap: 4px;
      color: var(--semi-color-text-2);
      font-size: 12px;
      background-color: transparent;
      border-style: dashed;
      cursor: pointer;
    }

    .${p}-picture-trigger:hover {
      color: var(--semi-color-primary);
      border-color: var(--semi-color-primary);
    }

    .${p}-picture-card:hover .${p}-picture-actions {
      opacity: 1;
    }

    .${p}-picture-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .${p}-picture-placeholder {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--semi-color-text-3);
      font-size: 24px;
    }

    .${p}-picture-actions {
      position: absolute;
      top: 4px;
      right: 4px;
      opacity: 0.85;
      transition: opacity 0.2s ease;
    }

    .${p}-picture-actions .${p}-file-remove {
      color: var(--semi-color-text-0);
      background-color: var(--semi-color-bg-2);
      border-radius: 50%;
    }

    .${p}-picture-name {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      padding: 4px 6px;
      color: var(--semi-color-white);
      font-size: 11px;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: rgba(0, 0, 0, 0.45);
    }

    .${p}-picture .${p}-progress {
      bottom: 24px;
    }

    .${p}-disabled .${p}-trigger,
    .${p}-disabled .${p}-dragger {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'semi-upload': SemiUpload
  }
}
