import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { z } from "zod";
import { clsx as cx } from "clsx";

import { useAppStore } from "~/stores/stores";
import { HomePage } from "~/pages/Home/page";

import { RootLayout } from "~/pages/layouts/Root.layout/Root.layout";
import { UserLoginRootLayout } from "~/pages/layouts/UserLogin.layout";
import { ECommerceRootLayout } from "~/pages/layouts/ECommerce.layout";

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
import { Page404Page } from "~/pages/Page404/page";
import { SearchPage } from "~/pages/Search/page";

const rootRoute = new RootRoute({
  component: RootLayout,
});

const rootRoutes = {
  eCommerce: new Route({
    id: "e-commerce",
    getParentRoute: () => rootRoute,
    path: "/",
    component: ECommerceRootLayout,
  }),
  userLogin: new Route({
    id: "user-login",
    getParentRoute: () => rootRoute,
    path: "/",
    component: UserLoginRootLayout,
  }),
};

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
    index: new Route({
      id: "home",
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/",
      component: HomePage,
    }),
    productListingByTaxon: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/products/*",
      component: ProductListingByTaxonPage,
      validateSearch: (
        search: Record<string, unknown>,
      ): ProductListingFilter => {
        return productListingFilterSchema.parse(search);
      },
    }),
    productDetails: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/product/$productId",
      component: ProductDetailsPage,
      validateSearch: (search: Record<string, unknown>) => {
        return productDetailsSearchSchema.parse(search);
      },
    }),
    productReviews: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/product/$productId/reviews",
      component: ProductReviewsPage,
    }),
    search: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/search",
      component: SearchPage,
      validateSearch: (search: Record<string, unknown>): ProductSearch => {
        return productSearchSchema.parse(search);
      },
    }),
    shoppingCart: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/cart",
      component: ShoppingCartPage,
    }),
    membership: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/member",
      component: MembershipPage,
      beforeLoad: async () => {
        /*
        const isAuthenticated = useAppStore.getState().authenticated;

        // alert("MEMBER???: " + isAuthenticated);
        useAppStore.setState({ navigateTo: "/member" });

        if (!isAuthenticated) {
          throw redirect({
            to: "/login",
          });
        }
        */
      },
    }),
    checkout: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/checkout",
      component: CheckoutPage,
    }),
    thankyou: new Route({
      getParentRoute: () => rootRoutes.eCommerce,
      path: "/thank-you",
      component: ThankYouPage,
    }),
  },
  userLogin: {
    login: new Route({
      getParentRoute: () => rootRoutes.userLogin,
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
    register: new Route({
      getParentRoute: () => rootRoutes.userLogin,
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
  profile: new Route({
    getParentRoute: () => routes.site.membership,
    path: "/",
    component: ProfileSubpage,
  }),
  purchaseHistory: new Route({
    getParentRoute: () => routes.site.membership,
    path: "/purchases",
    component: PurchaseHistorySubpage,
    validateSearch: (
      search: Record<string, unknown>,
    ): PurchaseHistoryFilter => {
      return purchaseHistoryFilterSchema.parse(search);
    },
  }),
};

export const catchAllRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/*",
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
  rootRoutes.userLogin.addChildren([
    routes.userLogin.login,
    routes.userLogin.register,
  ]),
  rootRoutes.eCommerce.addChildren([
    routes.site.index,
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
  ]),
  catchAllRoute,
]);

export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
