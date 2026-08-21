export interface BuyerVisit {
  id: string;
  status: string;
  scheduledAt: string;
  property: { title: string; slug: string; city: string };
}

export interface AgentVisit {
  id: string;
  status: string;
  scheduledAt: string;
  user: { name: string; email: string };
  property: { title: string; slug: string };
}
