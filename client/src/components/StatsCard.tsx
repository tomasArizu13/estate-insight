import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/5 rounded-xl text-primary">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="text-3xl font-bold font-display text-foreground">{value}</div>
      </div>
    </div>
  );
}
