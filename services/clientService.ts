import { supabase } from '@/lib/supabase';
import { Client } from '@/types/types';

/**
 * Find a client by name (case-insensitive partial match).
 * Returns the first matching client, or null if none found.
 */
export async function findClientByName(name: string): Promise<Client | null> {
  console.log('--- FIND CLIENT BY NAME ---');
  console.log('Input name:', name);
  console.log('Supabase URL:', supabase['supabaseUrl']); // For debugging, might be inaccessible depending on client object, but we can try

  const { data, error } = await supabase
    .from('client')
    .select('id, name, gender, phone_number')
    .ilike('name', `%${name}%`)
    .limit(1);

  console.log(`Generated query: SELECT id, name, gender, phone_number FROM client WHERE name ILIKE %${name}% LIMIT 1`);
  console.log('Returned data:', JSON.stringify(data, null, 2));
  console.log('Returned error:', error);

  if (error) {
    console.error('Error finding client:', error.message);
    throw new Error(`Failed to find client: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as Client;
}
