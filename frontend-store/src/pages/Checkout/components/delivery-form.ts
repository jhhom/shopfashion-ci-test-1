import { z } from "zod";

export const deliveryFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address1: z.string().min(1, "Address 1 is required"),
  address2: z.string().min(1, "Address 2 is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  mobilePhone: z.string().min(1, "Mobile phone is required"),
});

export type DeliveryFormSchema = z.infer<typeof deliveryFormSchema>;
