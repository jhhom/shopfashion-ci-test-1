import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { useLogin } from "~/pages/Login/api";
import { IconInfo } from "~/pages/common/Icons";
import { Form } from "~/pages/common/components/Form/Form";
import { InputField } from "~/pages/common/components/Form/InputField";
import { useUser } from "~/providers/user";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useUser();

  const loginMutation = useLogin();

  useEffect(() => {
    if (user !== null) {
      navigate({ to: "/" });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="-mt-24 w-[90%] sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 pb-28 pt-12 shadow sm:rounded-lg sm:px-12">
          <div className="flex items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
            <span className="px-2 py-2 text-center font-logo text-3xl font-medium underline decoration-teal-500 decoration-2">
              shopfashion
            </span>
            &nbsp;
            <span className="mt-1 text-center text-xl font-medium">
              Store Admin
            </span>
          </div>

          <div className="mt-6 flex rounded-md border border-sky-600 bg-sky-50/50 px-4 pb-4 pt-2.5">
            <div className="flex items-center pr-4">
              <IconInfo className="h-8 w-8 text-sky-700" />
            </div>
            <div>
              <p className="font-semibold text-sky-700">Test credentials</p>
              <div className="mt-1 text-sm font-medium text-sky-800">
                <p>Email: admin</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>

          <Form
            schema={formSchema}
            onSubmit={async (v) => {
              loginMutation.mutate(v);
            }}
            className="mt-8 space-y-6"
          >
            {({ register, formState: { errors } }) => {
              return (
                <>
                  <InputField
                    className="mt-4"
                    label="Email address"
                    id="email"
                    error={errors["email"]}
                    type="text"
                    registration={register("email")}
                    required
                  />
                  <InputField
                    className="mt-4"
                    label="Password"
                    id="password"
                    error={errors["password"]}
                    type="text"
                    registration={register("password")}
                    required
                  />

                  <div className="pt-8">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-teal-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    >
                      Sign in
                    </button>
                  </div>
                </>
              );
            }}
          </Form>

          <p className=" mt-8 text-sm text-sky-700">
            Note: Data for the test application is reset every 12 hours in
            Malaysian time on 00:00 and 12:00 daily.
          </p>
        </div>
      </div>
    </div>
  );
}
