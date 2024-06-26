
Sure, let's rebuild the entire app using TypeScript, Supabase, and following best practices. Supabase will be used for authentication, database, and storage. Here's the updated implementation:

1. Project Setup
Initialize a New Next.js Project with TypeScript
bash
Copy code
npx create-next-app@latest my-app --typescript
cd my-app
Install Dependencies
bash
Copy code
npm install @supabase/supabase-js
npm install axios
Project Structure
csharp
Copy code
app/
  components/
    DeviceManager.tsx
  pages/
    api/
      devices/
        index.ts
        [name].ts
      scrape.ts
    devices.tsx
    _app.tsx
  utils/
    supabase.ts
  Dockerfile
  docker-compose.yml
  .env.local
  .gitignore
  prisma/
    schema.prisma
  ...
2. Supabase Setup
Go to Supabase and create a new project.
Retrieve your API URL and Anon key from the project settings.
3. Environment Variables
Create a .env.local file in the root directory and add the following:

makefile
Copy code
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
4. Supabase Configuration
utils/supabase.ts:

typescript
Copy code
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
5. Prisma Setup
Initialize Prisma
bash
Copy code
npx prisma init
Configure Prisma Schema
prisma/schema.prisma:

prisma
Copy code
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Device {
  id    Int     @id @default(autoincrement())
  name  String
  ip    String
}
Run Prisma Migrations
bash
Copy code
npx prisma migrate dev --name init
npx prisma generate
6. API Routes
Devices API
pages/api/devices/index.ts:

typescript
Copy code
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch all devices
      const { data: devices, error } = await supabase.from('Device').select('*');
      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json(devices);
      break;
    case 'POST':
      // Create a new device
      const { name, ip } = req.body;
      const { data: device, error: insertError } = await supabase
        .from('Device')
        .insert([{ name, ip }])
        .single();
      if (insertError) return res.status(500).json({ error: insertError.message });
      res.status(201).json({ message: 'Device added', device });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
pages/api/devices/[name].ts:

typescript
Copy code
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query: { name } } = req;

  switch (method) {
    case 'DELETE':
      // Delete a device by name
      const { error } = await supabase
        .from('Device')
        .delete()
        .eq('name', name as string);
      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json({ message: 'Device removed' });
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
Scrape API
pages/api/scrape.ts:

typescript
Copy code
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { ip } = req.body;

  if (method === 'POST') {
    try {
      // Launch Puppeteer with a specified proxy server
      const browser = await puppeteer.launch({
        args: [`--proxy-server=${ip}`],
      });
      const page = await browser.newPage();
      await page.goto('http://example.com'); // Replace with the URL you want to scrape
      // Perform scraping actions here
      await browser.close();
      res.status(200).json({ message: 'Scraping completed' });
    } catch (error) {
      res.status(500).json({ message: 'Error scraping', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
7. Frontend for Device Management
Device Manager Component
components/DeviceManager.tsx:

typescript
Copy code
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Device {
  id: number;
  name: string;
  ip: string;
}

export default function DeviceManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const res = await axios.get<Device[]>('/api/devices');
    setDevices(res.data);
  };

  const addDevice = async () => {
    await axios.post('/api/devices', { name, ip });
    fetchDevices();
  };

  const removeDevice = async (name: string) => {
    await axios.delete(`/api/devices/${name}`);
    fetchDevices();
  };

  const scrapeWithDevice = async (ip: string) => {
    await axios.post('/api/scrape', { ip });
  };

  return (
    <div>
      <h1>Network Emulator</h1>
      <input
        type="text"
        placeholder="Device Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="IP Address"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <button onClick={addDevice}>Add Device</button>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - {device.ip}
            <button onClick={() => removeDevice(device.name)}>Remove</button>
            <button onClick={() => scrapeWithDevice(device.ip)}>Scrape with this IP</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
Devices Page
pages/devices.tsx:

typescript
Copy code
import DeviceManager from '../components/DeviceManager';

export default function Devices() {
  return (
    <div>
      <DeviceManager />
    </div>
  );
}
8. Application Wrapper
pages/_app.tsx:

typescript
Copy code
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;



9. Docker Setup
Docker Compose
docker-compose.yml:

yaml
Copy code
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://user:password@db:5432/mydatabase
    volumes:
      - .:/app
    command: npm run dev

  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
Dockerfile
Dockerfile:

dockerfile
Copy code
# Use the official Node.js image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "dev"]
10. Run the Application
Build and Start the Docker Containers:

bash
Copy code
docker-compose up --build
Access Your Application:
Open your browser and go to http://localhost:3000.

Summary
This implementation provides a full Next.js application with:

A PostgreSQL database managed by Supabase.
API routes to manage devices and perform web scraping.
A frontend component to manage devices.
Docker configuration to run the application and database in containers.
This setup ensures that your application is maintainable, scalable, and easy to deploy.






