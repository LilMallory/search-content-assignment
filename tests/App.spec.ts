import { test, expect } from '@playwright/test';

test.describe('Search Bar Functionality', () => {
  const searchQuery = 'chi';

  test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000');
  });

  test('display typeaway suggestion dropdown when typing more than 2 characters', async ({ page }) => {
    // enter 'ch' into search bar
    await page.locator('#search-bar').pressSequentially('ch', {delay:200});
    // check if dropdown item appears
    await expect(page.locator('.suggestion-item')).toHaveCount(0);
    // clear search bar
    await page.locator('#search-bar').clear();
    // enter 'chi' into search bar
    await page.locator('#search-bar').pressSequentially('chi', {delay:200});
    // check if dropdown item appears
    await expect(page.locator('.suggestion-item').first()).toBeVisible();
  });

  test('clear search bar and suggestions', async ({ page }) => {
    // enter 'plan' into search bar
    await page.locator('#search-bar').pressSequentially('child', {delay:200});
    console.log(page.content)
    await page.locator('#search-bar').click();
    // check if dropdown item appears
    await expect(page.locator('.suggestions-list').first()).toHaveCount(1);
    // press escape
    await page.keyboard.press('Escape', {delay:200});
    // check if search bar is cleared
    await expect(page.locator('#search-bar')).toBeEmpty();
    // check if dropdown item disappears
    await expect(page.locator('.suggestion-item')).toHaveCount(0);
  });

  test('update search results on clicking search button', async ({ page }) => {
    // enter searchQuery string into search bar
    await page.locator('#search-bar').pressSequentially(searchQuery, {delay:200});
    // click on search button
    await page.click('#search-button');
    // check if result summary contains text 'Showing 1-'
    await expect(page.locator('.result-summary')).toContainText('Showing 1-');
    // check if search result contains searchQuery string
    await expect(page.locator('.document-wrapper').first()).toContainText(searchQuery);
  });

  test('update search results on pressing Enter', async ({ page }) => {
    // enter searchQuery string into search bar
    await page.locator('#search-bar').pressSequentially(searchQuery, {delay:200});
    // press Enter
    await page.locator('#search-bar').press('Enter');
    // check if result summary contains text 'Showing 1-'
    await expect(page.locator('.result-summary')).toContainText('Showing 1-');
    // check if search result contains searchQuery string
    await expect(page.locator('.document-wrapper').first()).toContainText(searchQuery);
  });

  test('update search results on clicking suggestion', async ({ page }) => {
    // enter searchQuery string into search bar
    await page.locator('#search-bar').pressSequentially(searchQuery, {delay:200});
    // click on first suggestion
    await page.locator('.suggestion-item').first().click();
    // get suggestion text
    const textInSearchBar = await page.locator('#search-bar').textContent();
    // check if result summary contains text 'Showing 1-'
    await expect(page.locator('.result-summary')).toContainText('Showing 1-');
    // check if search result contains searchQuery string
    await expect(page.locator('.document-wrapper').first()).toContainText(textInSearchBar!);
  });

  test('update search results on selecting suggestion using key press', async ({ page }) => {
    // enter searchQuery string into search bar
    await page.locator('#search-bar').pressSequentially(searchQuery, {delay:200});
    // press ArrowDown
    await page.locator('#search-bar').press('ArrowDown');
    // press ArrowDown
    await page.locator('#search-bar').press('ArrowDown');
    // press ArrowUp
    await page.locator('#search-bar').press('ArrowUp');
    // press Enter
    await page.locator('#search-bar').press('Enter');
    // get suggestion text
    const textInSearchBar = await page.locator('#search-bar').textContent();
    // check if result summary contains text 'Showing 1-'
    await expect(page.locator('.result-summary')).toContainText('Showing 1-');
    // check if search result contains searchQuery string
    await expect(page.locator('.document-wrapper').first()).toContainText(textInSearchBar!);
  });
});