import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, Profile } from '@/types/auth';
import { User, Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setLoading(false);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        (async () => {
          await fetchProfile(newSession.user.id);
        })();
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    // The redirect URL must be added to Supabase Dashboard:
    // Authentication > URL Configuration > Redirect URLs
    // Add: project://reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'project://reset-password',
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const refreshSession = useCallback(async () => {
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
    setSession(refreshedSession);
    setUser(refreshedSession?.user ?? null);
  }, []);

  const updateProfile = useCallback(async (data: { first_name?: string; last_name?: string }) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...data }, { onConflict: 'id' });

    if (error) {
      return { error: error.message };
    }

    setProfile((prev) => prev
      ? { ...prev, ...data }
      : { id: user.id, first_name: data.first_name ?? '', last_name: data.last_name ?? '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    );
    return { error: null };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        initialized,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshSession,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
