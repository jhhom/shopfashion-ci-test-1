import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { dashboardApiContract } from "./dashboard-api";
import { customersApiContract } from "./customers-api";
import { orderApiContract } from "./orders-api";
import { productsApiContract } from "./products-api";
import { productVariantsApiContract } from "./product-variants-api";
import { productAssociationsApiContract } from "./products-api";
import { productOptionsApiContract } from "./product-options-api";
import { taxonApiContract } from "./taxon-api";
import { adminApiContract } from "./admin-api";

const c = initContract();

const breadcrumbApiContract = c.router({
  getBreadcrumbTitleOfRouteParameter: {
    method: "GET",
    path: "/route/:param/breadcrumb_title/:value",
    responses: {
      200: z.object({
        param: z.string(),
        title: z.string().nullable(),
      }),
    },
  },
});

export const adminAuthedApiContract = c.router(
  {
    dashboard: dashboardApiContract,
    customers: customersApiContract,
    orders: orderApiContract,
    products: productsApiContract,
    productAssociations: productAssociationsApiContract,
    productOptions: productOptionsApiContract,
    productVariants: productVariantsApiContract,
    taxons: taxonApiContract,
    breadcrumb: breadcrumbApiContract,
  },
  {
    pathPrefix: "/admin",
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  }
);

export const apiContract = c.router({
  ...adminAuthedApiContract,
  admin: adminApiContract,
});
