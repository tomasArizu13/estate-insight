import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProperty } from "@/hooks/use-properties";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, type InsertProperty, type Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface EditPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
}

export function EditPropertyDialog({ open, onOpenChange, property }: EditPropertyDialogProps) {
  const { toast } = useToast();
  const updateProperty = useUpdateProperty();
  
  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
      type: property.type,
      status: property.status,
    }
  });

  const onSubmit = (data: InsertProperty) => {
    updateProperty.mutate({ id: property.id, ...data }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Property updated successfully" });
        onOpenChange(false);
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Property</DialogTitle>
          <DialogDescription>
            Update details for {property.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" {...form.register("price")} className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={property.status}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} className="rounded-xl min-h-[100px]" />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={updateProperty.isPending} className="w-full rounded-xl mt-2">
              {updateProperty.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
