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
});
