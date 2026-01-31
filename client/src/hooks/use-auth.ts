import { useAuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const ctx = useAuthContext();
  return {
    user: ctx.user,
    profile: ctx.profile,
    role: ctx.role,
    loading: ctx.loading,
    configured: ctx.configured,
    isAuthenticated: !!ctx.user,
    signOut: ctx.signOut,
  };
}
