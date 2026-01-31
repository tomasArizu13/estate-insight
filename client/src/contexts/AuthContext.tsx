import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ProfileRole = "admin" | "advisor";

export interface Profile {
  id: string;
  role: ProfileRole;
  full_name?: string | null;
  avatar_url?: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: ProfileRole | null;
  loading: boolean;
  configured: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured;

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[Auth] Error fetching profile:", error.message);
      return null;
    }
    if (!data) return null;
    return {
      id: data.id,
      role: data.role ?? "advisor",
      full_name: data.full_name ?? null,
      avatar_url: data.avatar_url ?? null,
    };
  }, []);

  const setSessionAndProfile = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(session.user);
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
      setLoading(false);
    },
    [fetchProfile]
  );

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionAndProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      await setSessionAndProfile(session);
    });

    return () => subscription.unsubscribe();
  }, [configured, setSessionAndProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
    window.location.href = "/login";
  }, []);

  const role: ProfileRole | null = profile?.role ?? null;

  const value: AuthContextValue = {
    user,
    profile,
    role,
    loading,
    configured,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
