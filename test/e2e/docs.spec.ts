import { expect, test } from '@playwright/test';

test.describe('Semi Design Lit docs', () => {
  test('renders the official-style Button page', async ({ page }) => {
    await page.goto('/basic/button');

    await expect(page.getByRole('heading', { level: 1, name: '按钮' })).toBeVisible();
    await expect(page.locator('.sidebar .sidebar-item').filter({ hasText: 'Button' })).toHaveClass(/active/);
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

    await page.goto('/show/tree');
    const tree = page.locator('tree-docs semi-tree').first();
    await tree.locator('.semi-tree-label').filter({ hasText: 'Semi Design' }).click();
    await expect(tree.locator('.semi-tree-node-selected')).toContainText('Semi Design');

    await tree.locator('.semi-tree-switcher').first().click();
    await expect(tree.locator('.semi-tree-label').filter({ hasText: 'Semi Design' })).toHaveCount(0);
  });
});
