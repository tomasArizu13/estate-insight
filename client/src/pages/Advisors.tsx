import { useUsers } from "@/hooks/use-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShieldAlert, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export default function Advisors() {
  const { data: users, isLoading } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: 'admin' | 'advisor' }) => {
      const url = buildUrl(api.users.updateRole.path, { id });
      const res = await fetch(url, {
        method: api.users.updateRole.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to update role");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.list.path] });
      toast({ title: "Role updated", description: "User permissions have been modified." });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Team Management</h1>
        <p className="text-muted-foreground mt-1">Manage advisors and admin privileges</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <Card key={user.id} className="p-6 flex items-start justify-between hover:shadow-lg transition-shadow border-border">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                {/* Fallback avatar - in real app would use user.profileImageUrl if available */}
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-foreground">{user.username}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="capitalize">
                    {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <ShieldAlert className="w-3 h-3 mr-1" />}
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateRole.mutate({ id: user.id, role: 'admin' })}>
                  Make Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateRole.mutate({ id: user.id, role: 'advisor' })}>
                  Make Advisor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        ))}
      </div>
    </div>
  );
}
