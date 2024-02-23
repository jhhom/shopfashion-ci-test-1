exports.up = async function (knex) {
  await knex.raw(/* sql */ `
  CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
  );

  CREATE TABLE customer_cart_simple_items (
    customer_id INT REFERENCES customers(id) NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    quantity INT DEFAULT 0 NOT NULL,
    added_at TIMESTAMP NOT NULL,
    PRIMARY KEY(customer_id, product_id)
  );

  CREATE TABLE customer_cart_configurable_items (
    customer_id INT REFERENCES customers(id) NOT NULL,
    product_variant_id INT REFERENCES product_variants(id) NOT NULL,
    quantity INT DEFAULT 0 NOT NULL,
    added_at TIMESTAMP NOT NULL,
    PRIMARY KEY(customer_id, product_variant_id)
  );
        `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
    DROP TABLE customer_cart_configurable_items;
    DROP TABLE customer_cart_simple_items;
    DROP TABLE customers;
        `);
};
