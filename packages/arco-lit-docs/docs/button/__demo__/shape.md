```html
<a-space>
  <a-button type="primary">Square</a-button>
  <a-button type="primary" shape="round">Round</a-button>
  <a-button type="primary" .slots="${{ icon: html`<icon-plus></icon-plus>` }}"></a-button>
  <a-button type="primary" shape="circle" .slots="${{ icon: html`<icon-plus></icon-plus>` }}"></a-button>
</a-space>
```