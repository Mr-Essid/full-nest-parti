export interface ApiResponse<T> {
  status: boolean;
  data?: T | null;
  message?: string | null;
  errors?: { [key: string]: string[] } | null;
}
