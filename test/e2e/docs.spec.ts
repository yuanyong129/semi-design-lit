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
});
