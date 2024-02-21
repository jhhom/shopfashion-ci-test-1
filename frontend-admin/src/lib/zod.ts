import { z } from "zod";

export const zImage = z.custom<FileList>().superRefine((files, ctx) => {
  if (files.length === 0) {
    return true;
  }

  if (
    ![
      "image/webp",
      "image/png",
      "image/svg",
      "image/jpg",
      "image/jpeg",
    ].includes(files[0].type)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File must be a valid image type",
    });
    return false;
  }

  /*
  if (files[0].size > 1024 * 1024 * 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File must be less than 20MB",
    });
    return false;
  }
  */

  return true;
});
