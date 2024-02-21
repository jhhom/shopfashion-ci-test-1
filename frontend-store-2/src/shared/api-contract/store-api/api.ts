import {
  ServerInferRequest,
  ServerInferResponses,
  initContract,
} from "@ts-rest/core";

import { customersApiContract } from "./customers-api";
import { productsApiContract } from "./products-api";

const c = initContract();

export const apiContract = c.router(
  {
    customers: customersApiContract,
    products: productsApiContract,
  },
  {
    pathPrefix: "/store",
  }
);

type Contract = typeof apiContract;

export type StoreCustomersRequests = ServerInferRequest<Contract["customers"]>;
export type StoreProductsRequests = ServerInferRequest<Contract["products"]>;

export type StoreCustomersResponse = ServerInferResponses<
  Contract["customers"],
  200
>;
export type StoreProductsResponse = ServerInferResponses<
  Contract["products"],
  200
>;
