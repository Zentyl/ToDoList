export interface Task {
    id: number;
    text: string;
    finished: boolean;
    date: Date | null;
    priority: number;
}

export interface NestErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
  email: string;
}