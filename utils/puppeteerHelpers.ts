import puppeteer, { Page } from 'puppeteer';

// Utility function to pause execution for a given number of milliseconds
const waitForTimeout = async (page: Page, timeout: number) => {
  await new Promise(resolve => setTimeout(resolve, timeout));
};

// Function to simulate human-like mouse movements
export const simulateMouseMovement = async (page: Page) => {
  const targetX = Math.floor(Math.random() * 800) + 100;
  const targetY = Math.floor(Math.random() * 800) + 100;

  const mouse = page.mouse;
  const steps = 50;
  const delay = Math.random() * 100;

  for (let i = 0; i < steps; i++) {
    await mouse.move(targetX / steps * i, targetY / steps * i, { steps: 1 });
    await waitForTimeout(page, delay);
  }
};

// Function to simulate random scrolling
export const randomScroll = async (page: Page) => {
  const steps = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < steps; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, Math.floor(Math.random() * 100) + 100);
    });
    await waitForTimeout(page, Math.floor(Math.random() * 2000) + 1000);
  }
};

// Function to simulate filling out a form
export const simulateFormFilling = async (page: Page, formSelector: string, fields: Record<string, string>) => {
  for (const [selector, value] of Object.entries(fields)) {
    await page.type(`${formSelector} ${selector}`, value, { delay: Math.floor(Math.random() * 100) });
  }
  await waitForTimeout(page, Math.floor(Math.random() * 2000) + 1000);
};

// Function to simulate a search
export const simulateSearch = async (page: Page, searchSelector: string, query: string) => {
  await page.type(searchSelector, query, { delay: Math.floor(Math.random() * 100) });
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
};

// Function to simulate clicking an ad
export const clickAd = async (page: Page, adSelector: string) => {
  await simulateMouseMovement(page);
  await page.click(adSelector);
  await waitForTimeout(page, Math.floor(Math.random() * 3000) + 2000); // Wait as if inspecting the ad
};

// Function to manage cookies
export const manageCookies = async (page: Page) => {
  // Simulate waiting before accepting cookies
  await waitForTimeout(page, Math.floor(Math.random() * 3000) + 2000);

  // Accept cookies if a consent button is present
  const acceptButtonSelector = 'button[aria-label="Accept cookies"], #accept-cookies, .cookie-consent';
  const acceptButton = await page.$(acceptButtonSelector);
  if (acceptButton) {
    await acceptButton.click();
    await waitForTimeout(page, Math.floor(Math.random() * 2000) + 1000);
  }

  // Store cookies for the session
  const cookies = await page.cookies();
  await page.setCookie(...cookies);
};
