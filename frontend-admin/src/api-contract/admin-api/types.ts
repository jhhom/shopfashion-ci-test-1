import { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";
import { apiContract } from "./api";

type Contract = typeof apiContract;

export type AdminDashboardRequests = ServerInferRequest<Contract["dashboard"]>;
export type AdminCustomersRequests = ServerInferRequest<Contract["customers"]>;
export type AdminOrdersRequests = ServerInferRequest<Contract["orders"]>;
export type AdminProductsRequests = ServerInferRequest<Contract["products"]>;
export type AdminProductVariantRequests = ServerInferRequest<
  Contract["productVariants"]
>;
export type AdminProductAssociationsRequests = ServerInferRequest<
  Contract["productAssociations"]
>;
export type AdminProductOptionsRequests = ServerInferRequest<
  Contract["productOptions"]
>;
export type AdminTaxonsRequests = ServerInferRequest<Contract["taxons"]>;
export type AdminBreadcrumbRequests = ServerInferRequest<
  Contract["breadcrumb"]
>;

export type AdminDashboardResponse = ServerInferResponses<
  Contract["dashboard"],
  200
>;
export type AdminCustomersResponse = ServerInferResponses<
  Contract["customers"],
  200
>;
export type AdminOrdersResponse = ServerInferResponses<Contract["orders"], 200>;
export type AdminProductsResponse = ServerInferResponses<
  Contract["products"],
  200
>;
export type AdminProductVariantResponse = ServerInferResponses<
  Contract["productVariants"],
  200
>;
export type AdminProductAssociationsResponse = ServerInferResponses<
  Contract["productAssociations"],
  200
>;
export type AdminProductOptionsResponse = ServerInferResponses<
  Contract["productOptions"],
  200
>;
export type AdminTaxonsResponse = ServerInferResponses<Contract["taxons"], 200>;
export type AdminBreadcrumbResponse = ServerInferResponses<
  Contract["breadcrumb"],
  200
>;
