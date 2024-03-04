## 1. Configuration at a glance

### 1. Front-end

1. **`config.ts`** - `frontend-admin/src/config/config.ts`
2. **`config.ts`** - `frontend-store-2/src/config/config.ts`
3. **`stripe-config.ts`** - `frontend-store-2/src/config/stripe-config.ts` (git ignored)

### 2. Back-end

1. **`application.properties`** - `backend/src/main/resources/application.properties`
2. **`application-test.properties`** - `backend/src/main/resources/application-test.properties`
3. (logging setting) `backend/src/main/resources/logback-spring.xml`

### 3. Docker

1. **`seed_admin.sql`** - `backend/docker/seed_admin.sql`
2. **`docker-compose.yml`** - `backend/docker/docker-compose.yml`

When using Docker, user also need to configure the other configurations that affect the back-end and the scripts related to back-end (e.g data seeding), and make sure they sync with `docker-compose.yml` settings:

1. `application.properties` - `backend/src/main/resources/application.properties`
2. `.env` - `scripts.env`

### 4. Scripts

`.env` - `scripts/.env`

## 2. Configuration

### 1. Front-end

#### Admin

**`config.ts`** - `frontend-admin/src/config/config.ts`

```ts filename="config.ts - frontend-admin/src/config/config.ts"
export const SERVER_PORT = 9800;

const PRODUCTION_SERVER_URL = "https://shopfashion-server.joohom.dev";
const LOCAL_SERVER_URL = `http://localhost:${SERVER_PORT}`;

export const config = {
  SERVER_URL:
    import.meta.env.VITE_APP_ENV === "production"
      ? PRODUCTION_SERVER_URL
      : LOCAL_SERVER_URL,
};
```

<div className=" border-gray-400 -mt-7 -z-10">
<div className="h-3 border-l border-r">
</div>
<div className="border border-t-0 rounded-b-lg px-4 text-sm py-2">
config.ts - frontend-admin/src/config/config.ts
</div>
</div>

Secret: No.

Git ignored: No.

#### Store

**`config.ts`** - `frontend-store-2/src/config/config.ts`

```ts
export const SERVER_PORT = 9800;

const PRODUCTION_SERVER_URL = "https://shopfashion-server.joohom.dev";
const LOCAL_SERVER_URL = `http://localhost:${SERVER_PORT}`;

export const config = {
  SERVER_URL:
    import.meta.env.VITE_APP_ENV === "production"
      ? PRODUCTION_SERVER_URL
      : LOCAL_SERVER_URL,
  STORE_FRONT_PORT: 9802,
};
```

Secret: No.

Git ignored: No.

<br />

**`stripe-config.ts`** - `frontend-store-2/src/config/stripe-config.ts` (git ignored)

```ts
export const STRIPE_PUBLISHABLE_KEY = "pk_test_5133...";
```

Secret: No.

Git ignored: Yes.

### 2. Back-end

`application.properties` - `backend/src/main/resources/application.properties`

```
spring.datasource.url=jdbc:postgresql://localhost:5432/jooq_shopfashion_playground
spring.datasource.e2e.url=jdbc:postgresql://localhost:5432/jooq_shopfashion_playground_e2e
security.basic.enable: false
security.ignored=/**
server.port=9800
server.domain=http://localhost:9800
jwt_key=zdD4...
stripe_api_key=sk_test_51O2...
```

`application-test.properties` - `backend/src/main/resources/application-test.properties`

(logging setting) `backend/src/main/resources/logback-spring.xml`

### 3. Docker

**1. `seed_admin.sql`** - `backend/docker/seed_admin.sql`

```sql
INSERT INTO admins (email, password, username) VALUES
('admin', 'admin123', 'admin');
```

**2. `docker-compose.yml`** - `backend/docker/docker-compose.yml`

```yml
version: "2"
name: shopfashion
services:
  shopfashion-app:
    image: "shopfashion-test-server-1:latest"
    build:
      context: ..
      dockerfile: ./docker/app.Dockerfile
    container_name: shopfashion-test-server-1
    ports:
      - "9800:9800" # ⬅️ Make sure that these settings sync with application.properties
    volumes:
      - "shopfashion-test-server-1-asset:/app/images_upload"
    depends_on:
      - shopfashion-test-docker-1-db
    networks:
      - shopfashion-test-server-1
  shopfashion-db:
    image: "postgres:15.1-alpine"
    build:
      context: ..
      dockerfile: ./docker/db.Dockerfile
    environment:
      POSTGRES_DB: test_shopfashion_script # ⬅️ Make sure that these settings sync with application.properties
      POSTGRES_USER: postgres # ⬅️ Make sure that these settings sync with application.properties
      POSTGRES_PASSWORD: postgres # ⬅️ Make sure that these settings sync with application.properties
    expose:
      - 5432
    networks:
      - shopfashion-test-server-1
    volumes:
      - ""

volumes:
  shopfashion-db:
    driver: local
    driver_opts:
      type: "none"
      o: "bind"
      device: ./docker-volumes/shopfashion-test-server-1-assets
  shopfashion-static-assets:
    driver: local
    driver_opts:
      type: "none"
      o: "bind"
      device: ./docker-volumes/shopfashion-test-server-1-assets

networks:
  shopfashion-test-server-1:
```

When using Docker, user also need to configure the other configurations that affect the back-end and the scripts related to back-end (e.g data seeding), and make sure they sync with `docker-compose.yml` settings:

- `application.properties` - `backend/src/main/resources/application.properties`

- `.env` - `scripts.env`

### 4. Scripts

`.env` - `scripts/.env`

```sh
DATABASE_URL=postgres://postgres@localhost:5432/jooq_shopfashion_playground
E2E_DATABASE_URL=postgres://postgres@localhost:5432/jooq_shopfashion_playground_e2e

# For seeding of assets (e.g product images)
SEED_ASSET_SOURCE=src/seed/seed-assets
SEED_ASSET_DESTINATION=../static

# For manual seeding of admin through node script: `npm run seed-admin` / `tsx main-seed-admin.ts`
ADMIN_SEED_EMAIL=admin
ADMIN_SEED_PASSWORD=admin123
ADMIN_SEED_USERNAME=admin
```
