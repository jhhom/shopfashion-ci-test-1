import { clsx as cx } from "clsx";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  id?: string;
  error?: FieldError | undefined;
  type?: "text" | "email" | "password" | "number";
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  required?: boolean;
};

export const InputField = (props: InputFieldProps) => {
  const {
    type = "text",
    label,
    className,
    id,
    registration,
    error,
    required,
  } = props;
  return (
    <div className={className}>
      <label className="block" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={cx(
          "mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm",
          "text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
          { "border-red-500 ring-red-500": error !== undefined },
        )}
        {...registration}
      />
      {error?.message && (
        <div
          role="alert"
          aria-label={error.message}
          className="mt-1 text-sm text-red-500"
        >
          {error.message}
        </div>
      )}
    </div>
  );
};

type PricingFieldProps = {
  label: string;
  id?: string;
  error?: FieldError | undefined;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  required?: boolean;
};

export const PricingField = (props: PricingFieldProps) => {
  const { label, className, id, registration, error, required } = props;

  return (
    <div className={className}>
      <label className="block" htmlFor={id}>
        {label}
      </label>
      <div className="mt-1 flex rounded-md border border-gray-300">
        <div className="flex basis-[35px] items-center justify-center rounded-l-sm  bg-gray-200">
          $
        </div>
        <input
          {...registration}
          className="block  flex-grow rounded-r-md px-3 py-2 focus:outline-none focus:ring-1"
          id={id}
          type="text"
        />
      </div>
      {error?.message && <p className="mt-1 text-red-500">{error.message}</p>}
    </div>
  );
};
