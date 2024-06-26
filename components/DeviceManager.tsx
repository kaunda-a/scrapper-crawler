"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './ui/button';
import { parseUserAgent, getRandomUserAgent } from '@/utils/userAgent';
import { getDevices, deleteDevice } from '@/app/api/devices/[name]/route';
import { addDevice } from '@/app/api/devices/route';

interface Simulator {
  id: number;
  name: string;
  ip: string;
}

const DeviceManager: React.FC = () => {
  const [simulators, setSimulators] = useState<Simulator[]>([]);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [url, setUrl] = useState('');
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    fetchSimulators();
    fetchUserAgent();
  }, []);

  const fetchSimulators = async () => {
    try {
      const simulators = await getDevices();
      setSimulators(simulators);
    } catch (error) {
      console.error('Error fetching simulators:', error);
    }
  };

  const fetchUserAgent = async () => {
    try {
      const res = await axios.get('/api/userAgent');
      const userAgentString = res.data.userAgent;
      const parsedUserAgent = parseUserAgent(userAgentString);
      setUserAgent(JSON.stringify(parsedUserAgent, null, 2));
    } catch (error) {
      console.error('Error fetching user agent:', error);
    }
  };

  const addSimulator = async () => {
    try {
      const newDevice = await addDevice(name, ip);
      fetchSimulators(); // Fetch the updated list of devices
    } catch (error) {
      console.error('Error adding simulator:', error);
    }
  };

  const removeSimulator = async (name: string) => {
    try {
      await deleteDevice(name);
      fetchSimulators(); // Fetch the updated list of devices
    } catch (error) {
      console.error('Error removing simulator:', error);
    }
  };

  const startSimulation = async (ip: string) => {
    try {
      await axios.post('/api/scrape', { ip, url, userAgent });
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Simulator Manager</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Simulator Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Simulator IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="URL to scrape"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 mr-2"
        />
        <Button onClick={addSimulator}>Add Simulator</Button>
      </div>
      <ul>
        {simulators.map((simulator) => (
          <li key={simulator.id} className="mb-2">
            {simulator.name} - {simulator.ip}
            <Button onClick={() => removeSimulator(simulator.name)} className="ml-2">
              Remove
            </Button>
            <Button onClick={() => startSimulation(simulator.ip)} className="ml-2">
              Start Simulation
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceManager;
