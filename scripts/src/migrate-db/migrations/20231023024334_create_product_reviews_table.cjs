exports.up = async function (knex) {
  await knex.raw(/* sql */ `
CREATE TABLE product_reviews (
    order_id INT REFERENCES orders(id) NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    comment TEXT DEFAULT '' NOT NULL,
    rating INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
  `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
DROP TABLE product_reviews;
  `);
};
