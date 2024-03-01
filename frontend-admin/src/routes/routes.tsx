import { Outlet, Router, useRouter } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { HomePage } from "~/pages/Home/layout";
import { ProductsPage } from "~/pages/Products/layout";
import { OptionsPage } from "~/pages/Options/layout";
import { EditTaxonPage } from "~/pages/Taxons/EditTaxon/page";
import { CreateTaxonUnderParentPage } from "~/pages/Taxons/CreateTaxonUnderParent/page";
import { TaxonsPage } from "~/pages/Taxons/layout";
import { ProductOptionsListingPage } from "~/pages/Options/ProductOptionsListing/page";
import { CreateProductOptionPage } from "~/pages/Options/CreateProductOption/page";
import { EditProductOptionPage } from "~/pages/Options/EditProductOption/page";

import {
  ProductListingByTaxonPage,
  ProductListingPage,
} from "~/pages/Products/ProductListing/page";
import { EditProductPage } from "~/pages/Products/EditProduct/page";
import { CreateSimpleProductPage } from "~/pages/Products/CreateSimpleProduct/page";
import { CreateConfigurableProductPage } from "~/pages/Products/CreateConfigurableProduct/page";
import { CreateProductVariantPage } from "~/pages/Products/CreateProductVariant/page";
import { ProductVariantListingPage } from "~/pages/Products/ProductVariantListing/page";
import { EditProductVariantPage } from "~/pages/Products/EditProductVariant/page";
import { GenerateProductVariantsPage } from "~/pages/Products/GenerateProductVariants3/page";
import { CreateTaxon2Page } from "~/pages/Taxons/CreateTaxon/page";
import { OrdersPage } from "~/pages/Orders/layout";
import { OrdersListingPage } from "~/pages/Orders/OrdersListing/page";
import { OrderDetailsPage } from "~/pages/Orders/OrderDetails/page";
import { CustomersPage } from "~/pages/Customers/layout";
import { CustomersListingPage } from "~/pages/Customers/CustomersListing/page";
import { ProductAssociationsPage } from "~/pages/ProductAssociations/layout";
import { ProductAssociationsListingPage } from "~/pages/ProductAssociations/ProductAssociationsListing/page";
import { CreateProductAssociationPage } from "~/pages/ProductAssociations/CreateProductAssociation/page";
import { EditProductAssociationPage } from "~/pages/ProductAssociations/EditProductAssociation/page";
import { CatchAllPage } from "~/pages/CatchAll/page";

import type { BreadcrumbModifier } from "~/pages/common/components/Breadcrumb/breadcrumb-generator";

