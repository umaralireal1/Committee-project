export interface Member {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  hasReceivedPot: boolean; // "Out list" / Winner status
  receivedDate?: string;
  avatarSeed: string;
}

export interface PaymentRecord {
  memberId: string;
  cycleId: string;
  status: 'PAID' | 'UNPAID';
  datePaid?: string;
}

export interface Cycle {
  id: string; // e.g., "2023-10" or "Cycle 1"
  label: string;
  startDate: string;
  winnerId?: string; // The person who took the pot this cycle
  isCompleted: boolean;
}

export interface AppSettings {
  installmentAmount: number; // The "Qist" amount
  currency: string;
  committeeName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export type ViewState = 'DASHBOARD' | 'MEMBERS' | 'PAYMENTS' | 'SETTINGS' | 'AI_ADVISOR';
