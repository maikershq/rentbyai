import { test, expect } from '@playwright/test';

test.describe('RentBy Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/RentBy/);
    
    // Check if main heading exists
    await expect(page.locator('h1')).toContainText('RentBy');
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to resources page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click on Resources link
    await page.click('text=Resources');
    
    // Check if we're on the resources page
    await expect(page).toHaveURL(/.*resources/);
    await expect(page.locator('h1')).toContainText('Resources');
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Navigate to search
    await page.click('text=Search');
    
    // Check if search page loaded
    await expect(page).toHaveURL(/.*search/);
  });
});
