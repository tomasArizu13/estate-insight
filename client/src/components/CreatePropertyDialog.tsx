import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateProperty } from "@/hooks/use-properties";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, type InsertProperty } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus } from "lucide-react";

export function CreatePropertyDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createProperty = useCreateProperty();
  
  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      address: "",
      type: "sale",
      status: "available",
    }
  });

  const onSubmit = (data: InsertProperty) => {
    createProperty.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Property created successfully" });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast({ 
          title: "Error", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New Property</DialogTitle>
          <DialogDescription>
            Add a new listing to the dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Modern Villa in..." className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" {...form.register("price")} className="rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(val) => form.setValue("type", val)} defaultValue={form.getValues("type")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
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
            <Button type="submit" disabled={createProperty.isPending} className="w-full rounded-xl mt-2">
              {createProperty.isPending ? "Creating..." : "Create Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
