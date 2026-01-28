import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, MessageSquare, Users, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin"; // Assuming role exists on user object from schema/auth customization if needed, else we might default to all access for MVP or check logic

  const navItems = [
    ...(isAdmin ? [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] : []),
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/chat", label: "Assistant", icon: MessageSquare },
    ...(isAdmin ? [{ href: "/advisors", label: "Advisors", icon: Users }] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card/80 backdrop-blur-xl transition-transform md:translate-x-0 -translate-x-full">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Home className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Propied
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer",
                  location === item.href
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    location === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border/40 bg-muted/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg border border-accent/20">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {/* Fallback role if not in type yet */}
                {(user as any)?.role || "Advisor"}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
