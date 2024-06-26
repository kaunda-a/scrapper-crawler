// app/components/SeleniumManager.ts

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';

puppeteer.use(StealthPlugin());

export interface DeviceConfig {
  browser: string;
  os: string;
  proxy: string;
  usePuppeteer: boolean;
}

export default class SeleniumManager {
  private driver: WebDriver | null = null;
  private browser: puppeteer.Browser | null = null;

  constructor(private deviceConfig: DeviceConfig) {}

  async initialize() {
    if (this.deviceConfig.usePuppeteer) {
      const launchOptions: any = {
        headless: true,
        args: [],
      };

      if (this.deviceConfig.proxy) {
        launchOptions.args.push(`--proxy-server=${this.deviceConfig.proxy}`);
      }

      this.browser = await puppeteer.launch(launchOptions);
    } else {
      const builder = new Builder()
        .usingServer('http://localhost:4444/wd/hub')
        .forBrowser(this.deviceConfig.browser);

      if (this.deviceConfig.proxy) {
        builder.setProxy({
          proxyType: 'manual',
          httpProxy: this.deviceConfig.proxy,
          sslProxy: this.deviceConfig.proxy,
        });
      }

      this.driver = builder.build();
    }
  }

  async scrapeAndClickAds(url: string) {
    await this.initialize();

    if (this.deviceConfig.usePuppeteer && this.browser) {
      const page = await this.browser.newPage();
      await page.goto(url);

      const ads = await page.$$('.ad-class');
      for (let ad of ads) {
        await ad.click();
        console.log(`${this.deviceConfig.browser} on ${this.deviceConfig.os} - Clicked an ad`);
        await page.waitForTimeout(2000);
      }

      const title = await page.title();
      console.log(`${this.deviceConfig.browser} on ${this.deviceConfig.os} - Page title is: ${title}`);
      await this.browser.close();
    } else if (this.driver) {
      await this.driver.get(url);

      const ads = await this.driver.findElements(By.css('.ad-class'));
      for (let ad of ads) {
        await ad.click();
        console.log(`${this.deviceConfig.browser} on ${this.deviceConfig.os} - Clicked an ad`);
        await this.driver.sleep(2000);
      }

      const title = await this.driver.getTitle();
      console.log(`${this.deviceConfig.browser} on ${this.deviceConfig.os} - Page title is: ${title}`);
      await this.driver.quit();
    }
  }
}
