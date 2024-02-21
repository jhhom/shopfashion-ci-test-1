import { z } from "zod";

const zErrorPayload = {
  RESOURCE_NOT_FOUND: z.object({
    resource: z.string(),
  }),
  "AUTH.UNAUTHORIZED": z.undefined(),
  "AUTH.INCORRECT_PASSWORD": z.undefined(),
  "DB.UNIQUE_VALUE_CONFLICT": z.object({ entity: z.string() }),
  "DB.DELETED_ENTITY_IN_USE": z.object({ entity: z.string() }),
  "PRODUCT_OPTION.MULTIPLE_OPTION_VALUES_WITH_SAME_NAME": z.undefined(),
  "PRODUCT_VARIANT.CONFLICT_OPTION_VALUES": z.object({ variant: z.string() }),
  "PRODUCT_VARIANT.CONFLICT_VARIANT_NAMES": z.object({
    names: z.array(z.string()),
  }),
  "PRODUCT_VARIANT.MULTI_CONFLICT_OPTION_VALUES": z.object({
    variants: z.array(z.array(z.string())),
  }),
} as const;

export type ErrorPayload = {
  [k in keyof typeof zErrorPayload]: z.infer<(typeof zErrorPayload)[k]>;
};

export const ErrorMessage: { [k in keyof ErrorPayload]: string } = {
  RESOURCE_NOT_FOUND: "Requested resource not found",
  "AUTH.UNAUTHORIZED": "Unauthorized",
  "AUTH.INCORRECT_PASSWORD": "Incorrect password",
  "DB.DELETED_ENTITY_IN_USE":
    "The entity to be deleted is referenced or used by other entities",
  "DB.UNIQUE_VALUE_CONFLICT":
    "The value to be used is conflicting with other values",
  "PRODUCT_OPTION.MULTIPLE_OPTION_VALUES_WITH_SAME_NAME":
    "Multiple option values have the same name",
  "PRODUCT_VARIANT.CONFLICT_OPTION_VALUES":
    "Another product variant with same set of options already exist",
  "PRODUCT_VARIANT.MULTI_CONFLICT_OPTION_VALUES":
    "Some product variants have the same set of options",
  "PRODUCT_VARIANT.CONFLICT_VARIANT_NAMES":
    "Multiple variants have the same name",
};

type AppErrorDetails = {
  [k in keyof typeof zErrorPayload]: {
    code: k;
    info: z.infer<(typeof zErrorPayload)[k]>;
  };
}[keyof typeof zErrorPayload];

export class AppError extends Error {
  readonly details: AppErrorDetails;
  readonly message: string;
  readonly httpStatus?: number;

  constructor(error: AppErrorDetails, httpStatus?: number) {
    super();
    this.details = error;
    this.message = ErrorMessage[error.code];
    this.httpStatus = httpStatus;
  }
}

export const isAppError = (e: unknown): e is AppErrorUnion => {
  if (e === undefined || e === null) {
    return false;
  }
  const assertedE = e as AppErrorUnion;

  return (
    assertedE.details !== undefined &&
    typeof assertedE.details === "object" &&
    typeof assertedE.message === "string" &&
    assertedE.details.code in ErrorMessage
  );
};

export type AppErrorUnion = {
  [K in keyof ErrorPayload]: {
    details: AppErrorDetails;
    message: string;
    httpStatus?: number;
  };
}[keyof ErrorPayload];

function createZodErrorSchemaDetails<T extends keyof typeof zErrorPayload>(
  error: T
) {
  return z.object({
    code: z.literal(error),
    info: zErrorPayload[error],
  });
}

export const zApplicationErrorUnion = z.object({
  message: z.string(),
  details: z.discriminatedUnion("code", [
    createZodErrorSchemaDetails("RESOURCE_NOT_FOUND"),
    createZodErrorSchemaDetails("AUTH.INCORRECT_PASSWORD"),
    createZodErrorSchemaDetails("DB.DELETED_ENTITY_IN_USE"),
    createZodErrorSchemaDetails("DB.UNIQUE_VALUE_CONFLICT"),
    createZodErrorSchemaDetails(
      "PRODUCT_OPTION.MULTIPLE_OPTION_VALUES_WITH_SAME_NAME"
    ),
    createZodErrorSchemaDetails("PRODUCT_VARIANT.CONFLICT_OPTION_VALUES"),
    createZodErrorSchemaDetails("PRODUCT_VARIANT.MULTI_CONFLICT_OPTION_VALUES"),
    createZodErrorSchemaDetails("PRODUCT_VARIANT.CONFLICT_VARIANT_NAMES"),
  ]),
});
