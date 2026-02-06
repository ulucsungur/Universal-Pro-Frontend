// frontend/src/types/admin.ts

import type { PerformanceData, User } from './auth';

// 🚀 TS FIX: User tipini buradan da dışarı açıyoruz
export type { User };

export interface AgentPerformance extends PerformanceData {
  agent: User;
  totalRevenue: number;
}

export interface AdminGlobalStats {
  totalUsers: number;
  totalListings: number;
  totalRevenue: number;
  // 🚀 TS FIX: Health alanı buraya mühürlendi
  health: {
    odr: string;
    score: string; //
    status: 'Healthy' | 'At Risk';
  };
  topAgents: AgentPerformance[];
  financeData: Record<string, string | number>[];
}
