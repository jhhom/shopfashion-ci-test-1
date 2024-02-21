import { expect, test, it, describe } from "vitest";
import { generateBreadcrumbFromRoute } from "~/pages/common/components/Breadcrumb/breadcrumb-generator";

describe("Function to generate breadcrumbs from path", () => {
  test("Breadcrumbs should be generated correctly", async () => {
    const testsets: {
      input: {
        routeId: string;
        params: { [paramName: string]: string };
      };
      output: [string, string | null][];
    }[] = [
      {
        input: {
          routeId: "/home/products/$productId/variants/$productVariantId/edit",
          params: {
            productId: "1",
            productVariantId: "3",
          },
        },
        output: [
          ["Administration", "/"],
          ["Products", "/products"],
          ["DRY Shirt", "/products/1"],
          ["Variants", "/products/1/variants"],
          ["XL", "/products/1/variants/3"],
          ["Edit", null],
        ],
      },
    ];

    for (const { input, output: expected } of testsets) {
      const output = await generateBreadcrumbFromRoute(
        input.routeId,
        input.params,
        getTitleOfParamValue,
        new Map(),
      );
      console.log(output);
      if (output === null) {
        throw new Error("Expected output is not NULL");
      }
      expect(output.length).toBe(expected.length);
      for (let i = 0; i < output.length; i++) {
        expect(output[i].title).toBe(expected[i][0]);
        expect(output[i].path).toBe(expected[i][1]);
      }
    }
  });
});

/**
 *
 * @param param
 * @param value Value of parameter, "0" is used as the mock value to represent invalid paramter value
 * @returns
 *
 * Mock get title from param value function
 * The real function should retrieve from server the title of the parameter
 *
 * the parameter name should be unique for all paths,
 * meaning if Route A use `$productId` for product id,
 * Route B cannot use `$productId` for product variant id
 */
async function getTitleOfParamValue(
  param: string,
  value: string,
): Promise<string | null> {
  if (param === "productId") {
    if (value === "0") {
      return null;
    }
    return "DRY Shirt";
  } else if (param === "productVariantId") {
    if (value === "0") {
      return null;
    }
    return "XL";
  }

  return null;
}
