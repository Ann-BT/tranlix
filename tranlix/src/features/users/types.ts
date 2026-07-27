export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface CreateUserInput {
  username: string;
  full_name: string;
}
