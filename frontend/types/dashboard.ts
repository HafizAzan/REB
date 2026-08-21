export interface ChartPoint {
  label: string;
  value: number;
}

export interface BuyerDashboard {
  favorites: number;
  inquiries: number;
  visits: number;
  inquiriesByStatus: Record<string, number>;
  visitsByStatus: Record<string, number>;
  activity: {
    inquiries: ChartPoint[];
    visits: ChartPoint[];
    favorites: ChartPoint[];
  };
}
