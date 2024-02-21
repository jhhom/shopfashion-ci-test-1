import { expect, test, it, describe } from "vitest";
import {
  removeCrumbs,
  removeCrumbsFromEndIdx,
  removeLinks,
  removeLinksFromEndIdx,
} from "~/pages/common/components/Breadcrumb/breadcrumb-modifier";

describe("function to modify generated breadcrumbs", () => {
  test("remove links should work correctly", () => {
    const crumbs = [
      { title: "Administration", path: "/" },
      { title: "Products", path: "/products" },
      { title: "DRY Shirt", path: "/products/1" },
      { title: "Variants", path: "/products/1/variants" },
      { title: "XL", path: "/products/1/variants/3" },
      { title: "Edit", path: null },
    ];

    const testsets = [
      {
        input: [2, 4, 5],
        output: [
          { title: "Administration", path: "/" },
          { title: "Products", path: "/products" },
          { title: "DRY Shirt", path: null },
          { title: "Variants", path: "/products/1/variants" },
          { title: "XL", path: null },
          { title: "Edit", path: null },
        ],
      },
    ];

    for (const { input, output: expected } of testsets) {
      const output = removeLinks(input, crumbs);

      expect(output.length).toBe(expected.length);
      for (let i = 0; i < output.length; i++) {
        expect(output[i].title).toBe(expected[i].title);
        expect(output[i].path).toBe(expected[i].path);
      }
    }
  });

  test("remove crumbs should work correctly", () => {
    const crumbs = [
      { title: "Administration", path: "/" },
      { title: "Products", path: "/products" },
      { title: "DRY Shirt", path: "/products/1" },
      { title: "Variants", path: "/products/1/variants" },
      { title: "XL", path: "/products/1/variants/3" },
      { title: "Edit", path: null },
    ];

    const testsets = [
      {
        input: [2, 4, 5],
        output: [
          { title: "Administration", path: "/" },
          { title: "Products", path: "/products" },
          { title: "Variants", path: "/products/1/variants" },
        ],
      },
    ];

    for (const { input, output: expected } of testsets) {
      const output = removeCrumbs(input, crumbs);

      expect(output.length).toBe(expected.length);
      for (let i = 0; i < output.length; i++) {
        expect(output[i].title).toBe(expected[i].title);
        expect(output[i].path).toBe(expected[i].path);
      }
    }
  });

  test("remove links from end indexes should work correctly", () => {
    const crumbs = [
      { title: "Administration", path: "/" },
      { title: "Products", path: "/products" },
      { title: "DRY Shirt", path: "/products/1" },
      { title: "Variants", path: "/products/1/variants" },
      { title: "XL", path: "/products/1/variants/3" },
      { title: "Edit", path: "/products/1/variants/3/edit" },
    ];

    const testsets = [
      {
        input: [0, 2, 8],
        output: [
          { title: "Administration", path: "/" },
          { title: "Products", path: "/products" },
          { title: "DRY Shirt", path: "/products/1" },
          { title: "Variants", path: null },
          { title: "XL", path: "/products/1/variants/3" },
          { title: "Edit", path: null },
        ],
      },
    ];

    for (const { input, output: expected } of testsets) {
      const output = removeLinksFromEndIdx(input, crumbs);

      expect(output.length).toBe(expected.length);
      for (let i = 0; i < output.length; i++) {
        expect(output[i].title).toBe(expected[i].title);
        expect(output[i].path).toBe(expected[i].path);
      }
    }
  });

  test("remove crumbs from end indexes should work correctly", () => {
    const crumbs = [
      { title: "Administration", path: "/" },
      { title: "Products", path: "/products" },
      { title: "DRY Shirt", path: "/products/1" },
      { title: "Variants", path: "/products/1/variants" },
      { title: "XL", path: "/products/1/variants/3" },
      { title: "Edit", path: "/products/1/variants/3/edit" },
    ];

    const testsets = [
      {
        input: [0, 2, 8],
        output: [
          { title: "Administration", path: "/" },
          { title: "Products", path: "/products" },
          { title: "DRY Shirt", path: "/products/1" },
          { title: "XL", path: "/products/1/variants/3" },
        ],
      },
    ];

    for (const { input, output: expected } of testsets) {
      const output = removeCrumbsFromEndIdx(input, crumbs);

      expect(output.length).toBe(expected.length);
      for (let i = 0; i < output.length; i++) {
        expect(output[i].title).toBe(expected[i].title);
        expect(output[i].path).toBe(expected[i].path);
      }
    }
  });
});
