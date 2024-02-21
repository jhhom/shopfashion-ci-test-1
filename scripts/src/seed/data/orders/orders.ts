import { Orders } from "@seed/codegen/schema";
import { SeedCustomers } from "@seed/data/customers";
import { productPath as path } from "@seed/data/orders/convert-products";
import { SeedProducts } from "@seed/data/products/products";
import { faker } from "@faker-js/faker";
import { Duration } from "date-fns";

// we need a map of PRODUCT_VARIANT_ID -> PRICE
// we might need to transform products to include their id when seeding the product
// otherwise if we set the id during seeding, then we need to transform right just before seeding orders

type Order = {
  id: number;
  customer: number;
  items: [number, ReturnType<typeof path>][];
  dateFromToday: Duration;
  deliveryAddress: Orders["deliveryAddress"];
};

export type SeedOrders = {
  [x in OrderPeriod]: { [ref: number]: Order };
};

type OrderPeriod =
  | `past-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}-month`
  | "past-TWO_WEEKS";

export function generateOrders({
  customers,
  products,
}: {
  customers: SeedCustomers;
  products: SeedProducts;
}) {
  const orders: SeedOrders = {
    "past-TWO_WEEKS": {
      0: {
        id: 0,
        customer: customers.james.id,
        dateFromToday: { days: 1 },
        items: [
          [2, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [3, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.james.name),
      },
      1: {
        id: 0,
        customer: customers.sawyer.id,
        dateFromToday: { days: 2 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/jeans", "Wide Fit Jeans", "Navy-32 inch")],
          [1, path("men/polo", "Vito Willy Polo", "Grey-M")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.sawyer.name),
      },
      2: {
        id: 0,
        customer: customers.edith.id,
        dateFromToday: { days: 4 },
        items: [[4, path("men/shorts", "Relaxed Striped Shorts", "Blue-M")]],
        deliveryAddress: randomDeliveryAddress(customers.edith.name),
      },
      3: {
        id: 0,
        customer: customers.daisy.id,
        dateFromToday: { days: 7 },
        items: [
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "Green-M"
            ),
          ],
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "Black-M")],
          [
            1,
            path(
              "women/jeans",
              "Ultra Stretch Jeans (Damaged)",
              "Blue-28 inch"
            ),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.daisy.name),
      },
      4: {
        id: 0,
        customer: customers.mary.id,
        dateFromToday: { days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.mary.name),
      },
      5: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      6: {
        id: 0,
        customer: customers.evelyn.id,
        dateFromToday: { days: 10 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [2, path("women/skirts", "Red checked skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.evelyn.name),
      },
      7: {
        id: 0,
        customer: customers.annie.id,
        dateFromToday: { days: 10 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.annie.name),
      },
      8: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      9: {
        id: 0,
        customer: customers.cole.id,
        dateFromToday: { days: 14 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.cole.name),
      },
    },
    "past-1-month": {
      0: {
        id: 0,
        customer: customers.graham.id,
        dateFromToday: { weeks: 2, days: 2 },
        items: [
          [2, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [3, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.graham.name),
      },
      1: {
        id: 0,
        customer: customers.willow.id,
        dateFromToday: { weeks: 2, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/jeans", "Wide Fit Jeans", "Navy-32 inch")],
          [1, path("men/polo", "Vito Willy Polo", "Grey-M")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.willow.name),
      },
      2: {
        id: 0,
        customer: customers.william.id,
        dateFromToday: { weeks: 2, days: 4 },
        items: [[4, path("men/shorts", "Relaxed Striped Shorts", "Blue-M")]],
        deliveryAddress: randomDeliveryAddress(customers.william.name),
      },
      3: {
        id: 0,
        customer: customers.etta.id,
        dateFromToday: { weeks: 2, days: 7 },
        items: [
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "Green-M"
            ),
          ],
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "Black-M")],
          [
            1,
            path(
              "women/jeans",
              "Ultra Stretch Jeans (Damaged)",
              "Blue-28 inch"
            ),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.etta.name),
      },
      4: {
        id: 0,
        customer: customers.everly.id,
        dateFromToday: { weeks: 2, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.everly.name),
      },
      5: {
        id: 0,
        customer: customers.ralph.id,
        dateFromToday: { weeks: 2, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.ralph.name),
      },
      6: {
        id: 0,
        customer: customers.daisy.id,
        dateFromToday: { weeks: 2, days: 10 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [2, path("women/skirts", "Red checked skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.daisy.name),
      },
      7: {
        id: 0,
        customer: customers.lucy.id,
        dateFromToday: { weeks: 2, days: 10 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lucy.name),
      },
      8: {
        id: 0,
        customer: customers.hugh.id,
        dateFromToday: { weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.hugh.name),
      },
      9: {
        id: 0,
        customer: customers.mason.id,
        dateFromToday: { weeks: 2, days: 14 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.mason.name),
      },
    },
    "past-2-month": {
      0: {
        id: 0,
        customer: customers.jane.id,
        dateFromToday: { months: 1, days: 2 },
        items: [[2, path("women/tshirt", "USA Gray Mini T-Shirt", "Grey-M")]],
        deliveryAddress: randomDeliveryAddress(customers.jane.name),
      },
      1: {
        id: 0,
        customer: customers.mason.id,
        dateFromToday: { months: 1, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/polo", "Vito Willy Polo", "Grey-M")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.mason.name),
      },
      2: {
        id: 0,
        customer: customers.faith.id,
        dateFromToday: { months: 1, days: 4 },
        items: [
          [
            2,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "White-M"
            ),
          ],
          [
            2,
            path("women/jeans", "Wide Fit Jeans (High Waist)", "Blue-31 inch"),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.faith.name),
      },
      3: {
        id: 0,
        customer: customers.ellis.id,
        dateFromToday: { months: 1, days: 7 },
        items: [
          [2, path("men/shorts", "Chinos shorts", "Brown-M")],
          [
            1,
            path(
              "women/jeans",
              "Ultra Stretch Jeans (Damaged)",
              "Blue-28 inch"
            ),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.ellis.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 1, days: 8 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
          [1, path("women/blouse", "Pleated Long Sleeve Blouse", "White-M")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
      5: {
        id: 0,
        customer: customers.parker.id,
        dateFromToday: { months: 1, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.parker.name),
      },
      6: {
        id: 0,
        customer: customers.etta.id,
        dateFromToday: { months: 1, weeks: 2, days: 2 },
        items: [[1, path("women/skirts", "Short Sequin Skirt", "Black-M")]],
        deliveryAddress: randomDeliveryAddress(customers.etta.name),
      },
      7: {
        id: 0,
        customer: customers.evelyn.id,
        dateFromToday: { months: 1, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Pleated Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.evelyn.name),
      },
      8: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 1, weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      9: {
        id: 0,
        customer: customers.charlie.id,
        dateFromToday: { months: 1, weeks: 3, days: 4 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.charlie.name),
      },
    },
    "past-3-month": {
      0: {
        id: 0,
        customer: customers.julian.id,
        dateFromToday: { months: 2, days: 2 },
        items: [
          [2, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [3, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.julian.name),
      },
      1: {
        id: 0,
        customer: customers.henrietta.id,
        dateFromToday: { months: 2, days: 3 },
        items: [
          [1, path("women/skirts", "Long floral skirt", "Red-L")],
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.henrietta.name),
      },
      2: {
        id: 0,
        customer: customers.lewis.id,
        dateFromToday: { months: 2, days: 4 },
        items: [[4, path("men/shorts", "Relaxed Striped Shorts", "Blue-M")]],
        deliveryAddress: randomDeliveryAddress(customers.lewis.name),
      },
      3: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 2, days: 7 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 2, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
      5: {
        id: 0,
        customer: customers.parker.id,
        dateFromToday: { months: 2, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.parker.name),
      },
      6: {
        id: 0,
        customer: customers.annie.id,
        dateFromToday: { months: 2, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "White-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.annie.name),
      },
      7: {
        id: 0,
        customer: customers.scarlet.id,
        dateFromToday: { months: 2, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.scarlet.name),
      },
      8: {
        id: 0,
        customer: customers.cole.id,
        dateFromToday: { months: 2, weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.cole.name),
      },
      9: {
        id: 0,
        customer: customers.charlie.id,
        dateFromToday: { months: 2, weeks: 3, days: 4 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.charlie.name),
      },
    },
    "past-4-month": {
      0: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 3, days: 2 },
        items: [
          [2, path("men/polo", "Slim Fit Dotted Polo", "Red-L")],
          [3, path("men/polo", "Vito Willy Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      1: {
        id: 0,
        customer: customers.charlie.id,
        dateFromToday: { months: 3, days: 3 },
        items: [[1, path("men/polo", "Vito Willy Polo", "Grey-M")]],
        deliveryAddress: randomDeliveryAddress(customers.charlie.name),
      },
      2: {
        id: 0,
        customer: customers.arden.id,
        dateFromToday: { months: 3, days: 4 },
        items: [[2, path("men/shorts", "Relaxed Striped Shorts", "Blue-S")]],
        deliveryAddress: randomDeliveryAddress(customers.arden.name),
      },
      3: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 3, days: 7 },
        items: [
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "Green-M"
            ),
          ],
          [
            1,
            path("women/jeans", "Wide Fit Jeans (High Waist)", "Blue-28 inch"),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      4: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 3, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      5: {
        id: 0,
        customer: customers.parker.id,
        dateFromToday: { months: 3, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.parker.name),
      },
      6: {
        id: 0,
        customer: customers.olive.id,
        dateFromToday: { months: 3, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.olive.name),
      },
      7: {
        id: 0,
        customer: customers.scarlet.id,
        dateFromToday: { months: 3, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.scarlet.name),
      },
      8: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 3, weeks: 2, days: 11 },
        items: [[1, path("men/polo", "Slim Fit Dotted Polo", "Red-XL")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      9: {
        id: 0,
        customer: customers.may.id,
        dateFromToday: { months: 3, weeks: 3, days: 4 },
        items: [[2, path("women/skirts", "Red checked skirt", "Red-S")]],
        deliveryAddress: randomDeliveryAddress(customers.may.name),
      },
    },
    "past-5-month": {
      0: {
        id: 0,
        customer: customers.ellis.id,
        dateFromToday: { months: 4, days: 2 },
        items: [
          [1, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [1, path("men/polo", "Slim Fit Dotted Polo", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.ellis.name),
      },
      1: {
        id: 0,
        customer: customers.edith.id,
        dateFromToday: { months: 4, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.edith.name),
      },
      2: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 4, days: 4 },
        items: [[2, path("men/shorts", "Chinos shorts", "Brown-L")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      3: {
        id: 0,
        customer: customers.benett.id,
        dateFromToday: { months: 4, days: 7 },
        items: [
          [1, path("men/tshirt", "Oversized Round-neck T-Shirt", "Black-L")],
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.benett.name),
      },
      4: {
        id: 0,
        customer: customers.daisy.id,
        dateFromToday: { months: 4, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [1, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.daisy.name),
      },
      5: {
        id: 0,
        customer: customers.arden.id,
        dateFromToday: { months: 4, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.arden.name),
      },
      6: {
        id: 0,
        customer: customers.kate.id,
        dateFromToday: { months: 4, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.kate.name),
      },
      7: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 4, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      8: {
        id: 0,
        customer: customers.george.id,
        dateFromToday: { months: 4, weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.george.name),
      },
      9: {
        id: 0,
        customer: customers.sawyer.id,
        dateFromToday: { months: 4, weeks: 3, days: 4 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.sawyer.name),
      },
    },
    // TODO: HOLD: ALL ABOVE DONE
    "past-6-month": {
      0: {
        id: 0,
        customer: customers.julian.id,
        dateFromToday: { months: 5, days: 2 },
        items: [
          [2, path("men/polo", "Slim Fit Dotted Polo", "Red-M")],
          [3, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.julian.name),
      },
      1: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 5, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/jeans", "Wide Fit Jeans", "Navy-32 inch")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      2: {
        id: 0,
        customer: customers.lewis.id,
        dateFromToday: { months: 5, days: 4 },
        items: [
          [
            3,
            path("women/jeans", "Wide Fit Jeans (High Waist)", "Blue-30 inch"),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lewis.name),
      },
      3: {
        id: 0,
        customer: customers.maggie.id,
        dateFromToday: { months: 5, days: 7 },
        items: [
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "Green-M"
            ),
          ],
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "White-M"
            ),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.maggie.name),
      },
      4: {
        id: 0,
        customer: customers.rosie.id,
        dateFromToday: { months: 5, days: 8 },
        items: [
          [2, path("women/blouse", "Pleated Long Sleeve Blouse", "White-M")],
          [1, path("women/blouse", "Creped blouse with tie", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.rosie.name),
      },
      5: {
        id: 0,
        customer: customers.kate.id,
        dateFromToday: { months: 5, days: 9 },
        items: [
          [3, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.kate.name),
      },
      6: {
        id: 0,
        customer: customers.jenna.id,
        dateFromToday: { months: 5, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.jenna.name),
      },
      7: {
        id: 0,
        customer: customers.sunny.id,
        dateFromToday: { months: 5, weeks: 2, days: 4 },
        items: [
          [3, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.sunny.name),
      },
      8: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 5, weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      9: {
        id: 0,
        customer: customers.mason.id,
        dateFromToday: { months: 5, weeks: 3, days: 4 },
        items: [
          [1, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.mason.name),
      },
    },
    // ✅ past-6-month
    "past-7-month": {
      0: {
        id: 0,
        customer: customers.julian.id,
        dateFromToday: { months: 6, days: 2 },
        items: [
          [1, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.julian.name),
      },
      1: {
        id: 0,
        customer: customers.nash.id,
        dateFromToday: { months: 6, days: 3 },
        items: [
          [3, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-XL")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.nash.name),
      },
      2: {
        id: 0,
        customer: customers.hugh.id,
        dateFromToday: { months: 6, days: 4 },
        items: [[2, path("men/shorts", "Chinos shorts", "Brown-XL")]],
        deliveryAddress: randomDeliveryAddress(customers.hugh.name),
      },
      3: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 6, days: 7 },
        items: [
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "White-M"
            ),
          ],
          [
            1,
            path(
              "women/tshirt",
              "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
              "Green-M"
            ),
          ],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 6, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
      5: {
        id: 0,
        customer: customers.parker.id,
        dateFromToday: { months: 6, days: 9 },
        items: [
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.parker.name),
      },
      6: {
        id: 0,
        customer: customers.may.id,
        dateFromToday: { months: 6, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [2, path("women/skirts", "Red checked skirt", "Black-M")],
          [3, path("women/blouse", "Creped blouse with tie", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.may.name),
      },
      7: {
        id: 0,
        customer: customers.scarlet.id,
        dateFromToday: { months: 6, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.scarlet.name),
      },
      8: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 6, weeks: 2, days: 11 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      9: {
        id: 0,
        customer: customers.charlie.id,
        dateFromToday: { months: 6, weeks: 3, days: 4 },
        items: [
          [2, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.charlie.name),
      },
    },
    // ✅ past-7-month
    "past-8-month": {
      0: {
        id: 0,
        customer: customers.edith.id,
        dateFromToday: { months: 7, days: 2 },
        items: [[1, path("men/polo", "Short Sleeve Polo", "Black-L")]],
        deliveryAddress: randomDeliveryAddress(customers.edith.name),
      },
      1: {
        id: 0,
        customer: customers.nash.id,
        dateFromToday: { months: 7, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/jeans", "Wide Fit Jeans", "Navy-32 inch")],
          [1, path("men/polo", "Vito Willy Polo", "Grey-M")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.nash.name),
      },
      2: {
        id: 0,
        customer: customers.lewis.id,
        dateFromToday: { months: 7, days: 4 },
        items: [[4, path("men/shorts", "Relaxed Striped Shorts", "Blue-M")]],
        deliveryAddress: randomDeliveryAddress(customers.lewis.name),
      },
      3: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 7, days: 7 },
        items: [
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "Black-M")],
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 7, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
      5: {
        id: 0,
        customer: customers.ellis.id,
        dateFromToday: { months: 7, days: 9 },
        items: [
          [1, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-XL")],
          [1, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "Black-XL")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.ellis.name),
      },
      6: {
        id: 0,
        customer: customers.olive.id,
        dateFromToday: { months: 7, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [2, path("women/skirts", "Red checked skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.olive.name),
      },
      7: {
        id: 0,
        customer: customers.scarlet.id,
        dateFromToday: { months: 7, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.scarlet.name),
      },
      8: {
        id: 0,
        customer: customers.faith.id,
        dateFromToday: { months: 7, weeks: 2, days: 11 },
        items: [
          [1, path("women/skirts", "Long floral skirt", "Red-M")],
          [1, path("women/blouse", "Creped blouse with tie", "Black-XL")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.faith.name),
      },
      9: {
        id: 0,
        customer: customers.jack.id,
        dateFromToday: { months: 7, weeks: 3, days: 4 },
        items: [
          [4, path("men/tshirt", "Oversized Round-neck T-Shirt", "White-S")],
          [1, path("men/jeans", "Slim Fit Jeans", "Blue-29 inch")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.jack.name),
      },
    },
    // ✅: past-8-month
    "past-9-month": {
      0: {
        id: 0,
        customer: customers.kate.id,
        dateFromToday: { months: 8, days: 2 },
        items: [
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.kate.name),
      },
      1: {
        id: 0,
        customer: customers.ralph.id,
        dateFromToday: { months: 8, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/jeans", "Wide Fit Jeans", "Navy-32 inch")],
          [1, path("men/tshirt", "Relaxed Sleeveless T-Shirt", "White-L")],
          [1, path("men/tshirt", "Relaxed Sleeveless T-Shirt", "Red-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.ralph.name),
      },
      2: {
        id: 0,
        customer: customers.lewis.id,
        dateFromToday: { months: 8, days: 4 },
        items: [[4, path("men/shorts", "Relaxed Striped Shorts", "Blue-M")]],
        deliveryAddress: randomDeliveryAddress(customers.lewis.name),
      },
      3: {
        id: 0,
        customer: customers.jenna.id,
        dateFromToday: { months: 8, days: 7 },
        items: [
          [1, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "Black-M")],
          [2, path("women/tshirt", "Striped Short-Sleeve T-Shirt", "White-S")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.jenna.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 8, days: 8 },
        items: [
          [2, path("women/blouse", "Creped blouse with tie", "Black-L")],
          [3, path("women/skirts", "Red checked skirt", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
      5: {
        id: 0,
        customer: customers.benett.id,
        dateFromToday: { months: 8, days: 9 },
        items: [
          [1, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.benett.name),
      },
      6: {
        id: 0,
        customer: customers.evelyn.id,
        dateFromToday: { months: 8, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [1, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.evelyn.name),
      },
    },
    // ✅ past-9-month
    "past-10-month": {
      0: {
        id: 0,
        customer: customers.julian.id,
        dateFromToday: { months: 9, days: 2 },
        items: [
          [1, path("men/jeans", "Jeans shorts", "Blue-29 inch")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-L")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.julian.name),
      },
      1: {
        id: 0,
        customer: customers.alfred.id,
        dateFromToday: { months: 9, days: 3 },
        items: [
          [1, path("men/jeans", "Ultra Stretch Jeans", "Blue-32 inch")],
          [1, path("men/polo", "Short Sleeve Polo", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.alfred.name),
      },
      3: {
        id: 0,
        customer: customers.henrietta.id,
        dateFromToday: { months: 9, weeks: 2, days: 2 },
        items: [
          [1, path("women/skirts", "Short Sequin Skirt", "Black-M")],
          [2, path("women/blouse", "Creped blouse with tie", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.henrietta.name),
      },
      4: {
        id: 0,
        customer: customers.lily.id,
        dateFromToday: { months: 9, weeks: 2, days: 4 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lily.name),
      },
      5: {
        id: 0,
        customer: customers.arden.id,
        dateFromToday: { months: 9, weeks: 2, days: 11 },
        items: [[3, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.arden.name),
      },
    },
    // ✅ past-10-month
    "past-11-month": {
      0: {
        id: 0,
        customer: customers.george.id,
        dateFromToday: { months: 10, days: 2 },
        items: [
          [1, path("men/jeans", "Jeans shorts", "Blue-32 inch")],
          [1, path("men/jeans", "Jeans shorts", "Navy-32 inch")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.george.name),
      },
      1: {
        id: 0,
        customer: customers.cole.id,
        dateFromToday: { months: 10, days: 3 },
        items: [
          [1, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "Black-L")],
          [1, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-L")],
          [1, path("men/jeans", "Jeans shorts", "Blue-32 inch")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.cole.name),
      },
      2: {
        id: 0,
        customer: customers.lewis.id,
        dateFromToday: { months: 10, days: 4 },
        items: [
          [2, path("men/shorts", "Chinos shorts", "Brown-L")],
          [2, path("men/tshirt", "Regular Fit Crew-neck T-Shirt", "White-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.lewis.name),
      },
      3: {
        id: 0,
        customer: customers.sunny.id,
        dateFromToday: { months: 10, days: 7 },
        items: [
          [1, path("women/blouse", "Floral Long Sleeve Blouse", "Black-M")],
        ],
        deliveryAddress: randomDeliveryAddress(customers.sunny.name),
      },
      4: {
        id: 0,
        customer: customers.hazel.id,
        dateFromToday: { months: 10, days: 8 },
        items: [[2, path("women/blouse", "Creped blouse with tie", "Black-L")]],
        deliveryAddress: randomDeliveryAddress(customers.hazel.name),
      },
    },
    "past-12-month": {
      0: {
        id: 0,
        customer: customers.benett.id,
        dateFromToday: { months: 11, days: 2 },
        items: [[2, path("men/jeans", "Jeans shorts", "Blue-29 inch")]],
        deliveryAddress: randomDeliveryAddress(customers.benett.name),
      },
    },
  };

  return orders;
}

function randomDeliveryAddress(
  customerFullname: string
): Orders["deliveryAddress"] {
  return {
    fullName: customerFullname,
    address1: faker.location.secondaryAddress(),
    address2: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode("#####"),
    mobilePhone: faker.phone.number("+60#########"),
  };
}
