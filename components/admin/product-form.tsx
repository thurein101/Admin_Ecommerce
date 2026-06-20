"use client";

import { useForm, type Resolver } from "react-hook-form";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { toast } from "sonner"; 

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProductAction, updateProductAction } from "@/lib/actions/product";
import { ImageUpload } from "./image-upload";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  initialData?: any; 
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: initialData?.images || [],
    },
  });

  async function onSubmit(data: ProductFormValues) {
    startTransition(async () => {
      const result = initialData 
        ? await updateProductAction(initialData.id, data) 
        : await createProductAction(data);
      
      if (result?.error) {
        toast.error("Error", { description: result.error });
      } else {
        toast.success(initialData ? "Product updated successfully." : "Product created successfully.");
        router.push("/admin/products");
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {/* Header Section */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {initialData ? "Edit Product" : "New Product"}
          </h2>
          <p className="text-gray-500 mt-1">Fill in the details to {initialData ? "update" : "publish"} your product.</p>
        </div>

        {/* Section 1: Product Identity */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-900">Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    onRemove={(urlToRemove) => field.onChange(field.value.filter((url: string) => url !== urlToRemove))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input className="h-12 bg-gray-50/50" placeholder="e.g. MacBook Pro" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea className="min-h-[120px] bg-gray-50/50" placeholder="Product details..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 2: Logistics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl><Input className="h-12 bg-gray-50/50" type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory</FormLabel>
                  <FormControl><Input className="h-12 bg-gray-50/50" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} /></FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input className="h-12 bg-gray-50/50" placeholder="e.g. Electronics" {...field} /></FormControl>
              </FormItem>
            )}
          />
        </div>
<div className=" flex justify-end">
   {/* Footer Action */}
        <Button type="submit" disabled={isPending} className="h-14  rounded-2xl text-sm font-semibold shadow-xl ">
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Publish Product"}
        </Button>
</div>
       
      </form>
    </Form>
  );
}