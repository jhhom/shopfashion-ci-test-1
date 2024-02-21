import pg from "pg";
import { CamelCasePlugin, PostgresDialect, Kysely, sql } from "kysely";
import { loadConfig } from "@seed/seed/config";

import { DB } from "@seed/codegen/schema";

export type KyselyDB = Kysely<DB>;

export function initDb(databaseUrl: string) {
  const Pool = pg.Pool;

  const config = loadConfig();

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

  return db;
}
