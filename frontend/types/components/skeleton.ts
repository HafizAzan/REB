export interface SkeletonProps {
  className?: string;
}

export interface PropertyGridSkeletonProps {
  count?: number;
  columns?: 2 | 3;
  className?: string;
}

export interface AgentGridSkeletonProps {
  count?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export interface ListRowsSkeletonProps {
  rows?: number;
  className?: string;
}
