export interface ResponseEntityPagination<T> {
    pageNo: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    last: boolean;
    content: T[];
  }