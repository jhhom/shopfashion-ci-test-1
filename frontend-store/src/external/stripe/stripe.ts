import { loadStripe } from "@stripe/stripe-js";
import { config } from "~/config/config";
import { STRIPE_PUBLISHABLE_KEY } from "~/config/stripe-config";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export { stripePromise };
