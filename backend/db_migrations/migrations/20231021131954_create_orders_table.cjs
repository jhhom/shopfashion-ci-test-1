exports.up = async function (knex) {
  await knex.raw(/* sql */ `
CREATE TYPE order_status AS ENUM('PENDING_PAYMENT', 'PAID', 'CANCELLED');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    order_status order_status DEFAULT 'PENDING_PAYMENT' NOT NULL,
    delivery_address JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TYPE order_line_item_status AS ENUM('PROCESSING', 'TO_SHIP', 'TO_RECEIVE', 'COMPLETED');

CREATE TABLE order_line_simple_items (
    order_id INT REFERENCES orders(id) NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    order_line_item_status order_line_item_status DEFAULT 'PROCESSING' NOT NULL
);

CREATE TABLE order_line_configurable_items (
    order_id INT REFERENCES orders(id) NOT NULL,
    product_variant_id INT REFERENCES product_variants(id) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    order_line_item_status order_line_item_status DEFAULT 'PROCESSING' NOT NULL
);
    `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
DROP TABLE order_line_configurable_items;
DROP TABLE order_line_simple_items;
DROP TYPE order_line_item_status;
DROP TABLE orders;
DROP TYPE order_status;
  `);
};
