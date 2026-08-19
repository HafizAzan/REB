export interface AgentProfile {
  bio: string | null;
  agencyName: string | null;
  experienceYears: number;
  specialties: string[];
}

export interface Agent {
  id: string;
  name: string;
  avatar: string | null;
  agentProfile: AgentProfile | null;
  _count?: { properties: number };
}
