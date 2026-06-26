import { Client, SndPlan, CompanionReport } from '@/types/types';

/**
 * Demo data for Vercel deployment previews.
 *
 * Activated by setting EXPO_PUBLIC_DEMO_MODE=true in environment variables.
 * This file is ONLY consumed by the root _layout.tsx to hydrate the Zustand
 * store on startup — no other file needs to import it.
 */

// ─── Client & User ──────────────────────────────────────────────────────────

export const DEMO_CLIENT: Client = {
  id: 'demo-client-001',
  name: 'Sridhar',
  gender: 'Male',
  phone_number: '+91 99887 76655',
};

export const DEMO_USER = {
  id: 'demo-client-001',
  phone_number: '+91 99887 76655',
  name: 'Sridhar',
  age: 28,
  subscription_status: 'active',
  program_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  program_end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),   // 60 days from now
};

// ─── SndPlan (Diet + Supplements) ───────────────────────────────────────────

export const DEMO_SND_PLAN: SndPlan = {
  id: 'demo-plan-001',
  supplements: [
    {
      id: 'sup-1',
      name: 'Iron Complex',
      purpose: 'Corrects iron-deficiency anemia and supports hemoglobin synthesis.',
      timing: 'Morning (empty stomach)',
      dosage: '1 tablet',
      precautions: 'Take with Vitamin C (orange juice) for maximum absorption. Avoid with tea or coffee.',
      timingCategory: 'Morning',
    },
    {
      id: 'sup-2',
      name: 'Vitamin D3',
      purpose: 'Supports calcium absorption, bone health, and immune regulation.',
      timing: 'Morning (with breakfast)',
      dosage: '2000 IU',
      precautions: 'Take with a healthy fat source for better bioavailability.',
      timingCategory: 'Morning',
    },
    {
      id: 'sup-3',
      name: 'B-Complex',
      purpose: 'Supports mitochondrial energy production and nervous system health.',
      timing: 'Afternoon (with lunch)',
      dosage: '1 tablet',
      precautions: 'May cause bright yellow urine — this is normal and harmless.',
      timingCategory: 'Afternoon',
    },
    {
      id: 'sup-4',
      name: 'Zinc + Magnesium (ZMA)',
      purpose: 'Promotes restorative sleep, supports thyroid function and immune defense.',
      timing: 'Night (30 min before bed)',
      dosage: '1 tablet',
      precautions: 'Do not take with calcium supplements — they compete for absorption.',
      timingCategory: 'Night',
    },
  ],
  supplementNotes: 'Ensure at least 2-hour gap between Iron and Calcium supplements. Reassess after 6-week blood panel.',
  dietPlanVersions: [
    {
      id: 'dpv-1',
      versionNumber: 1,
      dietNotes: 'Focus on anti-inflammatory, iron-rich whole foods. Avoid processed sugar and refined flour.',
      dayPlans: [
        {
          id: 'day-1',
          day: 'Day 1',
          preMorning: 'Warm water with lemon & a pinch of turmeric\nSoaked almonds (5-6)',
          morning: 'Ragi porridge with jaggery & cardamom\nBoiled egg (1)\nFresh orange juice',
          midMorning: 'Seasonal fruit bowl (pomegranate, apple)\nGreen tea',
          lunch: 'Brown rice (1 cup)\nPalak dal with spinach & moong\nCucumber raita\nSteamed broccoli',
          earlyEvening: 'Roasted makhana with rock salt\nCoconut water',
          night: 'Grilled chicken breast with herbs\nQuinoa pilaf\nSautéed mixed vegetables\nWarm turmeric milk',
          bedtime: 'Chamomile tea\nA few walnuts',
        },
      ],
    },
  ],
  versionCount: 1,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── Companion Report (Blood Panels) ────────────────────────────────────────

export const DEMO_COMPANION_REPORT: CompanionReport = {
  id: 'demo-report-001',
  reportDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  client: { name: 'Sridhar', gender: 'Male', birthMonth: '1998-03' },
  height: 175,
  weight: 68,
  waist: 32,
  bmi: 22.2,
  diet: 'Non-Vegetarian',
  lifestyleHabits: ['Sedentary work', 'Moderate exercise 3x/week', 'Poor sleep schedule'],
  existingConditions: ['Hypothyroidism', 'Iron-deficiency Anemia'],
  bloodPanelListMap: {
    'Thyroid Panel': [
      {
        parameterName: 'TSH',
        value: '5.8',
        units: 'mIU/L',
        result: 'HIGH',
        deviation: 15,
        reason: 'Elevated TSH suggests subclinical hypothyroidism. Monitor with medication.',
        parameterInfo: {
          shortDescription: 'Thyroid Stimulating Hormone',
          minValue: 0.4,
          maxValue: 10.0,
          standardMinValue: 0.4,
          standardMaxValue: 4.0,
          panelName: 'Thyroid Panel',
        },
      },
      {
        parameterName: 'Free T4',
        value: '1.1',
        units: 'ng/dL',
        result: 'NORMAL',
        deviation: 0,
        reason: null,
        parameterInfo: {
          shortDescription: 'Free Thyroxine',
          minValue: 0.7,
          maxValue: 2.5,
          standardMinValue: 0.8,
          standardMaxValue: 1.8,
          panelName: 'Thyroid Panel',
        },
      },
      {
        parameterName: 'Free T3',
        value: '2.4',
        units: 'pg/mL',
        result: 'NORMAL',
        deviation: 0,
        reason: null,
        parameterInfo: {
          shortDescription: 'Free Triiodothyronine',
          minValue: 1.8,
          maxValue: 4.6,
          standardMinValue: 2.0,
          standardMaxValue: 4.4,
          panelName: 'Thyroid Panel',
        },
      },
    ],
    'Complete Blood Count': [
      {
        parameterName: 'Hemoglobin',
        value: '11.2',
        units: 'g/dL',
        result: 'LOW',
        deviation: -12,
        reason: 'Below optimal range — consistent with iron-deficiency anemia. Supplement with Iron Complex.',
        parameterInfo: {
          shortDescription: 'Hemoglobin concentration in blood',
          minValue: 7.0,
          maxValue: 20.0,
          standardMinValue: 13.0,
          standardMaxValue: 17.0,
          panelName: 'Complete Blood Count',
        },
      },
      {
        parameterName: 'RBC Count',
        value: '4.5',
        units: 'million/µL',
        result: 'NORMAL',
        deviation: 0,
        reason: null,
        parameterInfo: {
          shortDescription: 'Red Blood Cell count',
          minValue: 3.5,
          maxValue: 6.5,
          standardMinValue: 4.5,
          standardMaxValue: 5.5,
          panelName: 'Complete Blood Count',
        },
      },
      {
        parameterName: 'WBC Count',
        value: '7.2',
        units: 'thousand/µL',
        result: 'NORMAL',
        deviation: 0,
        reason: null,
        parameterInfo: {
          shortDescription: 'White Blood Cell count',
          minValue: 3.5,
          maxValue: 15.0,
          standardMinValue: 4.0,
          standardMaxValue: 11.0,
          panelName: 'Complete Blood Count',
        },
      },
    ],
    'Metabolic Panel': [
      {
        parameterName: 'Vitamin D',
        value: '18',
        units: 'ng/mL',
        result: 'LOW',
        deviation: -25,
        reason: 'Deficient. Supplement with Vitamin D3 2000 IU daily and increase sunlight exposure.',
        parameterInfo: {
          shortDescription: 'Serum 25-Hydroxyvitamin D',
          minValue: 5,
          maxValue: 100,
          standardMinValue: 30,
          standardMaxValue: 80,
          panelName: 'Metabolic Panel',
        },
      },
      {
        parameterName: 'Vitamin B12',
        value: '320',
        units: 'pg/mL',
        result: 'NORMAL',
        deviation: 0,
        reason: null,
        parameterInfo: {
          shortDescription: 'Serum Cobalamin',
          minValue: 100,
          maxValue: 1500,
          standardMinValue: 200,
          standardMaxValue: 900,
          panelName: 'Metabolic Panel',
        },
      },
      {
        parameterName: 'Ferritin',
        value: '12',
        units: 'ng/mL',
        result: 'LOW',
        deviation: -40,
        reason: 'Very low iron stores. Supplement aggressively and retest in 6 weeks.',
        parameterInfo: {
          shortDescription: 'Serum Ferritin (iron storage)',
          minValue: 5,
          maxValue: 500,
          standardMinValue: 30,
          standardMaxValue: 300,
          panelName: 'Metabolic Panel',
        },
      },
    ],
  },
  notes: 'Patient presents with fatigue, low energy, and occasional brain fog — likely linked to iron deficiency and suboptimal Vitamin D. Thyroid is borderline; continue medication and retest after 8 weeks. Diet plan focuses on iron-rich, anti-inflammatory foods with strategic supplement timing for maximum absorption.',
};
