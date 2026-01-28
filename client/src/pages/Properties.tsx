import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/PropertyCard";
import { CreatePropertyDialog } from "@/components/CreatePropertyDialog";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Properties() {
  const [search, setSearch] = useState("");
  const { data: properties, isLoading } = useProperties({ search });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your real estate listings</p>
        </div>
        <CreatePropertyDialog />
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties..." 
            className="pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary rounded-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          {properties?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No properties found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
