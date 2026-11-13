import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ScrollListItemData, ScrollListSelectDetail } from '@semi-ui';
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

const cities: ScrollListItemData[] = [
  { value: 'beijing', text: '北京' },
  { value: 'shanghai', text: '上海' },
  { value: 'guangzhou', text: '广州' },
  { value: 'shenzhen', text: '深圳' },
  { value: 'hangzhou', text: '杭州' },
  { value: 'chengdu', text: '成都' },
  { value: 'wuhan', text: '武汉' },
  { value: 'nanjing', text: '南京' },
  { value: 'xian', text: '西安' },
  { value: 'chongqing', text: '重庆' },
];

const years: ScrollListItemData[] = Array.from({ length: 8 }, (_, index) => ({
  value: 2020 + index,
  text: `${2020 + index} 年`,
}));

const months: ScrollListItemData[] = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  text: `${index + 1} 月`,
}));

const hours: ScrollListItemData[] = Array.from({ length: 24 }, (_, index) => ({
  value: index,
  text: `${String(index).padStart(2, '0')} 时`,
}));

const minutes: ScrollListItemData[] = Array.from({ length: 12 }, (_, index) => ({
  value: index * 5,
  text: `${String(index * 5).padStart(2, '0')} 分`,
}));

const disabledItems: ScrollListItemData[] = [
  { value: 'standard', text: '标准版' },
  { value: 'pro', text: '专业版', disabled: true },
  { value: 'team', text: '团队版' },
  { value: 'enterprise', text: '企业版' },
];

