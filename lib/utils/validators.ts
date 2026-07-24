import { z } from "zod";

export const speciesSchema = z.object({
  name: z
    .string()
    .min(2, "Species name must be at least 2 characters")
    .max(100, "Species name must not exceed 100 characters"),
  description: z.string().optional(),
});

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  farm_name: z.string().optional(),
});

export const orderSchema = z.object({
  name: z.string().min(1, "Order name is required"),
  species_id: z.string().min(1, "Species is required"),
  customer_id: z.string().min(1, "Customer is required"),
  entry_date: z.string().min(1, "Entry date is required"),
  delivery_date: z.string().optional(),
  status: z
    .enum(["pending", "processing", "completed", "rejected"])
    .default("pending"),
  sex: z.enum(["male", "female", "unknown"]).default("unknown"),
  notes: z.string().optional(),
});

export const settingsSchema = z.object({
  office_name: z.string().min(1, "Office name is required"),
  office_address: z.string().optional(),
  office_phone: z.string().optional(),
  office_email: z.string().email("Invalid email").optional().or(z.literal("")),
  logo_url: z.string().optional(),
});

export type SpeciesInput = z.infer<typeof speciesSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
