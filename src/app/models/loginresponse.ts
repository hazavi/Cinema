export interface  LoginResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
