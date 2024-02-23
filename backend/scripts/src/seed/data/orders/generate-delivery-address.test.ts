import { expect, test, describe } from "vitest";
import { faker } from "@faker-js/faker";

describe("seed 3", () => {
  test("generate address", () => {
    const s1 = faker.location.secondaryAddress();
    const s2 = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const postalCode = faker.location.zipCode("#####");
    const phone = faker.phone.number("+60#########");

    console.log(s1);
    console.log(s2);
    console.log(city);
    console.log(state);
    console.log(postalCode);
    console.log(phone);

    expect(true).toBeTruthy();
  });
});
