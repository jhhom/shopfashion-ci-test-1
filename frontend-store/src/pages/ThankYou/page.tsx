import { Link } from "@tanstack/react-router";

export function ThankYouPage() {
  return (
    <div>
      <div className="pt-16 text-center">
        <p className="text-3xl font-bold uppercase">THANK YOU</p>
        <p className="mt-2 text-gray-500">
          Thank you for shopping. We have received your order.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/"
            className="block w-[300px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 py-2.5 font-bold uppercase text-white"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
