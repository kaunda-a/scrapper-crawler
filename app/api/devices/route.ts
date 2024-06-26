import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export const addDevice = async (name: string, ip: string) => {
  const { data: device, error: insertError } = await supabase
    .from('Device')
    .insert([{ name, ip }])
    .single();
  if (insertError) throw new Error(insertError.message);
  return device;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { name, ip } = req.body;
        const device = await addDevice(name, ip);
        res.status(201).json({ message: 'Device added', device });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
