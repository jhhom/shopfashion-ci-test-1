exports.up = async function (knex) {
  await knex.raw(/* sql */ `
  
CREATE TABLE taxons (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES taxons(id),
    taxon_name TEXT NOT NULL,
    slug TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(parent_id, taxon_name),
    UNIQUE(parent_id, slug)
);

CREATE TYPE product_type AS ENUM('SIMPLE', 'CONFIGURABLE');

CREATE TYPE product_status AS ENUM('ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK');

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    pricing NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    product_name TEXT NOT NULL,
    product_description TEXT DEFAULT '' NOT NULL,
    product_type product_type DEFAULT 'SIMPLE' NOT NULL,
    taxon_id INT REFERENCES taxons(id) NOT NULL,
    product_status product_status DEFAULT 'ACTIVE' NOT NULL,
    product_image_url TEXT,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE product_taxons (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) NOT NULL,
    taxon_id INT REFERENCES taxons(id) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(product_id, taxon_id)
);

CREATE TABLE product_options (
    code VARCHAR(255) UNIQUE PRIMARY KEY,
    option_name TEXT NOT NULL,
    position INT UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE product_option_values (
    id SERIAL PRIMARY KEY,
    option_code VARCHAR(255) REFERENCES product_options(code) NOT NULL,
    option_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(option_code, option_value)
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    pricing NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    variant_name TEXT NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    position INT NOT NULL,
    product_status product_status DEFAULT 'ACTIVE' NOT NULL,
    product_variant_image_url TEXT,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(product_id, position),
    UNIQUE(product_id, variant_name)
);

CREATE TABLE product_configurable_options (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) NOT NULL,
    product_option_code VARCHAR(255) REFERENCES product_options(code) NOT NULL,
    UNIQUE(product_id, product_option_code)
);

CREATE TABLE product_variant_options (
    id SERIAL PRIMARY KEY,
    product_variant_id INT REFERENCES product_variants(id) NOT NULL,
    product_option_value_id INT REFERENCES product_option_values(id) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(product_variant_id, product_option_value_id)
)

        `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
    DROP TABLE product_variant_options;
    DROP TABLE product_variants;
    DROP TABLE product_option_values;
    DROP TABLE product_configurable_options;
    DROP TABLE product_options;
    DROP TABLE product_taxons;
    DROP TABLE products;
    DROP TABLE taxons;
    DROP TYPE product_type;
    DROP TYPE product_status;
    
        `);
};
