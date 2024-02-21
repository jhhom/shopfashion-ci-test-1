import { clsx as cx } from "clsx";

import * as Tooltip from "@radix-ui/react-tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import {
  DeliveryFormSchema,
  deliveryFormSchema,
} from "~/pages/Checkout/components/delivery-form";

export function FormView1(props: {
  onContinueToPayment: (formValues: DeliveryFormSchema) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors: formErrors },
  } = useForm<DeliveryFormSchema>({
    resolver: zodResolver(deliveryFormSchema),
  });

  return (
    <div>
      <div className="rounded-md border border-gray-300 px-5 py-5 text-sm">
        <p className="text-xl font-semibold">1. Delivery Information</p>

        <div className="mt-6 flex justify-end md:mt-6">
          <Tooltip.Provider delayDuration={400}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => {
                    setValue("fullName", "James Madison");
                    setValue("address1", "04-05 Palm Villa");
                    setValue("address2", "Palm Street");
                    setValue("city", "George Town");
                    setValue("state", "Penang");
                    setValue("postalCode", "01000");
                    setValue("mobilePhone", "6018672455");
                  }}
                  className="w-full rounded-md bg-teal-500 py-2.5 font-semibold text-white md:w-[240px]"
                >
                  Pre-fill with sample values
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="w-[400px] rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm"
                  sideOffset={5}
                >
                  <p>
                    For the convenience of the demo process, click on this
                    button to pre-fill the entire form with sample values and
                    quickly proceed to the next step of the checkout flow.
                  </p>

                  <Tooltip.Arrow
                    style={{ fill: "rgb(243 244 246 / var(--tw-bg-opacity))" }}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <form
          className="mt-8"
          onSubmit={handleSubmit(props.onContinueToPayment)}
        >
          <TextInput
            label="Full Name"
            marginTop="mt-4"
            error={formErrors["fullName"]?.message}
            register={register("fullName")}
          />
          <TextInput
            label="Address 1"
            marginTop="mt-4"
            error={formErrors["address1"]?.message}
            register={register("address1")}
          />
          <TextInput
            label="Address 2"
            marginTop="mt-4"
            error={formErrors["address2"]?.message}
            register={register("address2")}
          />
          <TextInput
            label="City"
            marginTop="mt-4"
            error={formErrors["city"]?.message}
            register={register("city")}
          />
          <TextInput
            label="State"
            marginTop="mt-4"
            error={formErrors["state"]?.message}
            register={register("state")}
          />
          <TextInput
            label="Postal Code"
            marginTop="mt-4"
            error={formErrors["postalCode"]?.message}
            register={register("postalCode")}
          />
          <TextInput
            label="Mobile phone"
            marginTop="mt-4"
            error={formErrors["mobilePhone"]?.message}
            register={register("mobilePhone")}
          />

          <div className="mt-8">
            <button
              type="submit"
              className="w-full rounded-md bg-teal-500 py-2.5 text-sm font-semibold uppercase text-white md:w-[240px]"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
      <DisabledFormTitle marginTop="mt-10" />
    </div>
  );
}

function DisabledFormTitle(props: { marginTop?: string }) {
  return (
    <div
      className={cx(
        "mt-6 rounded-md border border-gray-300 bg-gray-100 px-4 py-4 text-gray-500",
        props.marginTop,
      )}
    >
      <p className="font-semibold">2. Order Summary</p>
    </div>
  );
}

function TextInput(props: {
  label: string;
  marginTop?: string;
  error?: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className={cx("md:flex", props.marginTop)}>
      <label className="block font-medium md:basis-[200px]">
        {props.label}
      </label>
      <div className="flex-grow">
        <input
          type="text"
          className={cx(
            "mt-1 w-full rounded-md border border-gray-300 px-3 py-2",
            {
              "ring-2 ring-red-400": props.error,
            },
          )}
          {...props.register}
        />
        <div className="mt-0.5 h-5">
          {props?.error && (
            <p className="text-[0.8rem] text-red-500">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
