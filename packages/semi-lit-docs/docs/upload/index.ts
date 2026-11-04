import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../components/code-content/index';

function section(title: string, description: string, demo: unknown, code: string) {
  return html`
    <section class="doc-section">
      <h2>${title}</h2>
      <p>${description}</p>
      <div class="demo-block">
        <div class="demo-preview"><code-demo>${demo}</code-demo></div>
        <div class="demo-code"><code-content inline .code=${code}></code-content></div>
      </div>
    </section>
  `;
}

@customElement('upload-docs')
class UploadDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  protected render() {
    return html`
      <h1>上传</h1>
      <p>Upload 选择本地文件并展示待上传列表，支持多选、拖拽、数量限制与自定义上传。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/input/upload" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '点击选择文件，默认仅在本地展示文件；通过 customRequest 接入真实上传。',
        html`
          <semi-upload multiple .limit=${3}></semi-upload>
        `,
        `<semi-upload multiple .limit=\${3}></semi-upload>`
      )}

      ${section(
        '拖拽上传',
        '设置 drag 使用拖拽区域，支持通过 drag 或点击选择。',
        html`
          <semi-upload
            drag
            multiple
            accept="image/*"
            tip="支持图片格式，单个或批量上传"
          ></semi-upload>
        `,
        `<semi-upload drag multiple accept="image/*"
  tip="支持图片格式，单个或批量上传"></semi-upload>`
      )}

      ${section(
        '图片卡片',
        'list-type="picture" 以卡片形式展示图片缩略图。',
        html`
          <semi-upload
            list-type="picture"
            multiple
            accept="image/*"
            .limit=${3}
          ></semi-upload>
        `,
        `<semi-upload list-type="picture" multiple accept="image/*"
  .limit=\${3}></semi-upload>`
      )}

      ${section(
        '禁用与初始列表',
        'disabled 禁用选择与删除，default-file-list 展示已有文件。',
        html`
          <semi-upload
            disabled
            .defaultFileList=${[
              { uid: '1', name: 'design-spec.pdf', size: 204800, status: 'success' },
              { uid: '2', name: 'cover.png', size: 102400, status: 'success' },
            ]}
          ></semi-upload>
        `,
        `<semi-upload disabled .defaultFileList=\${fileList}></semi-upload>`
      )}

      <semi-divider></semi-divider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'upload-docs': UploadDocs
  }
}
