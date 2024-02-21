import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { client } from "~/external/api-client/client";

import { stripePromise } from "~/external/stripe/stripe";

import { DeliveryFormSchema } from "~/pages/Checkout/components/delivery-form";
import { OrderSummaryType } from "~/pages/Checkout/components/components";
import { OrderSummary } from "~/pages/Checkout/components/OrderSummary";
import { FormView1 } from "~/pages/Checkout/components/FormView1";
import { FormView2 } from "~/pages/Checkout/components/FormView2";
import { LoadingSpinner } from "~/pages/Checkout/components/LoadingSpinner";
import { useAppStore } from "~/stores/stores";
import { useNavigate } from "@tanstack/react-router";
import { useCheckoutInfo, useCheckoutSession } from "~/pages/Checkout/api";

export function CheckoutPage() {
  const [view, setView] = useState<
    | { view: 1 }
    | {
        view: 2;
        deliveryAddress: DeliveryFormSchema;
        orderSummary: OrderSummaryType;
      }
  >({ view: 1 });

  const authenticated = useAppStore((s) => s.authenticated);

  const navigate = useNavigate({ from: "/" });

  if (!authenticated) {
    navigate({ to: "/login" });
  }

  const checkoutInfoQuery = useCheckoutInfo();

  const requestCheckoutSessionMutation = useCheckoutSession({
    onSuccess: ({ deliveryAddress }) => {
      if (!checkoutInfoQuery.isSuccess) {
        return;
      }
      setView({
        view: 2,
        deliveryAddress,
        orderSummary: checkoutInfoQuery.data.orderSummary,
      });
    },
  });

  const [formState, setFormState] = useState<1 | 2>(1);

  return (
    <div className="px-12 pb-12">
      <h1 className="mt-8 text-2xl font-semibold">Checkout</h1>
      <div className="mt-6 flex flex-col md:flex-row">
        <div className="order-2 mt-8 basis-[640px] md:order-none md:mt-0">
          {view.view === 1 ? (
            <FormView1
              onContinueToPayment={(v) =>
                requestCheckoutSessionMutation.mutate(v)
              }
            />
          ) : (
            <FormView2
              deliveryAddress={view.deliveryAddress}
              orderSummary={view.orderSummary}
              onPayment={async () => {
                const stripe = await stripePromise;
                if (stripe === null) {
                  console.error("Stripe object is null");
                  return;
                }
                if (!requestCheckoutSessionMutation.isSuccess) {
                  return;
                }
                const { error } = await stripe.redirectToCheckout({
                  sessionId:
                    requestCheckoutSessionMutation.data.stripeSessionId,
                });
              }}
            />
          )}
        </div>
        <div className="order-1 flex-grow basis-[calc(100%-640px)] md:order-none md:pl-16">
          {checkoutInfoQuery.isSuccess && (
            <OrderSummary
              orderSummary={checkoutInfoQuery.data.orderSummary}
              orderItems={checkoutInfoQuery.data.orderItems}
            />
          )}
        </div>
      </div>
      {requestCheckoutSessionMutation.isPending ||
        (checkoutInfoQuery.isPending && <LoadingSpinner />)}
    </div>
  );
}
