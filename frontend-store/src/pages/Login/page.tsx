import { useEffect, useState } from "react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { IconClose, IconInfo } from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import { useAppStore } from "~/stores/stores";
import { useLocalStorageShoppingCart } from "~/external/browser/local-storage/use-shopping-cart.hook";
import { useLogin } from "~/pages/Login/api";
import { parseApiError } from "~/utils/api-error";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginPage() {
  const store = useAppStore((s) => ({
    authenticated: s.authenticated,
    attemptToCheckoutWhileLoggedOut: s.attemptToCheckoutWhileLoggedOut,
    setAttemptToCheckoutWhileLoggedOut: s.setAttemptToCheckoutWhileLoggedOut,
  }));

  const navigate = useNavigate();

  const [showApiError, setShowApiError] = useState(false);

  const shoppingCart = useLocalStorageShoppingCart();

  const loginMutation = useLogin({
    onError(e) {
      setShowApiError(true);
    },
  });

  useEffect(() => {
    if (store.authenticated) {
      navigate({ to: "/member" });
    }
  }, [store.authenticated, navigate]);

  return (
    <div className="pt-12">
      <div className="border-y border-gray-300 py-8 md:flex">
        <Login
          onSubmit={(v) => {
            const cartItems = shoppingCart.getCartItems();

            loginMutation.mutate({
              email: v.email,
              password: v.password,
              cart: {
                simpleItems: cartItems.simpleItems,
                configurableItems: cartItems.configurableItems,
              },
            });
          }}
          showError={showApiError}
          onCloseErrorPanel={() => setShowApiError(false)}
          hasLoginError={loginMutation.isError}
          loginError={loginMutation.error}
        />
        <CreateAnAccount />
      </div>
    </div>
  );
}

function CreateAnAccount() {
  return (
    <div className="mt-8 basis-1/2 px-4 pt-8 md:mt-0 md:pl-8 md:pr-12 md:pt-0">
      <hr className="border-gray-300 px-4 md:hidden" />
      <h2 className="mt-8 text-2xl font-medium md:mt-0">Create an Account</h2>

      <p className="mt-12 text-sm">
        New customer? Create an account now to go through checkout and complete
        your orders. Register today for free!
      </p>

      <div className="mt-12">
        <Link
          to="/register"
          className="block w-full rounded-md bg-teal-500 py-2.5 text-center text-sm font-semibold text-white md:w-[240px]"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

function Login(props: {
  onSubmit: (v: FormSchema) => void;
  loginError: unknown;
  hasLoginError: boolean;
  showError: boolean;
  onCloseErrorPanel: () => void;
}) {
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="basis-1/2 border-gray-300 px-4 md:border-r md:pl-12 md:pr-8">
      <h2 className="text-2xl font-medium">Customer Login</h2>

      <div className="mt-6 flex rounded-md border border-sky-600 bg-sky-50/50 px-4 pb-4 pt-2.5">
        <div className="flex items-center pr-4">
          <IconInfo className="h-8 w-8 text-sky-700" />
        </div>
        <div>
          <p className="font-semibold text-sky-700">Test credentials</p>
          <div className="mt-1 text-sm font-medium text-sky-800">
            <p>Email: james@email.com</p>
            <p>Password: james123</p>
          </div>
        </div>
      </div>

      <div className="mb-6 mt-8">
        {props.hasLoginError && props.showError && (
          <div className="mt-6 flex items-center justify-between rounded-md border border-red-500 bg-red-100 px-4 py-4 text-sm text-red-500">
            <p>{loginApiErrorMessage(props.loginError)}</p>
            <div className="flex items-center">
              <button onClick={props.onCloseErrorPanel} className="h-5 w-5">
                <IconClose />
              </button>
            </div>
          </div>
        )}
      </div>

      <form
        className="text-sm"
        onSubmit={handleSubmit(
          (v) => {
            props.onSubmit(v);
          },
          (e) => {}
        )}
      >
        <EmailInput
          label="Email Address"
          registration={register("email")}
          error={formErrors["email"]?.message}
          marginTop="mt-10"
        />
        <PasswordInput
          label="Password"
          registration={register("password")}
          showPassword={showPassword}
          error={formErrors["password"]?.message}
          marginTop="mt-6"
        />

        <ShowPassword
          show={showPassword}
          onChange={(v) => setShowPassword(v)}
          marginTop="mt-4"
        />

        <div className="mt-12">
          <button
            type="submit"
            className="w-full rounded-md  bg-teal-500 py-2.5 text-sm font-semibold text-white md:w-[240px]"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

function EmailInput({
  label,
  registration,
  error,
  marginTop,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error: string | undefined;
  marginTop?: string;
}) {
  return (
    <div className={cx("w-full", marginTop)}>
      <label htmlFor="" className="block text-sm font-medium">
        {label} <span className="text-teal-600">*</span>
      </label>
      <input
        type="email"
        className={cx(
          "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500",
          {
            "border-red-500": error !== undefined,
          }
        )}
        {...registration}
      />
      <div className="mt-1 h-5">
        {error && <p className="h-5 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  registration,
  showPassword,
  error,
  marginTop,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  showPassword: boolean;
  error: string | undefined;
  marginTop?: string;
}) {
  return (
    <div className={cx("w-full", marginTop)}>
      <label htmlFor="" className="block text-sm font-medium">
        {label} <span className="text-teal-600">*</span>
      </label>
      <input
        type={showPassword ? "text" : "password"}
        className={cx(
          "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500",
          {
            "border-red-500": error !== undefined,
          }
        )}
        {...registration}
      />
      <div className="mt-1 h-5">
        {error && <p className="h-5 text-sm text-red-500">{error}</p>}
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

const loginApiErrorMessage = (loginApiError: unknown) => {
  const err = parseApiError(loginApiError);
  if (err.type === "application") {
    if (err.error.details.code === "AUTH.INCORRECT_PASSWORD") {
      return `Incorrect password`;
    } else if (err.error.details.code === "RESOURCE_NOT_FOUND") {
      return `Incorrect email address`;
    }
    return `An unexpected error had occured`;
  }
  return `An unexpected error had occured`;
};
