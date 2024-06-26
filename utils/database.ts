// utils/database.ts

import { supabase } from '@/lib/supabase';

export const getSimulators = async () => {
  const { data, error } = await supabase.from('simulators').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addSimulator = async (name: string, ip: string) => {
  const { data, error } = await supabase.from('simulators').insert([{ name, ip }]).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};


export const removeSimulator = async (name: string) => {
  const { data, error } = await supabase.from('simulators').delete().eq('name', name).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
