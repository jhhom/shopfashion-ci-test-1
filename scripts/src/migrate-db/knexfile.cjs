// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  test: {
    client: "postgresql",
    searchPath: "public", // 1. add this
    connection: {
      database: "fashionable_test",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      schemaName: "public", // 2. add this
      tableName: "knex_migrations",
    },
  },
  development: {
    client: "postgresql",
    searchPath: "public", // 1. add this
    connection: {
      database: "jooq_shopfashion_playground",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      schemaName: "public", // 2. add this
      tableName: "knex_migrations",
      loadExtensions: [".cjs"],
    },
  },
  e2e: {
    client: "postgresql",
    searchPath: "public", // 1. add this
    connection: {
      database: "jooq_shopfashion_playground_e2e",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      schemaName: "public", // 2. add this
      tableName: "knex_migrations",
      loadExtensions: [".cjs"],
    },
  },
};
