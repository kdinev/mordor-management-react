export type Race = 'Orcs' | 'Uruks' | 'Trolls' | 'Nazgûl' | 'Haradrim' | 'Warg Riders' | 'Men of Rhûn' | 'Cave Trolls';
export type AvailabilityLevel = 'Abundant' | 'Adequate' | 'Low' | 'Critical';
export type ProductionStatus = 'Active' | 'Reduced' | 'Damaged' | 'Upgrading';
export type Urgency = 'Critical' | 'High' | 'Medium' | 'Low';
export type BattalionStatus = 'Active' | 'On March' | 'Garrisoned' | 'Recovering';

export interface Battalion {
  id: string;
  name: string;
  general: string;
  realm: string;
  race: Race;
  count: number;
  morale: number; // 0–100
  health: number; // 0–100
  location: string;
  status: BattalionStatus;
}

export interface Commander {
  id: string;
  name: string;
  title: string;
  realm: string;
  parentId: string | null;
}

export interface FoodSupplier {
  id: string;
  name: string;
  location: string;
  availability: AvailabilityLevel;
  dailyProduction: number; // rations/day
  type: 'Grain' | 'Meat' | 'Fish' | 'Fungus' | 'Mixed';
  suppliedTo: string[];
  notes: string;
}

export interface ArmorySupplier {
  id: string;
  name: string;
  location: string;
  dailyProduction: number; // items/day
  specialty: 'Swords' | 'Armor' | 'Siege Weapons' | 'Arrows' | 'Axes' | 'Mixed';
  status: ProductionStatus;
  quality: 'Masterwork' | 'Standard' | 'Crude';
  notes: string;
}

export interface SpyReport {
  id: string;
  codename: string;
  date: string;
  region: string;
  summary: string;
  content: string;
  hasRingIntel: boolean;
  ringDetails?: string;
  urgency: Urgency;
}

export interface CommanderReport {
  id: string;
  commanderId: string;
  commanderName: string;
  commanderTitle: string;
  date: string;
  activities: string;
  achievements: string;
  failures: string;
  progress: number; // 0–100
  status: 'On Track' | 'Delayed' | 'Critical' | 'Completed';
  urgency: Urgency;
}
