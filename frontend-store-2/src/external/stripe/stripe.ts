import { loadStripe } from "@stripe/stripe-js";
import { CONFIG } from "~/config/config";

const stripePromise = loadStripe(CONFIG.STRIPE.PUBLISHABLE_KEY);

export { stripePromise };
