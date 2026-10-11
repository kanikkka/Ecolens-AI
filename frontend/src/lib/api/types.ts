export interface ApiStatus {
  status: string;
  service: string;
  version: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface Scan {
  id: number;
  user_id: number;
  image_url: string | null;
  status: string;
  created_at: string;
}
