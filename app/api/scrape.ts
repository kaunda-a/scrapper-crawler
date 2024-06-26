import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getActiveProxy } from '@/utils/proxy';
import { preventFingerprinting } from '@/utils/fingerprinting';
import { simulateMouseMovement, simulateFormFilling, simulateSearch, clickAd, randomScroll, manageCookies } from '@/utils/puppeteerHelpers';
import { solveSliderCaptcha, solveFriendlyChallenge } from '@/utils/captcha';
import { getRandomUserAgent, parseUserAgent } from '@/utils/userAgent';
import { supabase } from '@/lib/supabase';
import SeleniumManager, { DeviceConfig } from '../../components/SeleniumManager';

puppeteer.use(StealthPlugin());

const scrapeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { url, devices } = req.body;

    if (!url || !devices) {
      return res.status(400).json({ error: 'URL and devices are required' });
    }
  
    const scrapePromises = devices.map(async (device: DeviceConfig) => {
      const seleniumManager = new SeleniumManager(device);
      await seleniumManager.scrapeAndClickAds(url);
    });
  
    await Promise.all(scrapePromises);
  
    res.status(200).json({ message: 'Scraping and ad clicking completed' });
  
  
    const proxy = await getActiveProxy();

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${proxy?.ip}:${proxy?.port}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    const userAgent = req.headers['user-agent'];
    console.log('Parsed User Agent:', parseUserAgent(userAgent || ''));
    await page.setUserAgent(userAgent || getRandomUserAgent());
    await preventFingerprinting(page);

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Manage cookies
    await manageCookies(page);
    await simulateMouseMovement(page);
    await solveSliderCaptcha(page);
    await solveFriendlyChallenge(page);

    await clickAd(page, '.ad-class'); // Replace with actual ad selector
    await randomScroll(page);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const adLinks = await page.$$eval('a.ad-link', links => links.map(link => link.href)); // Replace with actual ad link selector
    for (const link of adLinks || []) {
      await page.goto(link);
      await delay(Math.floor(Math.random() * 3000) + 2000);
      await randomScroll(page);
      await page.goBack();
    }

        // Save scraped data to Supabase
        const { data, error } = await supabase.from('ScrapedData').insert([{ url, userAgent }]);
        if (error) {
          console.error('Error saving scraped data:', error);
        }
        
    await browser.close();
    res.status(200).json({ message: 'Scraping completed successfully.' });
  } catch (error: any) {
    console.error('Error during scraping:', error);
    res.status(500).json({ message: 'Scraping failed.', error: error.message });
  }
};

export default scrapeHandler;
