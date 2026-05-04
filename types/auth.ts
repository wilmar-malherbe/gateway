import { User, Session } from '@supabase/supabase-js';

export type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshSession: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<{ error: string | null }>;
}
