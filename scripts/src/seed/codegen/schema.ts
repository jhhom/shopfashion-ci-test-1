import { JsonColumns } from "@seed/seed/db-json-schema";
import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, string | number, string | number>;

export type OrderLineItemStatus =
  | "COMPLETED"
  | "PROCESSING"
  | "TO_RECEIVE"
  | "TO_SHIP";

export type OrderStatus = "CANCELLED" | "PAID" | "PENDING_PAYMENT";

export type ProductStatus = "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";

export type ProductType = "CONFIGURABLE" | "SIMPLE";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Admins {
  id: Generated<number>;
  email: string;
  password: string;
  username: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface CustomerCartConfigurableItems {
  customerId: number;
  productVariantId: number;
  quantity: Generated<number>;
  addedAt: Timestamp;
}

export interface CustomerCartSimpleItems {
  customerId: number;
  productId: number;
  quantity: Generated<number>;
  addedAt: Timestamp;
}

export interface Customers {
  id: Generated<number>;
  email: string;
  password: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface KnexMigrations {
  id: Generated<number>;
  name: string | null;
  batch: number | null;
  migrationTime: Timestamp | null;
}

export interface KnexMigrationsLock {
  index: Generated<number>;
  isLocked: number | null;
}

export interface OrderLineConfigurableItems {
  orderId: number;
  productVariantId: number;
  quantity: number;
  unitPrice: Generated<Numeric>;
  orderLineItemStatus: Generated<OrderLineItemStatus>;
}

export interface OrderLineSimpleItems {
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: Generated<Numeric>;
  orderLineItemStatus: Generated<OrderLineItemStatus>;
}

export interface Orders {
  id: Generated<number>;
  customerId: number;
  shippingFee: Generated<Numeric>;
  totalPrice: Generated<Numeric>;
  orderStatus: Generated<OrderStatus>;
  deliveryAddress: JsonColumns["Orders"]["address"];
  createdAt: Generated<Timestamp>;
}

export interface ProductAssociations {
  productAssociationTypeId: number;
  productId: number;
}

export interface ProductAssociationTypes {
  id: Generated<number>;
  typeName: Generated<string>;
  createdAt: Generated<Timestamp>;
}

export interface ProductConfigurableOptions {
  id: Generated<number>;
  productId: number;
  productOptionCode: string;
}

export interface ProductOptions {
  code: string;
  optionName: string;
  position: number;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface ProductOptionValues {
  id: Generated<number>;
  optionCode: string;
  optionValue: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface ProductReviews {
  orderId: number;
  productId: number;
  comment: Generated<string>;
  rating: Generated<number>;
  createdAt: Generated<Timestamp>;
}

export interface Products {
  id: Generated<number>;
  pricing: Generated<Numeric>;
  productName: string;
  productDescription: Generated<string>;
  productType: Generated<ProductType>;
  taxonId: number;
  productStatus: Generated<ProductStatus>;
  productImageUrl: string | null;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface ProductTaxons {
  id: Generated<number>;
  productId: number;
  taxonId: number;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface ProductVariantOptions {
  id: Generated<number>;
  productVariantId: number;
  productOptionValueId: number;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface ProductVariants {
  id: Generated<number>;
  pricing: Generated<Numeric>;
  variantName: string;
  productId: number;
  position: number;
  productStatus: Generated<ProductStatus>;
  productVariantImageUrl: string | null;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface Taxons {
  id: Generated<number>;
  parentId: number | null;
  taxonName: string;
  slug: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface DB {
  admins: Admins;
  customerCartConfigurableItems: CustomerCartConfigurableItems;
  customerCartSimpleItems: CustomerCartSimpleItems;
  customers: Customers;
  knexMigrations: KnexMigrations;
  knexMigrationsLock: KnexMigrationsLock;
  orderLineConfigurableItems: OrderLineConfigurableItems;
  orderLineSimpleItems: OrderLineSimpleItems;
  orders: Orders;
  productAssociations: ProductAssociations;
  productAssociationTypes: ProductAssociationTypes;
  productConfigurableOptions: ProductConfigurableOptions;
  productOptions: ProductOptions;
  productOptionValues: ProductOptionValues;
  productReviews: ProductReviews;
  products: Products;
  productTaxons: ProductTaxons;
  productVariantOptions: ProductVariantOptions;
  productVariants: ProductVariants;
  taxons: Taxons;
}
