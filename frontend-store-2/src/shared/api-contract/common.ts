import { z } from "zod";

const baseTaxonSchema = z.object({
  id: z.number(),
  taxonName: z.string(),
  slug: z.string(),
});

export type Taxon = z.infer<typeof baseTaxonSchema> & {
  children: Taxon[];
};

export const zTaxon: z.ZodType<Taxon> = baseTaxonSchema.extend({
  children: z.lazy(() => zTaxon.array()),
});

export const zPurchaseStatusType = z.enum([
  "TO_RECEIVE",
  "COMPLETED",
  "CANCELLED",
]);

export type PurchaseStatusType = z.infer<typeof zPurchaseStatusType>;

export const zProductType = z.enum(["SIMPLE", "CONFIGURABLE"]);

export type ProductType = z.infer<typeof zProductType>;

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/gim;

export const zOrderStatus = z.enum(["PAID", "PENDING_PAYMENT", "CANCELLED"]);

export type OrderStatus = z.infer<typeof zOrderStatus>;

export const zProductStatus = z.enum(["ACTIVE", "ARCHIVED", "OUT_OF_STOCK"]);

export type ProductStatus = z.infer<typeof zProductStatus>;

export type SalesGraphPeriod = "TWO_WEEKS" | "YEAR" | "MONTH";


export const zOrderLineItemStatus = z.enum([
  "COMPLETED",
  "PROCESSING",
  "TO_RECEIVE",
  "TO_SHIP",
]);

export const zOrderDeliveryAddress = z.object({
  fullName: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  mobilePhone: z.string(),
});

export type OrderLineItemStatus = z.infer<typeof zOrderLineItemStatus>;
