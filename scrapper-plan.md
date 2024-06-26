
Project Structure

app/
  components/
    DeviceManager.js
  pages/
    api/
      devices/
        index.js
        [name].js
      scrape.js
    devices.js
    _app.js
  prisma/
    schema.prisma
 

 To create a more sophisticated and advanced setup that allows you to choose the device or operating system for scraping, you need to extend the functionality to support different browsers and OS configurations. This involves updating the Selenium configuration and the API to accept parameters for device and OS selection.

1. Set Up Selenium Grid with Multiple Browsers and OS
To support multiple devices and operating systems, ensure your Selenium Grid setup includes nodes configured for different browsers and OS. This can be achieved using Docker to run Selenium Grid with different nodes:


****docker pull selenium/hub
****docker pull selenium/node-chrome
****docker pull selenium/node-firefox

docker network create selenium-grid

docker run -d -p 4444:4444 --network selenium-grid --name selenium-hub selenium/hub

docker run -d --network selenium-grid --name selenium-node-chrome -e HUB_HOST=selenium-hub selenium/node-chrome
docker run -d --network selenium-grid --name selenium-node-firefox -e HUB_HOST=selenium-hub selenium/node-firefox
2. Install Dependencies
Make sure you have the required dependencies installed:


npm install selenium-webdriver @types/selenium-webdriver
npm install --save-dev typescript ts-node
3. Create the Selenium Component
Create a new file SeleniumManager.ts in the components directory to manage Selenium tasks, supporting different devices and operating systems.

typescript

// app/components/SeleniumManager.ts

import { Builder, By, WebDriver } from 'selenium-webdriver';

export interface DeviceConfig {
  browser: string;
  os: string;
}

export default class SeleniumManager {
  private driver: WebDriver;

  constructor(private deviceConfig: DeviceConfig) {
    this.driver = new Builder()
      .usingServer('http://localhost:4444/wd/hub')
      .forBrowser(this.deviceConfig.browser)
      .build();
  }

  async scrape(url: string) {
    try {
      await this.driver.get(url);
      const title = await this.driver.getTitle();
      console.log(`${this.deviceConfig.browser} on ${this.deviceConfig.os} - Page title is: ${title}`);
    } finally {
      await this.driver.quit();
    }
  }
}
4. Update API Route
Update the API route to accept and handle different devices and operating systems for scraping.


// app/pages/api/scrape.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import SeleniumManager, { DeviceConfig } from '../../components/SeleniumManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, devices } = req.body;

  if (!url || !devices) {
    return res.status(400).json({ error: 'URL and devices are required' });
  }

  const scrapePromises = devices.map(async (device: DeviceConfig) => {
    const seleniumManager = new SeleniumManager(device);
    await seleniumManager.scrape(url);
  });

  await Promise.all(scrapePromises);

  res.status(200).json({ message: 'Scraping completed' });
}
5. Update the Devices Page to Select Device and OS
Modify your devices.tsx page to include a form that allows users to select the device and operating system.

typescript

// app/pages/devices.tsx

import { useState } from 'react';

const DevicesPage = () => {
  const [url, setUrl] = useState('');
  const [devices, setDevices] = useState([{ browser: 'chrome', os: 'Windows' }]);
  const [message, setMessage] = useState('');

  const addDevice = () => {
    setDevices([...devices, { browser: 'chrome', os: 'Windows' }]);
  };

  const updateDevice = (index: number, key: string, value: string) => {
    const newDevices = [...devices];
    newDevices[index][key] = value;
    setDevices(newDevices);
  };

  const handleScrape = async () => {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, devices }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Devices</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
      />
      {devices.map((device, index) => (
        <div key={index}>
          <select
            value={device.browser}
            onChange={(e) => updateDevice(index, 'browser', e.target.value)}
          >
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="edge">Edge</option>
          </select>
          <select
            value={device.os}
            onChange={(e) => updateDevice(index, 'os', e.target.value)}
          >
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
          </select>
        </div>
      ))}
      <button onClick={addDevice}>Add Device</button>
      <button onClick={handleScrape}>Scrape</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DevicesPage;