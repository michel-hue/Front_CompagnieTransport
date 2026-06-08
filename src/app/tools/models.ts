export interface httpJsonResponse {
  count?: number;
  page?: number;
  message?: string;
  data?: any;
  error?: boolean;
}

export interface DataResponse<T> {
  hasError?: boolean;
  count?: number;
  items?: T[];
  item?: T;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

