import { DB } from "@seed/codegen/schema";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export async function seedAdmin(
  databaseUrl: string,
  admin: {
    username: string;
    password: string;
    email: string;
  }
) {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: databaseUrl,
    }),
  });

  const db = new Kysely<DB>({
    dialect,
    log(event) {
      if (event.level === "query") {
        console.log(event.query.sql);
        console.log(event.query.parameters);
      }
    },
    plugins: [new CamelCasePlugin()],
  });

  await db.insertInto("admins").values(admin).execute();
}
