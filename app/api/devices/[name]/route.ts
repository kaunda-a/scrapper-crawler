import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
export const getDevices = async () => {
  const { data: devices, error } = await supabase.from('Device').select('*');
  if (error) throw new Error(error.message);
  return devices;
};

export const deleteDevice = async (name: string) => {
  const { error } = await supabase
    .from('Device')
    .delete()
    .eq('name', name);
  if (error) throw new Error(error.message);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query: { name } } = req;

  switch (method) {
    case 'DELETE':
      try {
        await deleteDevice(name as string);
        res.status(200).json({ message: 'Device removed' });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
