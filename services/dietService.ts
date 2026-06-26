import { supabase } from '@/lib/supabase';
import { DayPlan } from '@/types/types';

/**
 * Fetch the latest day_plan for a given client by traversing:
 *   client → report (latest by report_date)
 *          → snd_plan
 *          → diet_plan
 *          → day_plan
 *
 * Returns the DayPlan object or null if any link in the chain is missing.
 */
export async function fetchLatestDayPlan(clientId: string): Promise<DayPlan | null> {
  // 1. Get the latest report for this client
  const { data: report, error: reportError } = await supabase
    .from('report')
    .select('id')
    .eq('client_id', clientId)
    .order('report_date', { ascending: false })
    .limit(1)
    .single();

  if (reportError || !report) {
    if (reportError?.code !== 'PGRST116') {
      console.error('Error fetching report:', reportError?.message);
    }
    return null;
  }

  // 2. Get the snd_plan for this report
  const { data: sndPlan, error: sndPlanError } = await supabase
    .from('snd_plan')
    .select('id')
    .eq('report_id', report.id)
    .limit(1)
    .single();

  if (sndPlanError || !sndPlan) {
    if (sndPlanError?.code !== 'PGRST116') {
      console.error('Error fetching snd_plan:', sndPlanError?.message);
    }
    return null;
  }

  // 3. Get the latest diet_plan for this snd_plan
  const { data: dietPlan, error: dietPlanError } = await supabase
    .from('diet_plan')
    .select('id')
    .eq('snd_plan_id', sndPlan.id)
    .limit(1)
    .single();

  if (dietPlanError || !dietPlan) {
    if (dietPlanError?.code !== 'PGRST116') {
      console.error('Error fetching diet_plan:', dietPlanError?.message);
    }
    return null;
  }

  // 4. Get the day_plan linked to this diet_plan
  const { data: dayPlan, error: dayPlanError } = await supabase
    .from('day_plan')
    .select('id, diet_plan_version_id, pre_morning, morning, mid_morning, lunch, early_evening, night, bedtime')
    .eq('diet_plan_version_id', dietPlan.id)
    .limit(1)
    .single();

  if (dayPlanError || !dayPlan) {
    if (dayPlanError?.code !== 'PGRST116') {
      console.error('Error fetching day_plan:', dayPlanError?.message);
    }
    return null;
  }

  return dayPlan as DayPlan;
}
