import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { z } from "zod";

import { useAppStore } from "~/stores/stores";
import { HomePage } from "~/pages/Home/page";

import { AppRootLayout } from "~/pages/layouts/ECommerce.layout";

import { ProductListingByTaxonPage } from "~/pages/ProductListingByTaxon/page";
import { ProductDetailsPage } from "~/pages/ProductDetails/page";
import { LoginPage } from "~/pages/Login/page";
import { RegistrationPage } from "~/pages/Registration/page";
import { ShoppingCartPage } from "~/pages/ShoppingCart/page";
import { MembershipPage } from "~/pages/Membership/page";
import { CheckoutPage } from "~/pages/Checkout/page";
import { ThankYouPage } from "~/pages/ThankYou/page";
import { ProfileSubpage } from "~/pages/Membership/Profile/page";
import { PurchaseHistorySubpage } from "~/pages/Membership/PurchaseHistory/page";
import { ProductReviewsPage } from "~/pages/ProductReviews/page";
import { Page404Page, Page404WithLayoutPage } from "~/pages/Page404/page";
import { SearchPage } from "~/pages/Search/page";

const rootRoute = createRootRoute({
  component: AppRootLayout,
  notFoundComponent: Page404WithLayoutPage,
});

const productListingFilterSchema = z.object({
  price_min: z.number().optional().catch(undefined),
  price_max: z.number().optional().catch(undefined),
  sort_price: z.enum(["asc", "desc"]).optional().catch(undefined),
});

const productDetailsSearchSchema = z.object({
  from_taxon: z.string().optional().catch(""),
});

type ProductListingFilter = z.infer<typeof productListingFilterSchema>;

const routes = {
  site: {
    home: createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: HomePage,
    }),
    productReviews: createRoute({
      getParentRoute: () => rootRoute,
      path: "/product/$productId/reviews",
      component: ProductReviewsPage,
    }),
    productDetails: createRoute({
      getParentRoute: () => rootRoute,
      path: "/product/$productId",
      component: ProductDetailsPage,
      validateSearch: (search: Record<string, unknown>) => {
        return productDetailsSearchSchema.parse(search);
      },
    }),
    productListingByTaxon: createRoute({
      getParentRoute: () => rootRoute,
      path: "/products/*",
      component: ProductListingByTaxonPage,
      validateSearch: (
        search: Record<string, unknown>
      ): ProductListingFilter => {
        return productListingFilterSchema.parse(search);
      },
    }),
    search: createRoute({
      getParentRoute: () => rootRoute,
      path: "/search",
      component: SearchPage,
      validateSearch: (search: Record<string, unknown>): ProductSearch => {
        return productSearchSchema.parse(search);
      },
    }),
    shoppingCart: createRoute({
      getParentRoute: () => rootRoute,
      path: "/cart",
      component: ShoppingCartPage,
    }),
    membership: createRoute({
      getParentRoute: () => rootRoute,
      path: "/member",
      component: MembershipPage,
    }),
    checkout: createRoute({
      getParentRoute: () => rootRoute,
      path: "/checkout",
      component: CheckoutPage,
    }),
    thankyou: createRoute({
      getParentRoute: () => rootRoute,
      path: "/thank-you",
      component: ThankYouPage,
    }),
  },
  userLogin: {
    login: createRoute({
      getParentRoute: () => rootRoute,
      path: "/login",
      component: LoginPage,
      beforeLoad: async () => {
        /*
        const isAuthenticated = useAppStore.getState().authenticated;
        // alert("IS AUTHENTICATED: " + isAuthenticated);
        if (isAuthenticated) {
          throw redirect({
            to: "/member",
          });
        }
        */
      },
    }),
    register: createRoute({
      getParentRoute: () => rootRoute,
      path: "/register",
      component: RegistrationPage,
      beforeLoad: async () => {
        /*
        const isAuthenticated = useAppStore.getState().authenticated;
        // alert("IS AUTHENTICATED: " + isAuthenticated);

        if (isAuthenticated) {
          throw redirect({
            to: "/member",
          });
        }
        */
      },
    }),
  },
};

const productSearchSchema = z.object({
  search: z.string().catch(""),
});

type ProductSearch = z.infer<typeof productSearchSchema>;

const purchaseHistoryFilterSchema = z.object({
  status: z.enum(["TO_RECEIVE", "COMPLETED", "CANCELLED"]).catch("TO_RECEIVE"),
});

type PurchaseHistoryFilter = z.infer<typeof purchaseHistoryFilterSchema>;

export const membershipSubroutes = {
  profile: createRoute({
    getParentRoute: () => routes.site.membership,
    path: "/",
    component: ProfileSubpage,
  }),
  purchaseHistory: createRoute({
    getParentRoute: () => routes.site.membership,
    path: "/purchases",
    component: PurchaseHistorySubpage,
    validateSearch: (
      search: Record<string, unknown>
    ): PurchaseHistoryFilter => {
      return purchaseHistoryFilterSchema.parse(search);
    },
  }),
};

export const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: Page404Page,
  beforeLoad: async () => {
    const isAuthenticated = useAppStore.getState().authenticated;
    /*
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
  routes.site.home,
  routes.site.productReviews,
  routes.site.productListingByTaxon,
  routes.site.productDetails,
  routes.site.shoppingCart,
  routes.site.search,
  routes.site.membership.addChildren([
    membershipSubroutes.profile,
    membershipSubroutes.purchaseHistory,
  ]),
  routes.site.checkout,
  routes.site.thankyou,
  routes.userLogin.login,
  routes.userLogin.register,
  catchAllRoute,
]);

export const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
