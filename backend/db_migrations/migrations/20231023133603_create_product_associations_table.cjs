exports.up = async function (knex) {
  await knex.raw(/* sql */ `
  CREATE TABLE product_association_types (
    id SERIAL PRIMARY KEY,
     type_name TEXT DEFAULT '' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
  );
  CREATE TABLE product_associations (
    product_association_type_id INT REFERENCES product_association_types(id) NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    PRIMARY KEY (product_association_type_id, product_id)
  );
    `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
  DROP TABLE product_associations;
  DROP TABLE product_association_types;
    `);
};
