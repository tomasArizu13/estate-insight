import { useProperty } from "@/hooks/use-properties";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, BedDouble, Bath, Square, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetails() {
  const [, params] = useRoute("/properties/:id");
  const id = Number(params?.id);
  const { data: property, isLoading } = useProperty(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
             <Skeleton className="h-12 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) return <div>Not found</div>;

  // Stock images fallback again
  const fallbackImages = [
    "https://images.unsplash.com/photo-1613977257377-2342dbe271b0?auto=format&fit=crop&q=80&w=2000",
  ];
  const displayImage = property.imageUrls?.[0] || fallbackImages[0];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Link href="/properties">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>
      </Link>

      <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <img src={displayImage} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <div className="flex gap-2 mb-4">
             <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
               {property.type}
             </span>
             <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${
               property.status === 'available' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
             }`}>
               {property.status}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-white/90">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{property.address}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-display font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                <BedDouble className="h-6 w-6 mb-2 text-primary" />
                <span className="font-bold text-foreground">4</span>
                <span className="text-xs text-muted-foreground uppercase">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                <Bath className="h-6 w-6 mb-2 text-primary" />
                <span className="font-bold text-foreground">3</span>
                <span className="text-xs text-muted-foreground uppercase">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                <Square className="h-6 w-6 mb-2 text-primary" />
                <span className="font-bold text-foreground">2,400</span>
                <span className="text-xs text-muted-foreground uppercase">Sq Ft</span>
              </div>
               <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl">
                <Calendar className="h-6 w-6 mb-2 text-primary" />
                <span className="font-bold text-foreground">2023</span>
                <span className="text-xs text-muted-foreground uppercase">Built</span>
              </div>
            </div>
            <h2 className="text-xl font-display font-bold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-lg sticky top-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Listing Price</p>
            <div className="text-4xl font-display font-bold text-primary mb-6">
              ${Number(property.price).toLocaleString()}
            </div>
            
            <Button className="w-full h-12 text-lg rounded-xl mb-3" size="lg">
              Contact Agent
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg rounded-xl">
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
