export interface PaginationProps {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}
