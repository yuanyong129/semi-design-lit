import { expect, test } from '@playwright/test';

test.describe('Semi Design Lit docs', () => {
  test('renders the official-style Button page', async ({ page }) => {
    await page.goto('/basic/button');

    await expect(page.getByRole('heading', { level: 1, name: '按钮' })).toBeVisible();
    await expect(
      page.locator('.sidebar .sidebar-item').filter({ hasText: 'Button 按钮' })
    ).toHaveClass(/active/);
  });

  test('accepts input and updates its value', async ({ page }) => {
    await page.goto('/input/input');

    const input = page.locator('semi-input').first().locator('input');
    await input.fill('Semi Design');
    await expect(input).toHaveValue('Semi Design');
  });

  test('switches LocaleProvider language', async ({ page }) => {
    await page.goto('/other/locale-provider');

    const firstEmpty = page.locator('locale-provider-docs semi-empty').first();
    await expect(firstEmpty.locator('.semi-empty-description')).toHaveText('暂无数据');

    await page.getByText('English', { exact: true }).click();
    await expect(firstEmpty.locator('.semi-empty-description')).toHaveText('No Data');
  });

  test('validates a required Form field', async ({ page }) => {
    await page.goto('/input/form');

    await page.getByRole('button', { name: '提交' }).click();
    await expect(page.locator('.semi-form-item-message').first()).toHaveText('请输入用户名');
  });

  test('opens and closes a Trigger popup', async ({ page }) => {
    await page.goto('/other/trigger');

    await page.locator('.demo-preview').getByRole('button', { name: '点击触发' }).click();
    const popup = page.locator('semi-trigger').filter({ hasText: '点击触发' }).locator('semi-popup .semi-popup');
    await expect(popup).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popup).toBeHidden();
  });

  test('shows a Tooltip on hover', async ({ page }) => {
    await page.goto('/show/tooltip');

    await page.locator('.demo-preview').getByRole('button', { name: '悬浮查看' }).hover();
    const popup = page.locator('semi-tooltip').filter({ hasText: '悬浮查看' }).locator('semi-popup .semi-popup');
    await expect(popup).toBeVisible();
  });

  test('opens a Popover and a Popconfirm', async ({ page }) => {
    await page.goto('/show/popover');

    await page.locator('.demo-preview').getByRole('button', { name: '点击查看' }).click();
    const popover = page.locator('semi-popover').filter({ hasText: '点击查看' });
    await expect(popover.locator('semi-popup')).toContainText('Semi Design 是由抖音前端团队');

    await page.goto('/show/popconfirm');
    await page.locator('.demo-preview').getByRole('button', { name: '删除' }).click();
    const popconfirm = page.locator('semi-popconfirm').filter({ hasText: '删除' });
    await expect(popconfirm.locator('semi-popup')).toContainText('删除确认');

    await page.locator('semi-button').filter({ hasText: '确定' }).locator('button').click();
    await expect(popconfirm.locator('semi-popup')).toBeHidden();
    await expect(page.locator('popconfirm-docs .demo-preview').first().locator('semi-tag')).toHaveText('已确认');
  });

  test('selects a Dropdown option', async ({ page }) => {
    await page.goto('/show/dropdown');

    const dropdown = page.locator('semi-dropdown').filter({ hasText: '更多操作' });
    await dropdown.getByRole('button', { name: '更多操作' }).click();
    await dropdown.locator('.semi-dropdown-item').filter({ hasText: '复制' }).click();

    await expect(page.locator('dropdown-docs .demo-preview').first().locator('semi-tag')).toHaveText('copy');
  });

  test('opens and closes Modal / SideSheet', async ({ page }) => {
    await page.goto('/show/modal');
    await page.locator('.demo-preview').getByRole('button', { name: '打开对话框' }).click();

    const modal = page.locator('.semi-modal').first();
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('对话框标题');

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    await page.goto('/show/side-sheet');
    await page.locator('.demo-preview').getByRole('button', { name: '右侧打开' }).click();

    const sheet = page.locator('.semi-side-sheet').first();
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveClass(/semi-side-sheet-right/);

    await sheet.locator('button[aria-label="Close"]').click();
    await expect(sheet).toBeHidden();
  });

  test('shows Toast and Notification messages', async ({ page }) => {
    await page.goto('/show/toast');
    await page.locator('.demo-preview').getByRole('button', { name: '成功' }).click();
    await expect(page.locator('.semi-toast').first()).toContainText('保存成功');

    await page.goto('/show/notification');
    await page.locator('.demo-preview').getByRole('button', { name: '成功' }).click();
    const notification = page.locator('.semi-notification').first();
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('发布成功');

    await notification.locator('button[aria-label="Close"]').click();
    await expect(notification).toBeHidden();
  });

  test('renders Progress, Skeleton and Banner', async ({ page }) => {
    await page.goto('/show/progress');
    await expect(page.locator('.semi-progress-info').first()).toHaveText('30%');

    await page.goto('/show/skeleton');
    await page.locator('.demo-preview').getByRole('button', { name: '显示内容' }).click();
    await expect(page.getByText('这是加载完成后的内容。')).toBeVisible();

    await page.goto('/show/banner');
    const banner = page.locator('semi-banner[closable]');
    await banner.locator('.semi-banner-close').click();
    await expect(banner.locator('.semi-banner')).toBeHidden();
  });

  test('selects a Select option and renders a Table', async ({ page }) => {
    await page.goto('/input/select');
    await page.locator('semi-select .semi-select-selector').first().click();
    await page.locator('.semi-select-option').filter({ hasText: 'Arco Design' }).first().click();
    await expect(page.locator('semi-select .semi-select-value').first()).toHaveText('Arco Design');

    await page.goto('/show/table');
    const table = page.locator('.semi-table').first();
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await expect(table).toContainText('Semi Design Lit');
    await expect(page.locator('.semi-table').last()).toContainText('还没有数据');
  });

  test('sorts, paginates and selects Table rows', async ({ page }) => {
    await page.goto('/show/table');
    const tableHost = page.locator('semi-table').nth(1);
    const table = tableHost.locator('.semi-table');

    await table.locator('thead th').filter({ hasText: '名称' }).click();
    await expect(table.locator('tbody tr').first()).toContainText('Legacy Theme');

    await tableHost.locator('semi-pagination .semi-pagination-next').click();
    await expect(table.locator('tbody tr')).toHaveCount(1);

    await page.reload();
    await table.locator('tbody input').first().click();
    await expect(page.locator('table-docs')).toContainText('已选：1');

    await tableHost.locator('.semi-table-filter-button').click();
    await page.locator('.semi-table-filter-option').filter({ hasText: '已归档' }).locator('input').click();
    await expect(table.locator('tbody tr')).toHaveCount(1);
    await expect(table).toContainText('Legacy Theme');
  });

  test('expands a Table row', async ({ page }) => {
    await page.goto('/show/table');
    const table = page.locator('semi-table').nth(3);
    await table.locator('.semi-table-expand-button').first().click();
    await expect(table.locator('.semi-table-expanded-row')).toContainText('设计系统');

    await table.locator('.semi-table-expand-button').first().click();
    await expect(table.locator('.semi-table-expanded-row')).toHaveCount(0);
  });

  test('picks a DatePicker date and changes Pagination page', async ({ page }) => {
    await page.goto('/pagination');
    await expect(page).toHaveURL(/\/show\/pagination$/);
    await expect(page.locator('h1')).toHaveText('分页器');

    await page.goto('/input/date-picker');
    await page.locator('semi-date-picker .semi-date-picker-selector').first().click();
    await expect(page.locator('.semi-date-picker-panel:visible')).toBeVisible();

    await page.locator('.semi-date-picker-panel:visible .semi-date-picker-panel-day').filter({ hasText: '15' }).first().click();
    await expect(page.locator('date-picker-docs semi-tag').first()).toHaveText('2026-10-15');

    await page.goto('/show/pagination');
    await page.locator('.semi-pagination-item').filter({ hasText: '2' }).first().click();
    await expect(page.locator('.semi-pagination-item-active').first()).toHaveText('2');
  });

  test('switches Tabs and expands Tree nodes', async ({ page }) => {
    await page.goto('/show/tabs');
    const tabs = page.locator('tabs-docs semi-tabs').first();
    await tabs.getByRole('tab', { name: '开发' }).click();
    await expect(tabs.locator('.semi-tabs-content')).toContainText('Web Components');

    const closable = page.locator('tabs-docs semi-tabs').nth(3);
    await closable.locator('.semi-tabs-tab-close').first().click();
    await expect(page.locator('tabs-docs')).toContainText('最近关闭：design');

    const positioned = page.locator('tabs-docs semi-tabs').nth(4);
    await expect(positioned.locator('.semi-tabs')).toHaveClass(/semi-tabs-position-left/);

    await page.goto('/show/tree');
    const tree = page.locator('tree-docs semi-tree').first();
    await tree.locator('.semi-tree-label').filter({ hasText: 'Semi Design' }).click();
    await expect(tree.locator('.semi-tree-node-selected')).toContainText('Semi Design');

    await tree.locator('.semi-tree-switcher').first().click();
    await expect(tree.locator('.semi-tree-label').filter({ hasText: 'Semi Design' })).toHaveCount(0);

    await page.reload();
    const checkTree = page.locator('tree-docs semi-tree').nth(2);
    await checkTree.locator('.semi-tree-checkbox').first().click();
    await expect(page.locator('tree-docs semi-tag').filter({ hasText: '已勾选' })).toContainText('design');
  });

  test('drags Tree nodes and loads children asynchronously', async ({ page }) => {
    await page.goto('/show/tree');
    const dragTree = page.locator('tree-docs semi-tree').nth(3);
    await dragTree.locator('.semi-tree-node[data-key="semi"]').dragTo(
      dragTree.locator('.semi-tree-node[data-key="components"]')
    );
    await expect(page.locator('tree-docs semi-tag').filter({ hasText: 'Semi Design → 组件' })).toHaveCount(1);

    const asyncTree = page.locator('tree-docs semi-tree').nth(4);
    await asyncTree.locator('.semi-tree-switcher').first().click();
    await expect(asyncTree.locator('.semi-tree-loading')).toHaveCount(1);
    await expect(asyncTree.locator('.semi-tree-label').filter({ hasText: 'Semi Design' })).toHaveCount(1, {
      timeout: 3000,
    });
  });

  test('uploads and removes a local file', async ({ page }) => {
    await page.goto('/input/upload');
    const upload = page.locator('upload-docs semi-upload').first();
    await upload.locator('input[type="file"]').setInputFiles({
      name: 'hello.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(upload.locator('.semi-upload-file-name')).toHaveText('hello.txt');

    await upload.locator('.semi-upload-file-remove').click();
    await expect(upload.locator('.semi-upload-file')).toHaveCount(0);
  });

  test('uploads an image in picture mode', async ({ page }) => {
    await page.goto('/input/upload');
    const upload = page.locator('upload-docs semi-upload[list-type="picture"]');
    await upload.locator('input[type="file"]').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64'
      ),
    });
    await expect(upload.locator('.semi-upload-picture-card')).toHaveCount(1);
    await expect(upload.locator('.semi-upload-picture-image')).toBeVisible();

    await upload.locator('.semi-upload-picture-card .semi-upload-file-remove').click();
    await expect(upload.locator('.semi-upload-picture-card')).toHaveCount(0);
  });

  test('moves an item in Transfer', async ({ page }) => {
    await page.goto('/input/transfer');
    const transfer = page.locator('transfer-docs semi-transfer').first();

    await transfer.locator('.semi-transfer-panel').first().locator('.semi-transfer-item input').first().click();
    await transfer.locator('button[aria-label="Move right"]').first().click();

    await expect(transfer.locator('.semi-transfer-panel').nth(1)).toContainText('Ant Design');
    await expect(page.locator('transfer-docs semi-tag')).toContainText('antd');
  });

  test('selects a Calendar date and switches month', async ({ page }) => {
    await page.goto('/show/calendar');
    const calendar = page.locator('calendar-docs semi-calendar').first();
    await expect(calendar.locator('.semi-calendar-month')).toHaveText('2026 年 11 月');

    await calendar.locator('[aria-label="2026-11-20"]').click();
    await expect(page.locator('calendar-docs semi-tag')).toHaveText('当前日期：2026-11-20');

    await calendar.locator('[aria-label="Next month"]').click();
    await expect(calendar.locator('.semi-calendar-month')).toHaveText('2026 年 12 月');
  });

  test('renders Card content and toggles loading', async ({ page }) => {
    await page.goto('/show/card');
    const card = page.locator('card-docs semi-card').first();

    await expect(card.locator('.semi-card-header-title')).toHaveText('设计系统');
    await expect(card).toContainText('设计系统是组件库的基础');

    const loadingSection = page.locator('card-docs .doc-section').nth(4);
    await loadingSection.scrollIntoViewIfNeeded();
    await loadingSection.getByRole('button', { name: '切换加载' }).click();
    await expect(loadingSection.locator('.semi-card-body semi-skeleton')).toBeVisible();
  });

  test('renders Avatar images and fallback content', async ({ page }) => {
    await page.goto('/show/avatar');

    const imageAvatar = page.locator('avatar-docs semi-avatar[alt="Semi Design"]').first();
    await expect(imageAvatar.locator('img.semi-avatar-image')).toBeVisible();

    const fallback = page.locator('avatar-docs semi-avatar[alt="Fallback"]');
    await expect(fallback).toContainText('S');
    await expect(fallback.locator('slot')).toHaveCount(1);
    await expect(fallback.locator('img.semi-avatar-image')).toHaveCount(0);
  });

  test('shows Badge counts and status text', async ({ page }) => {
    await page.goto('/show/badge');

    const overflow = page.locator('badge-docs semi-badge[count="120"]').first();
    await expect(overflow.locator('.semi-badge-count')).toHaveText('99+');

    const status = page.locator('badge-docs semi-badge[status="success"]').first();
    await expect(status.locator('.semi-badge-status')).toContainText('运行成功');
  });

  test('renders Breadcrumb trails and separators', async ({ page }) => {
    await page.goto('/navigation/breadcrumb');

    const breadcrumb = page.locator('breadcrumb-docs semi-breadcrumb').first();
    const items = breadcrumb.locator('semi-breadcrumb-item');
    await expect(breadcrumb.locator('nav')).toHaveAttribute('aria-label', 'Breadcrumb');
    await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toContainText('面包屑');
    await expect(items.nth(2).locator('[aria-current="page"]')).toHaveCount(1);

    const compact = page.locator('breadcrumb-docs semi-breadcrumb[compact]').first();
    await expect(compact.locator('nav')).toHaveClass(/semi-breadcrumb-compact/);
  });

  test('switches Steps by clicking a step', async ({ page }) => {
    await page.goto('/navigation/steps');

    const basic = page.locator('steps-docs semi-steps').first();
    await expect(basic.locator('.semi-step-finish')).toHaveCount(1);
    await expect(basic.locator('.semi-step-process')).toHaveCount(1);

    await basic.locator('semi-step').nth(2).locator('.semi-step').click();
    await expect(page.locator('steps-docs .doc-section').first()).toContainText('当前步骤：3');
    await expect(basic.locator('.semi-step-finish')).toHaveCount(2);
  });

  test('expands Collapse panels and switches accordion', async ({ page }) => {
    await page.goto('/show/collapse');

    const basic = page.locator('collapse-docs semi-collapse').first();
    const panels = basic.locator('semi-collapse-panel');
    await expect(panels.nth(0).locator('.semi-collapse-panel-active')).toBeVisible();
    await expect(panels.nth(0)).toContainText('统一、清晰、可预期');

    await panels.nth(1).locator('.semi-collapse-header').click();
    await expect(panels.nth(1).locator('.semi-collapse-panel-active')).toBeVisible();
    await expect(panels.nth(1)).toContainText('通过语义化变量组织颜色');

    const accordion = page.locator('collapse-docs semi-collapse[accordion]');
    const accordionPanels = accordion.locator('semi-collapse-panel');
    await accordionPanels.nth(1).locator('.semi-collapse-header').click();
    await expect(accordionPanels.nth(0).locator('.semi-collapse-panel-active')).toHaveCount(0);
    await expect(accordionPanels.nth(1).locator('.semi-collapse-panel-active')).toBeVisible();
  });

  test('renders Descriptions label/value pairs and spanned cells', async ({ page }) => {
    await page.goto('/show/descriptions');

    const basic = page.locator('descriptions-docs semi-descriptions').first();
    await expect(basic.locator('semi-descriptions-item')).toHaveCount(4);
    await expect(basic.locator('semi-descriptions-item').first().locator('.semi-descriptions-label')).toHaveText('姓名');
    await expect(basic).toContainText('交互设计师');

    const bordered = page.locator('descriptions-docs semi-descriptions[bordered]').first();
    await expect(bordered.locator('.semi-descriptions-bordered')).toBeVisible();
    const spanned = bordered.locator('semi-descriptions-item').filter({ hasText: '项目地址' });
    await expect(spanned).toHaveCount(1);
    expect(await spanned.evaluate((element) => getComputedStyle(element).gridColumn)).toContain('span 2');
  });

  test('renders List content, empty state and loading state', async ({ page }) => {
    await page.goto('/show/list');

    const basic = page.locator('list-docs semi-list').first();
    await expect(basic.locator('semi-list-item')).toHaveCount(3);
    await expect(basic).toContainText('同步本周组件进展');
    await expect(basic).toContainText('2 天前');
    await expect(basic.locator('semi-link')).toHaveCount(3);

    const emptyList = page.locator('list-docs semi-list[empty-text]');
    await expect(emptyList.locator('semi-empty')).toBeVisible();
    await expect(emptyList).toContainText('暂无待办事项');

    const loadingSection = page.locator('list-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '加载状态' }),
    });
    const loadingList = loadingSection.locator('semi-list').first();
    await expect(loadingSection.locator('semi-skeleton')).toHaveCount(3);
    await loadingSection.getByRole('button', { name: '切换加载' }).click();
    await expect(loadingSection.locator('semi-skeleton')).toHaveCount(0);
    await expect(loadingList).toContainText('内容加载中');
  });

  test('renders Timeline alternatives, colors and reverse order', async ({ page }) => {
    await page.goto('/show/timeline');

    const basic = page.locator('timeline-docs semi-timeline').first();
    await expect(basic.locator('semi-timeline-item')).toHaveCount(4);
    await expect(basic).toContainText('提交需求评审');

    const alternate = page.locator('timeline-docs semi-timeline[mode="alternate"]');
    await expect(alternate.locator('.semi-timeline-item-left')).toHaveCount(2);
    await expect(alternate.locator('.semi-timeline-item-right')).toHaveCount(2);

    const colored = page.locator('timeline-docs semi-timeline-item[color="green"]').first();
    await expect(colored.locator('.semi-timeline-dot')).toHaveCSS('background-color', 'rgb(59, 179, 70)');

    const custom = page.locator('timeline-docs semi-timeline-item').filter({ hasText: '创建发布计划' });
    await expect(custom.locator('.timeline-star')).toHaveText('★');

    const reverse = page.locator('timeline-docs semi-timeline[reverse]');
    await expect(reverse.locator('semi-timeline-item').first()).toHaveCSS('order', '2');
  });

  test('lays out Grid columns and responsive spans', async ({ page }) => {
    await page.goto('/layout/grid');

    const basic = page.locator('grid-docs semi-row').first();
    const columns = basic.locator('semi-col');
    await expect(columns).toHaveCount(4);
    await expect(columns.first()).toHaveClass(/semi-col-6/);
    expect(await basic.locator('.semi-row').evaluate((element) => element.style.getPropertyValue('--semi-grid-gutter-x'))).toBe('16px');

    const widths = await columns.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().width)
    );
    expect(widths.every((width) => width > 100)).toBe(true);

    const offsetRow = page.locator('grid-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '偏移与排序' }),
    });
    await expect(offsetRow.locator('semi-col[offset="8"]')).toHaveClass(/semi-col-offset-8/);

    await page.setViewportSize({ width: 500, height: 900 });
    const responsive = page.locator('grid-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '响应式' }),
    });
    const firstResponsive = responsive.locator('semi-col').first();
    expect(await firstResponsive.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  });

  test('collapses a controlled Layout sider', async ({ page }) => {
    await page.goto('/layout/layout');

    const section = page.locator('layout-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '受控收起' }),
    });
    const sider = section.locator('semi-layout-sider').first();
    const aside = sider.locator('aside');
    await expect(aside).toHaveCSS('width', '200px');

    await section.getByRole('button', { name: '收起侧边栏' }).click();
    await expect(aside).toHaveCSS('width', '64px');
    await expect(section.locator('semi-tag').first()).toHaveText('64px');

    await section.getByRole('button', { name: '展开侧边栏' }).click();
    await expect(aside).toHaveCSS('width', '200px');
  });

  test('previews an Image and handles load failures', async ({ page }) => {
    await page.goto('/show/image');

    const image = page.locator('image-docs semi-image').first();
    await image.locator('.semi-image').click();
    const preview = image.locator('.semi-image-preview');
    await expect(preview).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await preview.getByRole('button', { name: '放大' }).click();
    await expect(preview.locator('.semi-image-preview-scale')).toHaveText('125%');

    await page.keyboard.press('Escape');
    await expect(preview).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

    const failureSection = page.locator('image-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '加载失败' }),
    });
    const failed = failureSection.locator('semi-image').nth(1);
    await expect(failed.locator('.semi-image-fallback')).toContainText('图片加载失败');
    await expect(failed.locator('.semi-image-img')).toHaveCount(0);
  });

  test('navigates Carousel slides and indicators', async ({ page }) => {
    await page.goto('/show/carousel');

    const basic = page.locator('carousel-docs semi-carousel').first();
    const slides = basic.locator('.semi-carousel-item');
    await expect(slides).toHaveCount(3);
    await expect(slides.first()).toHaveClass(/semi-carousel-item-active/);
    await expect(basic.locator('.semi-carousel-indicator')).toHaveCount(3);

    await basic.getByRole('button', { name: '下一张' }).click();
    await expect(slides.nth(1)).toHaveClass(/semi-carousel-item-active/);
    await expect(basic.locator('.semi-carousel-indicator').nth(1)).toHaveAttribute('aria-selected', 'true');

    const eventSection = page.locator('carousel-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '切换事件' }),
    });
    const eventCarousel = eventSection.locator('semi-carousel');
    await eventCarousel.locator('.semi-carousel-indicator').nth(1).click();
    await expect(eventSection.locator('semi-tag')).toHaveText('当前第 2 张');
  });

  test('toggles Spin loading and applies its delay', async ({ page }) => {
    await page.goto('/show/spin');

    const wrapSection = page.locator('spin-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '包裹内容' }),
    });
    const spin = wrapSection.locator('semi-spin');
    await expect(spin.locator('.semi-spin')).not.toHaveClass(/semi-spin-hidden/);
    await wrapSection.getByRole('button', { name: '结束加载' }).click();
    await expect(spin.locator('.semi-spin')).toHaveClass(/semi-spin-hidden/);
    await wrapSection.getByRole('button', { name: '开始加载' }).click();
    await expect(spin.locator('.semi-spin')).not.toHaveClass(/semi-spin-hidden/);

    const delaySection = page.locator('spin-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '延迟显示' }),
    });
    const delayed = delaySection.locator('semi-spin');
    await delaySection.getByRole('button', { name: '模拟加载' }).click();
    await expect(delayed.locator('.semi-spin')).toHaveClass(/semi-spin-hidden/);
    await page.waitForTimeout(950);
    await expect(delayed.locator('.semi-spin')).not.toHaveClass(/semi-spin-hidden/);
  });

  test('selects and clears a Rating value', async ({ page }) => {
    await page.goto('/input/rating');

    const section = page.locator('rating-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const rating = section.locator('semi-rating');
    const stars = rating.locator('.semi-rating-star');
    await expect(section).toContainText('当前评分：3');

    await stars.nth(3).click();
    await expect(section).toContainText('当前评分：4');

    await stars.nth(3).click();
    await expect(section).toContainText('当前评分：0');
  });

  test('types and completes a PinCode', async ({ page }) => {
    await page.goto('/input/pincode');

    const section = page.locator('pin-code-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const pinCode = section.locator('semi-pin-code');
    const inputs = pinCode.locator('input');
    await expect(inputs).toHaveCount(6);

    await inputs.first().click();
    await page.keyboard.type('123456');
    await expect(section).toContainText('当前输入：123456');
    await expect(section).toContainText('完成值：123456');
  });

  test('adds and removes a TagInput tag', async ({ page }) => {
    await page.goto('/input/tag-input');

    const section = page.locator('tag-input-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const tagInput = section.locator('semi-tag-input');
    const input = tagInput.locator('input');
    await expect(section).toContainText('当前标签：设计、前端');

    await input.click();
    await page.keyboard.type('组件');
    await page.keyboard.press('Enter');
    await expect(section).toContainText('当前标签：设计、前端、组件');

    await page.keyboard.press('Backspace');
    await expect(section).toContainText('当前标签：设计、前端');
  });

  test('scrolls the BackTop target back to the top', async ({ page }) => {
    await page.goto('/navigation/back-top');

    const section = page.locator('back-top-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const target = section.locator('.back-top-scroll-a');
    const backTop = section.locator('semi-back-top');
    await expect(backTop).toBeVisible();
    await expect.poll(() => target.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    await backTop.getByRole('button', { name: '回到顶部' }).click();
    await expect.poll(() => target.evaluate((element) => element.scrollTop)).toBe(0);
    await expect(backTop.locator('.semi-back-top')).toHaveCount(0);
  });

  test('renders FloatButton styles, badge and link', async ({ page }) => {
    await page.goto('/basic/float-button');

    const basic = page.locator('float-button-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    await expect(basic.locator('semi-float-button')).toHaveCount(4);
    await expect(basic.locator('semi-float-button').first().locator('button')).toHaveClass(/semi-float-button-round/);
    await expect(basic.locator('semi-float-button').nth(1).locator('button')).toHaveClass(/semi-float-button-square/);

    const badgeSection = page.locator('float-button-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '徽标' }),
    });
    await expect(badgeSection.locator('.semi-badge-count').first()).toHaveText('5');
    await expect(badgeSection.locator('.semi-badge-count').last()).toHaveText('99+');

    const linkSection = page.locator('float-button-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '链接与禁用' }),
    });
    const link = linkSection.locator('semi-float-button').first();
    await expect(link.locator('a')).toHaveAttribute('href', '#float-button');
    const disabled = linkSection.locator('semi-float-button').nth(1);
    await expect(disabled.locator('button')).toBeDisabled();
  });

  test('moves a Slider with the keyboard and renders range handles', async ({ page }) => {
    await page.goto('/input/slider');

    const basic = page.locator('slider-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const handle = basic.locator('semi-slider [role="slider"]');
    await handle.focus();
    await page.keyboard.press('End');
    await expect(handle).toHaveAttribute('aria-valuenow', '100');
    await page.keyboard.press('Home');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');

    const range = page.locator('slider-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '范围选择' }),
    });
    const rangeHandles = range.locator('semi-slider [role="slider"]');
    await expect(rangeHandles).toHaveCount(2);
    await expect(rangeHandles.nth(0)).toHaveAttribute('aria-valuenow', '20');
    await expect(rangeHandles.nth(1)).toHaveAttribute('aria-valuenow', '60');
    await expect(range.locator('.semi-slider-track')).toHaveAttribute('style', /width:40%/);

    const vertical = page.locator('slider-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '垂直与反向' }),
    });
    await expect(vertical.locator('semi-slider').first().locator('[role="slider"]')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    );
  });

  test('filters, selects and clears an AutoComplete value', async ({ page }) => {
    await page.goto('/input/auto-complete');

    const section = page.locator('auto-complete-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const input = section.locator('semi-auto-complete input');
    await input.click();
    await input.fill('Semi');
    const options = page.locator('.semi-autoComplete-option:visible');
    await expect(options).toHaveCount(3);

    await options.filter({ hasText: 'Semi UI' }).click();
    await expect(input).toHaveValue('Semi UI');
    await expect(section).toContainText('最近选择：Semi UI');

    await section.locator('.semi-autoComplete-clear').click();
    await expect(input).toHaveValue('');
  });

  test('navigates AutoComplete options with the keyboard and shows loading', async ({ page }) => {
    await page.goto('/input/auto-complete');

    const section = page.locator('auto-complete-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const input = section.locator('semi-auto-complete input');
    await input.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Semi Design');

    const searchSection = page.locator('auto-complete-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '搜索与空状态' }),
    });
    const searchInput = searchSection.locator('semi-auto-complete input');
    await searchInput.click();
    await searchSection.getByRole('button', { name: '模拟加载' }).click();
    await searchInput.click();
    await expect(page.locator('.semi-autoComplete-loading:visible')).toContainText('加载中');
    await searchSection.getByRole('button', { name: '结束加载' }).click();
  });

  test('toggles a Collapsible box', async ({ page }) => {
    await page.goto('/show/collapsible');

    const section = page.locator('collapsible-docs .doc-section').filter({
      has: page.getByRole('heading', { name: '基本用法' }),
    });
    const collapsible = section.locator('semi-collapsible');
    const wrapper = collapsible.locator('.semi-collapsible-wrapper');

    await expect(wrapper).toHaveCSS('height', '0px');
    await section.getByRole('button', { name: '展开' }).click();
    await expect.poll(() => wrapper.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(0);
    await expect(section.getByRole('button', { name: '收起' })).toBeVisible();

    await section.getByRole('button', { name: '收起' }).click();
    await expect.poll(() => wrapper.evaluate((element) => element.getBoundingClientRect().height)).toBe(0);
  });

  test('selects TimePicker single and range values', async ({ page }) => {
    await page.goto('/input/time-picker');

    const sections = page.locator('time-picker-docs .doc-section');
    const basicInput = sections.nth(0).locator('semi-time-picker input');
    await basicInput.click();
    const basicColumns = sections.nth(0).locator('semi-time-picker-panel .semi-timepicker-panel-list');
    await expect(basicColumns).toHaveCount(3);
    await basicColumns.nth(0).locator('.semi-timepicker-panel-item').nth(12).click();
    await expect(basicInput).toHaveValue('12:30:00');

    const rangeInput = sections.nth(1).locator('semi-time-picker input');
    await rangeInput.click();
    const rangeColumns = sections.nth(1).locator('semi-time-picker-panel .semi-timepicker-panel-list');
    await expect(rangeColumns).toHaveCount(6);
    await rangeColumns.nth(3).locator('.semi-timepicker-panel-item').nth(20).click();
    await expect(rangeInput).toHaveValue('09:00:00 ~ 20:00:00');

    await sections.nth(0).locator('semi-time-picker input').fill('11:45:00');
    await sections.nth(0).locator('semi-time-picker input').press('Enter');
    await expect(sections.nth(0).locator('semi-time-picker input')).toHaveValue('11:45:00');
  });

  test('selects Cascader paths, searches, multi-checks and loads children', async ({ page }) => {
    await page.goto('/input/cascader');

    const sections = page.locator('cascader-docs .doc-section');
    const basic = sections.nth(0).locator('semi-cascader');
    await basic.locator('.semi-cascader').click();
    await basic.locator('.semi-cascader-option', { hasText: '江苏' }).click();
    await basic.locator('.semi-cascader-option', { hasText: '南京' }).click();
    await basic.locator('.semi-cascader-option', { hasText: '玄武' }).click();
    await expect(basic.locator('.semi-cascader-selection')).toContainText('江苏 / 南京 / 玄武');

    const search = sections.nth(2).locator('semi-cascader');
    await search.locator('.semi-cascader').click();
    await search.locator('.semi-cascader-search-input').fill('苏');
    await expect(search.locator('.semi-cascader-option-flatten')).toHaveCount(4);
    await search.locator('.semi-cascader-option-flatten', { hasText: '姑苏' }).click();
    await expect(search.locator('.semi-cascader-selection')).toContainText('江苏 / 苏州 / 姑苏');

    const multiple = sections.nth(1).locator('semi-cascader');
    await multiple.locator('.semi-cascader').click();
    await multiple.locator('.semi-cascader-option-label-checkbox').first().click();
    await expect(multiple.locator('semi-tag')).toHaveCount(2);

    const asyncPicker = sections.nth(3).locator('semi-cascader');
    await asyncPicker.locator('.semi-cascader').click();
    await asyncPicker.locator('.semi-cascader-option', { hasText: '华东区域' }).click();
    await expect(asyncPicker.locator('.semi-cascader-option', { hasText: '城市 A' })).toBeVisible();
  });

  test('selects TreeSelect nodes, checks parents, searches and loads children', async ({ page }) => {
    await page.goto('/input/tree-select');

    const sections = page.locator('tree-select-docs .doc-section');
    const basic = sections.nth(0).locator('semi-tree-select');
    await basic.locator('.semi-tree-select').click();
    let popup = page.locator('.semi-tree-select-popover:visible');
    await expect(popup).toHaveCount(1);
    await popup.locator('.semi-tree-label', { hasText: '余杭' }).click();
    await expect(basic.locator('.semi-tree-select')).toContainText('余杭');

    const multiple = sections.nth(1).locator('semi-tree-select');
    await multiple.locator('.semi-tree-select').click();
    popup = page.locator('.semi-tree-select-popover:visible');
    await popup.locator('.semi-tree-node', { hasText: '浙江' }).locator('.semi-tree-checkbox').first().click();
    await expect(multiple.locator('semi-tag')).toHaveCount(2);
    await expect(multiple.locator('semi-tag', { hasText: '浙江' })).toHaveCount(1);
    await expect(multiple.locator('semi-tag', { hasText: '姑苏' })).toHaveCount(1);

    const search = sections.nth(2).locator('semi-tree-select');
    await search.locator('.semi-tree-select').click();
    popup = page.locator('.semi-tree-select-popover:visible');
    await popup.locator('.semi-tree-select-search-input').fill('杭');
    await expect(popup.locator('.semi-tree-label')).toHaveCount(3);
    await expect(popup.locator('.semi-tree-label', { hasText: '余杭' })).toBeVisible();

    const asyncPicker = sections.nth(3).locator('semi-tree-select');
    await asyncPicker.locator('.semi-tree-select').click();
    popup = page.locator('.semi-tree-select-popover:visible');
    const region = popup.locator('.semi-tree-node', { hasText: '华东区域' }).first();
    await region.locator('.semi-tree-switcher').click();
    await expect(popup.locator('.semi-tree-label', { hasText: '城市 A' })).toBeVisible();
  });

  test('highlights text, merges overlaps and applies custom tags and styles', async ({ page }) => {
    await page.goto('/show/highlight');

    const sections = page.locator('highlight-docs .doc-section');
    const basic = sections.nth(0).locator('semi-highlight');
    await expect(basic.locator('mark')).toHaveCount(3);
    await expect(basic.locator('mark').nth(0)).toHaveText('Semi');
    await expect(basic.locator('mark').nth(1)).toHaveText('设计');
    await expect(basic.locator('mark').nth(2)).toHaveText('Semi');
    await expect(basic).toContainText('Semi Design 是一个设计系统');

    const overlap = sections.nth(1).locator('semi-highlight');
    await expect(overlap.locator('mark')).toHaveCount(2);
    await expect(overlap.locator('mark').nth(1)).toHaveText('Design Lit');

    const custom = sections.nth(3).locator('semi-highlight');
    await expect(custom.locator('mark').nth(1)).toHaveCSS('text-decoration-line', 'underline');
    await expect(custom.locator('mark', { hasText: '组件' })).toHaveCSS('color', 'rgb(216, 57, 49)');

    const customTag = sections.nth(4).locator('semi-highlight');
    await expect(customTag.locator('strong')).toHaveCount(3);
    await expect(customTag.locator('mark')).toHaveCount(0);
  });
});