@customElement('scroll-list-docs')
class ScrollListDocs extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  @state()
  private _cityIndex = 2;

  @state()
  private _city = cities[2];

  @state()
  private _yearIndex = 4;

  @state()
  private _monthIndex = 7;

  @state()
  private _hourIndex = 9;

  @state()
  private _minuteIndex = 6;

  @state()
  private _planIndex = 0;

  @state()
  private _headerPlan = '标准版';

  private _onCity(event: CustomEvent<ScrollListSelectDetail>) {
    this._cityIndex = event.detail.index;
    this._city = event.detail.item;
  }

  private _onPlan(event: CustomEvent<ScrollListSelectDetail>) {
    this._planIndex = event.detail.index;
    this._headerPlan = String(event.detail.item.text ?? event.detail.item.value);
  }

  protected render() {
    return html`
      <h1>滚动列表</h1>
      <p>滚动列表用于展示单列或多列的可滚动选项，支持普通列表与滚轮选择两种模式。</p>
      <p>
        <semi-link href="https://semi.design/zh-CN/show/scrollList" target="_blank">查看 Semi Design 官方文档</semi-link>
      </p>
      <semi-divider></semi-divider>

      ${section(
        '基本用法',
        '在 semi-scroll-list 中放置 semi-scroll-list-item，selected-index 控制选中项，select 事件返回选项与索引。',
        html`
          <div style="display: flex; gap: 20px; align-items: flex-start">
            <semi-scroll-list body-height="240" style="width: 200px">
              <semi-scroll-list-item
                .items=${cities}
                .selectedIndex=${this._cityIndex}
                item-height="36"
                @select=${this._onCity}
              ></semi-scroll-list-item>
            </semi-scroll-list>
            <p style="color: var(--semi-color-text-2)">
              当前选择：<strong style="color: var(--semi-color-text-0)">${this._city.text}</strong>
            </p>
          </div>
        `,
        `<semi-scroll-list body-height="240">
  <semi-scroll-list-item .items=\${cities} .selectedIndex=\${index}></semi-scroll-list-item>
</semi-scroll-list>`
      )}

      ${section(
        '多列选择',
        '多个 semi-scroll-list-item 会并排展示并共享同一高度，适合年月、时间等组合选择。',
        html`
          <div style="display: flex; gap: 20px; align-items: flex-start">
            <semi-scroll-list body-height="240" style="width: 300px">
              <semi-scroll-list-item
                .items=${years}
                .selectedIndex=${this._yearIndex}
                @select=${(event: CustomEvent<ScrollListSelectDetail>) => (this._yearIndex = event.detail.index)}
              ></semi-scroll-list-item>
              <semi-scroll-list-item
                .items=${months}
                .selectedIndex=${this._monthIndex}
                @select=${(event: CustomEvent<ScrollListSelectDetail>) => (this._monthIndex = event.detail.index)}
              ></semi-scroll-list-item>
            </semi-scroll-list>
            <p style="color: var(--semi-color-text-2)">
              当前选择：<strong style="color: var(--semi-color-text-0)">
                ${years[this._yearIndex].text} ${months[this._monthIndex].text}
              </strong>
            </p>
          </div>
        `,
        `<semi-scroll-list body-height="240">
  <semi-scroll-list-item .items=\${years} .selectedIndex=\${year}></semi-scroll-list-item>
  <semi-scroll-list-item .items=\${months} .selectedIndex=\${month}></semi-scroll-list-item>
</semi-scroll-list>`
      )}

      ${section(
        '滚轮模式',
        'mode="wheel" 显示中央选择框与上下遮罩，滚动停止后会吸附到最近的选项。',
        html`
          <div style="display: flex; gap: 20px; align-items: flex-start">
            <semi-scroll-list body-height="240" style="width: 260px">
              <semi-scroll-list-item
                mode="wheel"
                .items=${hours}
                .selectedIndex=${this._hourIndex}
                @select=${(event: CustomEvent<ScrollListSelectDetail>) => (this._hourIndex = event.detail.index)}
              ></semi-scroll-list-item>
              <semi-scroll-list-item
                mode="wheel"
                .items=${minutes}
                .selectedIndex=${this._minuteIndex}
                @select=${(event: CustomEvent<ScrollListSelectDetail>) => (this._minuteIndex = event.detail.index)}
              ></semi-scroll-list-item>
            </semi-scroll-list>
            <p style="color: var(--semi-color-text-2)">
              当前时间：<strong style="color: var(--semi-color-text-0)">
                ${hours[this._hourIndex].text} ${minutes[this._minuteIndex].text}
              </strong>
            </p>
          </div>
        `,
        `<semi-scroll-list-item mode="wheel" .items=\${hours} .selectedIndex=\${hour}></semi-scroll-list-item>`
      )}

      ${section(
        '禁用项',
        '选项对象的 disabled 为 true 时不可点击，也不参与滚轮吸附后的选择。',
        html`
          <div style="display: flex; gap: 20px; align-items: flex-start">
            <semi-scroll-list body-height="220" style="width: 200px">
              <semi-scroll-list-item
                .items=${disabledItems}
                .selectedIndex=${this._planIndex}
                @select=${this._onPlan}
              ></semi-scroll-list-item>
            </semi-scroll-list>
            <p style="color: var(--semi-color-text-2)">
              当前版本：<strong style="color: var(--semi-color-text-0)">${this._headerPlan}</strong>
            </p>
          </div>
        `,
        `<semi-scroll-list-item .items=\${items} .selectedIndex=\${index}></semi-scroll-list-item>`
      )}

      ${section(
        '头部与底部',
        'header 与 footer 为列表增加标题、说明和操作区域。',
        html`
          <semi-scroll-list
            body-height="200"
            style="width: 260px"
            .header=${'选择版本'}
            .footer=${html`<span style="color: var(--semi-color-text-2)">共 ${disabledItems.length} 个版本</span>`}
          >
            <semi-scroll-list-item
              .items=${disabledItems}
              .selectedIndex=${this._planIndex}
              @select=${this._onPlan}
            ></semi-scroll-list-item>
          </semi-scroll-list>
        `,
        `<semi-scroll-list body-height="200" .header=\${'选择版本'} .footer=\${footer}>
  <semi-scroll-list-item .items=\${items}></semi-scroll-list-item>
</semi-scroll-list>`
      )}
    `;
  }
}