import { ProductDetailsPage } from "~/pages/Products/ProductDetails/page";
import { CustomerDetailsPage } from "~/pages/Products/CustomerDetails/page";
import { LoginPage } from "~/pages/Login/page";
import {
  createRoute,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

// Create a root route
function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: Root,
  notFoundComponent: CatchAllPage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

export const routes = {
  taxon: createRoute({
    getParentRoute: () => indexRoute,
    path: "/taxon",
    component: TaxonsPage,
  }),
  products: createRoute({
    getParentRoute: () => indexRoute,
    path: "/products",
    component: ProductsPage,
  }),
  options: createRoute({
    getParentRoute: () => indexRoute,
    path: "/options",
    component: OptionsPage,
  }),
  orders: createRoute({
    getParentRoute: () => indexRoute,
    path: "/orders",
    component: OrdersPage,
  }),
  customers: createRoute({
    getParentRoute: () => indexRoute,
    path: "/customers",
    component: CustomersPage,
  }),
  productAssociations: createRoute({
    getParentRoute: () => indexRoute,
    path: "/product-associations",
    component: ProductAssociationsPage,
  }),
};

export const subRoutes = {
  taxon: {
    edit: createRoute({
      getParentRoute: () => routes.taxon,
      path: "$taxonId/edit",
      component: EditTaxonPage,
    }),
    new: createRoute({
      getParentRoute: () => routes.taxon,
      path: "new",
      component: CreateTaxon2Page,
      // Breadcrumbs
      //
    }),
    newUnderParent: createRoute({
      getParentRoute: () => routes.taxon,
      path: "new/$taxonId",
      component: CreateTaxonUnderParentPage,
    }),
  },

  options: {
    home: createRoute({
      getParentRoute: () => routes.options,
      path: "/",
      component: ProductOptionsListingPage,
    }),
    new: createRoute({
      getParentRoute: () => routes.options,
      path: "/new",
      component: CreateProductOptionPage,
    }),
    edit: createRoute({
      getParentRoute: () => routes.options,
      path: "/$optionCode/edit",
      component: EditProductOptionPage,
    }),
  },
  product: {
    /* PRODUCT */
    listing: createRoute({
      getParentRoute: () => routes.products,
      path: "/",
      component: ProductListingPage,
    }),
    listingByTaxon: createRoute({
      getParentRoute: () => routes.products,
      path: "/taxon/$taxonId",
      component: ProductListingByTaxonPage,
    }),
    edit: createRoute({
      getParentRoute: () => routes.products,
      path: "/$productId/edit",
      component: EditProductPage,
    }),
    details: createRoute({
      getParentRoute: () => routes.products,
      path: "/$productId",
      component: ProductDetailsPage,
    }),
    newSimple: createRoute({
      getParentRoute: () => routes.products,
      path: "/new/simple",
      component: CreateSimpleProductPage,
    }),
    newConfigurable: createRoute({
      getParentRoute: () => routes.products,
      path: "/new/configurable",
      component: CreateConfigurableProductPage,
    }),

    /* PRODUCT VARIANT */
    variantListing: createRoute({
      getParentRoute: () => routes.products,
      path: "$productId/variants",
      component: ProductVariantListingPage,
    }),
    newProductVariant: createRoute({
      getParentRoute: () => routes.products,
      path: "$productId/variants/new",
      component: CreateProductVariantPage,
    }),
    editVariant: createRoute({
      getParentRoute: () => routes.products,
      path: "/$productId/variants/$productVariantId/edit",
      component: EditProductVariantPage,
    }),
    generateProductVariant: createRoute({
      getParentRoute: () => routes.products,
      path: "$productId/variants/generate",
      component: GenerateProductVariantsPage,
    }),
  },

  productAssociations: {
    listing: createRoute({
      getParentRoute: () => routes.productAssociations,
      path: "/",
      component: ProductAssociationsListingPage,
    }),
    new: createRoute({
      getParentRoute: () => routes.productAssociations,
      path: "/new",
      component: CreateProductAssociationPage,
    }),
    edit: createRoute({
      getParentRoute: () => routes.productAssociations,
      path: "/$productAssociationTypeId/edit",
      component: EditProductAssociationPage,
    }),
  },

  orders: {
    listing: createRoute({
      getParentRoute: () => routes.orders,
      path: "/",
      component: OrdersListingPage,
    }),
    order: createRoute({
      getParentRoute: () => routes.orders,
      path: "$orderId",
      component: OrderDetailsPage,
    }),
  },

  customers: {
    listing: createRoute({
      getParentRoute: () => routes.customers,
      path: "/",
      component: CustomersListingPage,
    }),
    details: createRoute({
      getParentRoute: () => routes.customers,
      path: "/$customerId",
      component: CustomerDetailsPage,
    }),
  },
};

export const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/*",
  component: CatchAllPage,
  beforeLoad: async () => {
    /*
    const isAuthenticated = useAppStore.getState().profile.profile !== null;
    if (!isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
    */
  },
});

// Create the route tree using your routes
export const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute.addChildren([
    routes.products.addChildren([
      subRoutes.product.listing,
      subRoutes.product.listingByTaxon,
      subRoutes.product.edit,
      subRoutes.product.newConfigurable,
      subRoutes.product.newSimple,
      subRoutes.product.newProductVariant,
      subRoutes.product.variantListing,
      subRoutes.product.editVariant,
      subRoutes.product.generateProductVariant,
      subRoutes.product.details,
    ]),
    routes.options.addChildren([
      subRoutes.options.home,
      subRoutes.options.new,
      subRoutes.options.edit,
    ]),
    routes.taxon.addChildren([
      subRoutes.taxon.edit,
      subRoutes.taxon.new,
      subRoutes.taxon.newUnderParent,
    ]),
    routes.orders.addChildren([
      subRoutes.orders.listing,
      subRoutes.orders.order,
    ]),
    routes.productAssociations.addChildren([
      subRoutes.productAssociations.listing,
      subRoutes.productAssociations.new,
      subRoutes.productAssociations.edit,
    ]),
    routes.customers.addChildren([
      subRoutes.customers.listing,
      subRoutes.customers.details,
    ]),
  ]),
  catchAllRoute,
]);

export const routeBreadcrumbModifiers = new Map<string, BreadcrumbModifier>();

// if we don't add these in a setTimeout, the `subRoutes.[some-route].id` will be undefined
setTimeout(() => {
  const modifiers: [string, BreadcrumbModifier][] = [
    [
      subRoutes.product.listingByTaxon.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.product.newSimple.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
        removeCrumbs: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.product.newConfigurable.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
        removeCrumbs: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.product.editVariant.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.options.edit.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.taxon.edit.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
        replaceLinks: {
          type: "start",
          links: [
            {
              idx: 1,
              link: "/taxon/new",
            },
          ],
        },
      },
    ],
    [
      subRoutes.taxon.new.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.taxon.newUnderParent.id,
      {
        replaceLinks: {
          type: "start",
          links: [
            {
              idx: 1,
              link: "/taxon/new",
            },
          ],
        },
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
    [
      subRoutes.productAssociations.edit.id,
      {
        removeLinks: {
          type: "end",
          idx: [1],
        },
      },
    ],
  ];

  for (const [id, modifier] of modifiers) {
    routeBreadcrumbModifiers.set(id, modifier);
  }
}, 0);

export const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  /*
  interface RouteMeta {
    boom?: string;
  }
  */
}
