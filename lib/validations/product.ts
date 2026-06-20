
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().min(0, { message: "Stock cannot be negative." }),
  images: z.array(z.string().url()).min(1, { message: "At least one image is required." }),
});

export type ProductFormValues = z.infer<typeof productSchema>;