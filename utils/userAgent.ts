//utils/userAgent.ts
import UAParser from 'ua-parser-js';
import { NextApiRequest, NextApiResponse } from 'next';

export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  return parser.getResult();
};

// List of user agent strings
export const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3', // Chrome on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/54.0', // Firefox on Windows
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/16.16299', // Edge on Windows
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36', // Chrome on macOS
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15', // Safari on macOS
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36', // Chrome on Linux
  'Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0', // Firefox on Linux
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1', // Safari on iPhone
  'Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1', // Safari on iPad
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36', // Chrome on Android
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36 EdgA/46.3.4.5155', // Edge on Android
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36 OPR/63.0.3216.58675', // Opera on Android
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36 FirefoxLite/90.0.4.0', // Firefox Lite on Android
];

// Function to get a random user agent string from the list
export const getRandomUserAgent = (): string => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userAgent = req.headers['user-agent'] || '';
  res.status(200).json({ userAgent });
};

export default handler;