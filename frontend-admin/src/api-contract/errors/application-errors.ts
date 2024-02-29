import { z } from "zod";

const zErrorPayload = {
  RESOURCE_NOT_FOUND: z.object({
    resource: z.string(),
  }),
  AUTH_UNAUTHORIZED: z.undefined(),
  AUTH_INCORRECT_PASSWORD: z.undefined(),
  DB_UNIQUE_VALUE_CONFLICT: z.object({ entity: z.string() }),
  DB_DELETED_ENTITY_IN_USE: z.object({ entity: z.string() }),
  PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME: z.undefined(),
  PRODUCT_VARIANT_CONFLICT_OPTION_VALUES: z.object({ variant: z.string() }),
  PRODUCT_VARIANT_CONFLICT_VARIANT_NAMES: z.object({
    names: z.array(z.string()),
  }),
  PRODUCT_VARIANT_MULTI_CONFLICT_OPTION_VALUES: z.object({
    variants: z.array(z.array(z.string())),
  }),
} as const;

export type ErrorPayload = {
  [k in keyof typeof zErrorPayload]: z.infer<(typeof zErrorPayload)[k]>;
};

export const ErrorMessage: { [k in keyof ErrorPayload]: string } = {
  RESOURCE_NOT_FOUND: "Requested resource not found",
  AUTH_UNAUTHORIZED: "Unauthorized",
  AUTH_INCORRECT_PASSWORD: "Incorrect password",
  DB_DELETED_ENTITY_IN_USE:
    "The entity to be deleted is referenced or used by other entities",
  DB_UNIQUE_VALUE_CONFLICT:
    "The value to be used is conflicting with other values",
  PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME:
    "Multiple option values have the same name",
  PRODUCT_VARIANT_CONFLICT_OPTION_VALUES:
    "Another product variant with same set of options already exist",
  PRODUCT_VARIANT_MULTI_CONFLICT_OPTION_VALUES:
    "Some product variants have the same set of options",
  PRODUCT_VARIANT_CONFLICT_VARIANT_NAMES:
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

export const isAppError = (e: unknown): e is ApplicationError => {
  if (e === undefined || e === null) {
    return false;
  }
  const err = zApplicationError.safeParse(e);
  if (err.success) {
    return true;
  }
  return false;
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
    createZodErrorSchemaDetails("AUTH_INCORRECT_PASSWORD"),
    createZodErrorSchemaDetails("DB_DELETED_ENTITY_IN_USE"),
    createZodErrorSchemaDetails("DB_UNIQUE_VALUE_CONFLICT"),
    createZodErrorSchemaDetails(
      "PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME"
    ),
    createZodErrorSchemaDetails("PRODUCT_VARIANT_CONFLICT_OPTION_VALUES"),
    createZodErrorSchemaDetails("PRODUCT_VARIANT_MULTI_CONFLICT_OPTION_VALUES"),
    createZodErrorSchemaDetails("PRODUCT_VARIANT_CONFLICT_VARIANT_NAMES"),
  ]),
});

export const zApplicationError = z.object({
  type: z.literal("application"),
  error: zApplicationErrorUnion,
});

export type ApplicationError = z.infer<typeof zApplicationError>;
