import { Navbar } from "~/pages/layouts/Root.layout/Desktop/Navbar";
import { expect, test, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { config } from "~/shared/config/config";
import { client } from "~/external/api-client/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Search } from "~/pages/layouts/Root.layout/components/Search";

import "@testing-library/jest-dom/vitest";

const products = Array.from(
  new Set([
    "Jeans",
    "Shirts",
    "Jackets",
    "Relaxed Red Shirt",
    "Dresses",
    "Skirts",
    "Trousers",
    "Blouses",
    "Sweaters",
    "Coats",
    "T-shirts",
    "Shorts",
    "Leggings",
    "Cardigans",
    "Blazers",
    "Hoodies",
    "Pants",
    "Tank Tops",
    "Jumpers",
    "Socks",
    "Scarves",
    "Gloves",
    "Hats",
    "Belts",
    "Sandals",
    "Boots",
    "Heels",
    "Flats",
    "Sneakers",
    "Loafers",
    "Oxfords",
    "Espadrilles",
    "Mules",
    "Slippers",
    "Wedges",
    "Pumps",
    "Ballet Flats",
    "Ankle Boots",
    "Knee-High Boots",
    "Beanies",
    "Fedora Hats",
    "Bucket Hats",
    "Berets",
    "Fedora Hats",
    "Bucket Hats",
    "Berets",
    "Fedora Hats",
    "Bucket Hats",
    "Berets",
    "Sunglasses",
    "Watches",
    "Bracelets",
    "Necklaces",
    "Earrings",
    "Rings",
  ]).values()
);

function filterProducts(searchTerm: string) {
  return products.filter((p) => p.toLowerCase().includes(searchTerm));
}

export const handlers = [
  // Intercept the "GET /resource" request.
  http.get(
    `${config.SERVER_URL}/store/search_product_autocomplete/:searchTerm`,
    ({ params }) => {
      // And respond with a "text/plain" response
      // with a "Hello world!" text response body.
      const searchTerm = params.searchTerm as string;
      return HttpResponse.json({ productNames: filterProducts(searchTerm) });
    }
  ),
];
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

test("test search mock api req", async () => {
  const r = await client.products.searchProductAutocomplete({
    params: { searchTerm: "h" },
  });
  if (r.status == 200) {
    console.log(r.body);
  }
});

test("search test", async () => {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <Search showSearch onSearch={() => {}} onCloseSearch={() => {}} />
    </QueryClientProvider>
  );
  const v = screen.getAllByPlaceholderText("Search by keyword")[0];
  expect(v).toBeInTheDocument();
  v.focus();
  userEvent.type(v, "je");
  await waitFor(() => {
    expect(v).toHaveValue("je");
  });
  await waitFor(() => {
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("je");
    expect(options[1]).toHaveTextContent("Jeans");
    // const el = screen.getAllByText("ans")[0];
    // expect(el).toBeInTheDocument();
  });
});
