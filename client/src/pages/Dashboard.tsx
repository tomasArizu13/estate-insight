import { useStats } from "@/hooks/use-dashboard";
import { StatsCard } from "@/components/StatsCard";
import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = useStats();

  // Redirect advisor to properties
  // Note: In real app, check user.role. For MVP schema, user role might be implied or custom field
  // Assuming generic user type for now. If you added role to schema, use it.
  
  if (isLoading) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your real estate operations</p>
        </div>
        <div className="text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={Building2}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Total Value"
          value={`$${Number((stats?.totalValue || 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend="+5.2%"
          trendUp={true}
        />
        <StatsCard
          title="Active Advisors"
          value={stats?.activeAdvisors || 0}
          icon={Users}
          trend="+2"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Market Trends</h3>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
            Chart Placeholder (Install Recharts)
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-secondary/50 rounded-xl transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">New property listed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago by Sarah Agent</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
