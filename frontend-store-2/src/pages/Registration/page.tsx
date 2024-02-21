import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";

import { clsx as cx } from "clsx";
import { IconClose } from "~/pages/common/Icons";
import { useAppStore } from "~/stores/stores";
import { useRegister } from "~/pages/Registration/api";
import { parseApiError } from "~/utils/api-error";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export function RegistrationPage() {
  const navigate = useNavigate({ from: "/" });

  const authenticated = useAppStore((s) => s.authenticated);

  useEffect(() => {
    if (authenticated) {
      navigate({ to: "/member" });
    }
  }, [authenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showApiError, setShowApiError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const registerMutation = useRegister({
    onError: () => {
      setShowApiError(true);
    },
  });

  return (
    <div className="px-4 pb-12 pt-8 md:px-12">
      <h2 className="text-2xl font-medium">Create an Account</h2>

      <form
        onSubmit={handleSubmit(
          (v) => {
            registerMutation.mutate({
              email: v.email,
              password: v.password,
            });
          },
          (e) => {},
        )}
        className="mt-8 rounded-md border border-gray-300 px-5 pb-12 pt-5 md:max-w-xl"
      >
        <div>
          <p className="text-sm">
            You will receive confirmation email to your email address associated
            with account. Please make sure to check your incoming email with us.
          </p>
        </div>

        <p className="mt-4 text-right text-sm text-teal-600">Required *</p>

        <div className="mb-6 mt-6">
          {registerMutation.isError && showApiError && (
            <div className="mt-6 flex items-center justify-between rounded-md border border-red-500 bg-red-100 px-4 py-4 text-sm text-red-500">
              <p>{registerApiErrorMessage(registerMutation.error)}</p>
              <div className="flex items-center">
                <button
                  onClick={() => setShowApiError(false)}
                  className="h-5 w-5"
                >
                  <IconClose />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-12">
          <EmailInput
            label="Email address"
            error={formErrors["email"]?.message}
            registration={register("email")}
          />
          <PasswordInput
            label="Password"
            error={formErrors["password"]?.message}
            registration={register("password")}
            showPassword={showPassword}
          />
        </div>
        <ShowPassword
          show={showPassword}
          onChange={(s) => setShowPassword(s)}
          marginTop="mt-4"
        />

        <hr className="mt-8 border-gray-300" />

        <button
          type="submit"
          className="mt-12 w-full rounded-md bg-teal-500 py-2.5 text-sm font-semibold text-white md:w-[240px]"
        >
          Register
        </button>
      </form>
    </div>
  );
}

function EmailInput({
  label,
  registration,
  error,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error: string | undefined;
}) {
  return (
    <div className="items-start text-sm md:flex">
      <div className="basis-[180px]">
        <label htmlFor="" className="text-sm font-medium">
          {label} <span className="text-teal-600">*</span>
        </label>
      </div>
      <div className="mt-1 flex-grow md:mt-0">
        <input
          type="email"
          className={cx(
            "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500",
            {
              "border-red-500": error !== undefined,
            },
          )}
          {...registration}
        />
        <div className="mt-1 h-5">
          {error && <p className="h-5 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  registration,
  showPassword,
  error,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  showPassword: boolean;
  error: string | undefined;
}) {
  return (
    <div className="items-start text-sm md:flex">
      <div className="basis-[180px]">
        <label htmlFor="" className="text-sm font-medium">
          {label} <span className="text-teal-600">*</span>
        </label>
      </div>
      <div className="mt-1 flex-grow md:mt-0">
        <input
          type={showPassword ? "text" : "password"}
          className={cx(
            "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500",
            {
              "border-red-500": error !== undefined,
            },
          )}
          {...registration}
        />
        <div className="mt-1 h-5">
          {error && <p className="h-5 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function ShowPassword(props: {
  marginTop?: string;
  show: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={cx("flex text-sm", props.marginTop)}>
      <input
        id="show-password"
        className="block"
        type="checkbox"
        onChange={(e) => props.onChange(e.target.checked)}
        checked={props.show}
      />
      <label className="ml-1.5 block" htmlFor="show-password">
        Show my password
      </label>
    </div>
  );
}

const registerApiErrorMessage = (registerApiError: unknown) => {
  const e = parseApiError(registerApiError);
  if (e.type === "application") {
    if (
      e.error.details.code === "DB.UNIQUE_VALUE_CONFLICT" &&
      e.error.details.info.entity === "email"
    ) {
      return `The email is already a registered account. Already have an account?`;
    }
    return `An unexpected error had occured`;
  }
  return `An unexpected error had occured`;
};
