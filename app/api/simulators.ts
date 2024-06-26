import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export const getDevices = async () => {
  const { data: devices, error } = await supabase.from('Device').select('*');
  if (error) throw new Error(error.message);
  return devices;
};

export const addDevice = async (name: string, ip: string) => {
  const { data: device, error: insertError } = await supabase
    .from('Device')
    .insert([{ name, ip }])
    .single();
  if (insertError) throw new Error(insertError.message);
  return device;
};

export const deleteDevice = async (name: string) => {
  const { error } = await supabase
    .from('Device')
    .delete()
    .eq('name', name);
  if (error) throw new Error(error.message);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET':
        const devices = await getDevices();
        res.status(200).json(devices);
        break;
      case 'POST':
        const { name, ip } = body;
        const newDevice = await addDevice(name, ip);
        res.status(201).json(newDevice);
        break;
      case 'DELETE':
        const { name: deleteName } = body;
        await deleteDevice(deleteName);
        res.status(200).json({ message: 'Device removed' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
