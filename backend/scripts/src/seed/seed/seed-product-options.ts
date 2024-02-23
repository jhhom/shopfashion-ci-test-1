import { SeedOptions } from "@seed/data/product-options";
import { KyselyDB } from "@seed/db";

export const seedOptions = async (db: KyselyDB, options: SeedOptions) => {
  for (const [code, option] of Object.entries(options)) {
    await db
      .insertInto("productOptions")
      .values({
        code,
        optionName: option.name,
        position: option.position,
      })
      .executeTakeFirstOrThrow();

    {
      type Options = {
        [code: string]: {
          name: string;
          position: number;
          values: {
            [name: string]: { id: number; value: string };
          };
        };
      };

      for (const value of Object.values(
        (option as Options[keyof Options]).values
      )) {
        value.id = (
          await db
            .insertInto("productOptionValues")
            .values({ optionValue: value.value, optionCode: code })
            .returning("id")
            .executeTakeFirstOrThrow()
        ).id;
      }
    }
  }

  return options;
};
