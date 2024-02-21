import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import * as React from "react";
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldValues,
} from "react-hook-form";
import { z, ZodType, ZodTypeDef } from "zod";

type FormProps<TFormValues extends FieldValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
};

type ZodSchema = Parameters<typeof zodResolver>[0];

export const Form = <Schema extends ZodSchema>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<z.infer<Schema>, Schema>) => {
  const methods = useForm<z.infer<Schema>>({
    ...options,
    resolver: schema && zodResolver(schema),
  });
  return (
    <form
      className={className}
      onSubmit={methods.handleSubmit(onSubmit)}
      id={id}
    >
      {children(methods)}
    </form>
  );
};
