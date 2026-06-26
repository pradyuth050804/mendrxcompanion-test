require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const { data, error } = await supabase.from('health_categories').select('*').eq('report_id', '1392c67c-53ac-4e1f-b4df-9df0585d7a93');
  console.log('categories for 1392:', data);
}

testQuery();
