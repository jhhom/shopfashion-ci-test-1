import { test, expect } from "vitest";
import { paginationToItems } from "~/pages/common/components/Table/TablePagination/pagination-utils";
import type { OutputItem } from "~/pages/common/components/Table/TablePagination/pagination-utils";

test("pagination test", () => {
  /*

  for (let i = 1; i < 9; i++) {
    console.log("CURRENT", i);
    paginationToItems({
      totalCount: 8,
      currentCount: i,
    });
    console.log("\n\n");
  }
  */
  const results = paginationToItems({
    totalPages: 16,
    currentPage: 8,
    totalItems: 9,
  });
  console.log(results);

  // expect(2).toBe(3);
});

const testSets: {
  input: {
    total: number;
    current: number;
  };
  output: OutputItem[];
}[] = [
  {
    input: {
      total: 8,
      current: 1,
    },
    output: [
      { type: "page", page: 1, active: true },
      { type: "page", page: 2 },
      { type: "page", page: 3 },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "break" },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 2,
    },
    output: [
      { type: "page", page: 1 },
      { type: "page", page: 2, active: true },
      { type: "page", page: 3 },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "break" },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 3,
    },
    output: [
      { type: "page", page: 1 },
      { type: "page", page: 2 },
      { type: "page", page: 3, active: true },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "break" },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 4,
    },
    output: [
      { type: "page", page: 1 },
      { type: "page", page: 2 },
      { type: "page", page: 3 },
      { type: "page", page: 4, active: true },
      { type: "page", page: 5 },
      { type: "break" },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 5,
    },
    output: [
      { type: "page", page: 1 },
      { type: "break" },
      { type: "page", page: 4 },
      { type: "page", page: 5, active: true },
      { type: "page", page: 6 },
      { type: "page", page: 7 },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 6,
    },
    output: [
      { type: "page", page: 1 },
      { type: "break" },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "page", page: 6, active: true },
      { type: "page", page: 7 },
      { type: "page", page: 8 },
    ],
  },
  {
    input: {
      total: 8,
      current: 7,
    },
    output: [
      { type: "page", page: 1 },
      { type: "break" },
      { type: "page", page: 4 },
      { type: "page", page: 5 },
      { type: "page", page: 6 },
      { type: "page", page: 7, active: true },
      { type: "page", page: 8 },
    ],
  },
];
