// utils/proxy.ts
import axios from 'axios';

const TRAEFIK_API_ENDPOINT = process.env.TRAEFIK_API_ENDPOINT || '';

// Function to get active proxy from Traefik
export const getActiveProxy = async (): Promise<{ ip: string; port: number } | null> => {
  try {
    const response = await axios.get(TRAEFIK_API_ENDPOINT);
    const servers = response.data;
    if (servers.length > 0) {
      const activeServer = servers[0]; // Assuming the first server is the active one
      return { ip: activeServer.url.split('://')[1], port: parseInt(activeServer.port, 10) };
    }
    return null;
  } catch (error) {
    console.error('Error fetching active proxy:', error);
    return null;
  }
};

// Function to rotate proxies (not applicable if Traefik manages rotation)
export const rotateProxy = async (): Promise<void> => {
  // You may skip this function if Traefik manages proxy rotation
};

// Function to add new proxy (not applicable if Traefik manages proxy creation)
export const addProxy = async (): Promise<void> => {
  // You may skip this function if Traefik manages proxy creation
};
