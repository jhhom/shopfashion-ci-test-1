exports.up = async function (knex) {
  await knex.raw(/* sql */ `
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
      `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
  DROP TABLE admins;
      `);
};
