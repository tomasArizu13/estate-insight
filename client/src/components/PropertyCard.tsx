import { type Property } from "@shared/schema";
import { MapPin, BedDouble, Bath, Square, MoreHorizontal, Edit, Trash } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDeleteProperty } from "@/hooks/use-properties";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { EditPropertyDialog } from "./EditPropertyDialog";

export function PropertyCard({ property }: { property: Property }) {
  const { mutate: deleteProperty } = useDeleteProperty();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty(property.id, {
        onSuccess: () => {
          toast({ title: "Property deleted", description: "The property has been removed." });
        },
      });
    }
  };

  // Stock images with descriptive comments for Unsplash
  const fallbackImages = [
    // modern luxury villa exterior
    "https://images.unsplash.com/photo-1613977257377-2342dbe271b0?auto=format&fit=crop&q=80&w=800",
    // modern apartment interior living room
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    // cozy suburban house
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
  ];
  const displayImage = property.imageUrls?.[0] || fallbackImages[property.id % fallbackImages.length];

  return (
    <>
      <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground uppercase tracking-wider shadow-sm border border-border/50">
            {property.type}
          </div>
          <div className="absolute top-3 left-3">
             <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm ${
               property.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
               {property.status}
             </span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-2xl font-bold text-primary mb-3 font-display">
            ${Number(property.price).toLocaleString()}
          </p>

          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1.5 text-accent" />
            <span className="truncate">{property.address}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-border/50">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
              <BedDouble className="h-4 w-4 mb-1 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">4 Beds</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
              <Bath className="h-4 w-4 mb-1 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">3 Baths</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
              <Square className="h-4 w-4 mb-1 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">2400 sqft</span>
            </div>
          </div>
          
          <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl" variant="default">
             <Link href={`/properties/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </div>

      <EditPropertyDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        property={property} 
      />
    </>
  );
}
