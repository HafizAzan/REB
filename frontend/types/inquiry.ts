export interface BuyerInquiry {
  id: string;
  status: string;
  message: string;
  createdAt: string;
  property: { title: string; slug: string; city: string };
}

export interface AgentInquiry {
  id: string;
  status: string;
  name: string;
  message: string;
  property: { title: string; slug: string };
}
