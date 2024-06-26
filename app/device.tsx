"use client";

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import deviceLogos from '@/components/icons/logo'; // A utility to map device types to logos

const deviceOptions = [
  { browser: 'chrome', os: 'Windows', logo: deviceLogos.Windows },
  { browser: 'firefox', os: 'Linux', logo: deviceLogos.Linux },
  { browser: 'safari', os: 'macOS', logo: deviceLogos.macOS },
  { browser: 'chrome', os: 'Android', logo: deviceLogos.Android },
  { browser: 'safari', os: 'iOS', logo: deviceLogos.iOS },
  { browser: 'chrome', os: 'iPhone', logo: deviceLogos.iPhone },
  { browser: 'chrome', os: 'Samsung', logo: deviceLogos.Samsung },
  { browser: 'chrome', os: 'Pixel', logo: deviceLogos.Pixel },
];

const DevicesPage = () => {
  const [url, setUrl] = useState('');
  const [devices, setDevices] = useState<{ browser: string; os: string; proxy: string; usePuppeteer: boolean; logo: string; }[]>([{ browser: 'chrome', os: 'Windows', proxy: '', usePuppeteer: true, logo: deviceLogos.Windows }]);
  const [message, setMessage] = useState('');

  const addDevice = () => {
    setDevices([...devices, { browser: 'chrome', os: 'Windows', proxy: '', usePuppeteer: true, logo: deviceLogos.Windows }]);
  };

  const updateDevice = (index: number, key: keyof typeof devices[0], value: string | boolean) => {
    const newDevices = [...devices];
    newDevices[index] = {
      ...newDevices[index],
      [key]: value
    };

    if (key === 'os') {
      const selectedOption = deviceOptions.find(option => option.os === value);
      newDevices[index].logo = selectedOption ? selectedOption.logo : '';
    }

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
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
        className="mb-4"
      />
      {devices.map((device, index) => (
        <Card key={index} className="mb-4 p-4">
          <Select
            value={device.browser}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDevice(index, 'browser', e.target.value)}
            className="mb-4"
          >
            <option value="chrome">Chrome</option>
            <option value="firefox">Firefox</option>
            <option value="safari">Safari</option>
            <option value="edge">Edge</option>
          </Select>
          <Select
            value={device.os}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDevice(index, 'os', e.target.value)}
            className="mb-4"
          >
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="Pixel">Pixel</option>
          </Select>
          <Input
            value={device.proxy}
            onChange={(e) => updateDevice(index, 'proxy', e.target.value)}
            placeholder="Enter proxy"
            className="mb-4"
          />
          <Select
            value={device.usePuppeteer ? 'puppeteer' : 'selenium'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDevice(index, 'usePuppeteer', e.target.value === 'puppeteer')}
            className="mb-4"
          >
            <option value="puppeteer">Puppeteer</option>
            <option value="selenium">Selenium</option>
          </Select>
          {device.logo && (
            <Image src={device.logo} alt={`${device.os} logo`} width={64} height={64} className="w-16 h-16" />
          )}
        </Card>
      ))}
      <Button onClick={addDevice} className="mb-4">Add Device</Button>
      <Button onClick={handleScrape} className="mb-4">Scrape and Click Ads</Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DevicesPage;
