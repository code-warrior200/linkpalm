export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

