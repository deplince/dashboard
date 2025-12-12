// todo: may rename to paginated result or response
export interface PaginationResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
