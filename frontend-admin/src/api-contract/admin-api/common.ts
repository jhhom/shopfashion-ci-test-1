import { z } from "zod";

export type Pagination = z.infer<typeof zPagination>;

export type PaginationMeta = z.infer<typeof zPaginationMeta>;

export const zPagination = z.object({
  pageSize: z.number(),
  pageNumber: z.number(),
});

export const zPaginationMeta = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageNumber: z.number(),
});
