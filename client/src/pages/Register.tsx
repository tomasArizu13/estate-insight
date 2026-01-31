import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-background">
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
          <div className="relative z-10">
            <span className="font-display text-2xl font-bold">Propied</span>
          </div>
          <div className="relative z-10 text-sm text-primary-foreground/50">
            © 2024 Propied Inc. All rights reserved.
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4 rounded-lg border border-destructive/50 bg-destructive/5 p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Faltan variables de entorno
            </h2>
            <p className="text-sm text-muted-foreground">
              Añade <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu{" "}
              <code className="rounded bg-muted px-1">.env</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-background">
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
          <div className="relative z-10">
            <span className="font-display text-2xl font-bold">Propied</span>
          </div>
          <div className="relative z-10 text-sm text-primary-foreground/50">
            © 2024 Propied Inc. All rights reserved.
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Revisa tu correo
            </h2>
            <p className="text-muted-foreground">
              Te enviamos un enlace a <strong>{email}</strong> para confirmar tu cuenta.
              Haz clic en el enlace y luego inicia sesión.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Ir a iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <div
            className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
            style={{ backgroundSize: "40px 40px" }}
          />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-accent p-2 rounded-lg">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-bold">Propied</span>
          </div>
          <h1 className="font-display text-6xl font-bold leading-tight mb-6">
            Real Estate <br />
            <span className="text-accent">Redefined.</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Crea tu cuenta para acceder al dashboard y gestionar propiedades.
          </p>
        </div>
        <div className="relative z-10 text-sm text-primary-foreground/50">
          © 2024 Propied Inc. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Crear usuario
            </h2>
            <p className="mt-2 text-muted-foreground">
              Regístrate con tu email para acceder a la plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="h-12 rounded-xl"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium rounded-xl"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
