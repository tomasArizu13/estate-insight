import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          {/* Abstract pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" style={{ backgroundSize: "40px 40px" }}></div>
          {/* real estate stock image with overlay */}
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Skyscraper" 
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
            The intelligent operating system for modern real estate brokerages. Manage properties, agents, and insights in one place.
          </p>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/50">
          © 2024 Propied Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full h-12 text-base font-medium bg-foreground hover:bg-foreground/90 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Log in with Replit
            </Button>
            
            <p className="text-center text-xs text-muted-foreground pt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
