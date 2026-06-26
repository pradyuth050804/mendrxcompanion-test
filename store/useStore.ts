import { create } from 'zustand';
import { Client, SndPlan, CompanionReport } from '@/types/types';

interface User {
  id: string;
  phone_number: string;
  name: string;
  age?: number;
  practitioner_code?: string;
  subscription_status: string;
  program_start_date: string;
  program_end_date: string;
}

interface HealthCondition {
  id: string;
  condition_name: string;
  goal: string;
}

interface DietPlan {
  id: string;
  meal_type: string;
  meal_description: string;
  timing: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
}

interface DailyLog {
  id?: string;
  log_date: string;
  meals_followed: 'yes' | 'partial' | 'no';
  supplements_taken: boolean;
  energy_level: number;
  symptoms: string[];
  sleep_hours: number;
  notes?: string;
}

interface Store {
  user: User | null;
  healthConditions: HealthCondition[];
  dietPlans: DietPlan[];
  supplements: Supplement[];
  dailyLogs: DailyLog[];
  isOnboarded: boolean;
  client: Client | null;
  sndPlan: SndPlan | null;
  companionReport: CompanionReport | null;

  setUser: (user: User | null) => void;
  setHealthConditions: (conditions: HealthCondition[]) => void;
  setDietPlans: (plans: DietPlan[]) => void;
  setSupplements: (supplements: Supplement[]) => void;
  setDailyLogs: (logs: DailyLog[]) => void;
  setIsOnboarded: (value: boolean) => void;
  addDailyLog: (log: DailyLog) => void;
  setClient: (client: Client | null) => void;
  setSndPlan: (plan: SndPlan | null) => void;
  setCompanionReport: (report: CompanionReport | null) => void;
  reset: () => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  healthConditions: [],
  dietPlans: [],
  supplements: [],
  dailyLogs: [],
  isOnboarded: false,
  client: null,
  sndPlan: null,
  companionReport: null,

  setUser: (user) => set({ user }),
  setHealthConditions: (conditions) => set({ healthConditions: conditions }),
  setDietPlans: (plans) => set({ dietPlans: plans }),
  setSupplements: (supplements) => set({ supplements }),
  setDailyLogs: (logs) => set({ dailyLogs: logs }),
  setIsOnboarded: (value) => set({ isOnboarded: value }),
  addDailyLog: (log) => set((state) => ({
    dailyLogs: [...state.dailyLogs, log]
  })),
  setClient: (client) => set({ client }),
  setSndPlan: (plan) => set({ sndPlan: plan }),
  setCompanionReport: (report) => set({ companionReport: report }),
  reset: () => set({
    user: null,
    healthConditions: [],
    dietPlans: [],
    supplements: [],
    dailyLogs: [],
    isOnboarded: false,
    client: null,
    sndPlan: null,
    companionReport: null,
  }),
}));
