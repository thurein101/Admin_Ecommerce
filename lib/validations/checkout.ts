
import * as z from "zod";

export const checkoutSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  postalCode: z.string().min(4, "Postal code must be at least 4 digits"),
  country: z.string().min(2, "Country is required"),
  
  // Fake Credit Card Validation (သရုပ်ပြစစ်ဆေးရုံသာ)
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits (e.g., 4242...)"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiry must be MM/YY"),
  cvc: z.string().regex(/^\d{3}$/, "CVC must be 3 digits"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;