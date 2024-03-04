# How to run the application locally

## Step 1: Configure application

Follow the instructions here to configure the application:

[CONFIGURATION.md](CONFIGURATION.md)

## Step 2 (Optional): Initialize and seed database

If the database is empty, you may need to initialize and seed the database first.

### 1. Initialize database

To initialize database, you can run this command from the project root directory:

```
psql -d shopfashion_db < backend/schema.sql
```

### 2. Seed database

To seed database, you have 2 options:

1. To seed admin only
2. To seed the demo database

**How to: Seed admin only**

From project root directory, cd into scripts directory and run the PNPM or NPM command to run the Node seed script:

```
cd backend/scripts
pnpm run seed-admin
```

The seeded admin is based on credentials configured in `backend/scripts/.env`.

<br />

**How to: Seed demo database**

```
cd backend/scripts
pnpm run seed
```

### Step 3: Run the back-end

We have two ways to run the back-end:

1. Directly running the back-end with Maven
2. Compile the back-end with Maven, the run the output `jar` with `java`

Pick either one way.

For way 1:

```
cd backend
./mvnw spring-boot:run
```

For way 2:

```
cd backend
./mvnw clean package -DskipTests
java -jar target/app.jar
```

Note that you can configure the filename of the output JAR (in this case, it's `app.jar`), in `pom.xml`:

```xml
	<build>
		<plugins>
			...
		</plugins>
        <finalName>app</finalName>
	</build>
```

### Step 4: Run the front-ends

To run the front-end, you have 2 options:

1. Run the front-ends in development mode
2. Build the front-ends, and serve the built output with NGINX

#### 1. Run in development mode

To run the front-ends in development mode, run following commands from project root:

1. Run the store admin

```
cd frontend-admin
pnpm run dev
```

2. Run the store front

```
cd frontend-store-2
pnpm run dev
```

#### 2. Build and serve with NGINX

Alternatively, you can build the front-ends and serve them using NGINX:

1. Build the store admin

```
cd frontend-admin
pnpm run build
```

2. Build the store front

```
cd frontend-store-2
pnpm run build
```

You can then serve the built front-ends with NGINX.

**The build will be stored in `dist` folder (e.g `frontend-store-2/dist`).**

You can change the folder by changing the `outDir` property in `tsconfig.json`.

```json
{
  "compilerOptions": {
    ...
    "outDir": "dist"
  },
  ...
}
```

## With Docker

Setup configuration of Docker according to [CONFIGURATION.md](CONFIGURATION.md).

### Step 1 (Optional): Initialize and seed database

If the database is empty, you may need to initialize and seed the database first.

#### 1. Initialize database

Docker will automatically initialize the database using `backend/schema.sql` and the `backend/docker/seed_admin.sql`.

#### 2. Seed database

To seed database, you can log into a bash session in the server's container, and run the Node script to seed the demo database:

Step 1: Check the container

**How to: Seed admin only**

From project root directory, cd into scripts directory and run the PNPM or NPM command to run the Node seed script:

```
cd backend/scripts
pnpm run seed-admin
```

The seeded admin is based on credentials configured in `backend/scripts/.env`.

<br />

**How to: Seed demo database**

```
cd backend/scripts
pnpm run seed
```

### Step 2: Run the back-end (With Docker)

Before running the application using Docker, make sure that you have the folder for the mounted volumes created in `docker/docker-volumes` based on the volume setting in `docker-compose.yml`.

```
backend/
    docker-volumes/
        assets/
        db/
```

To run the back-end using Docker, from the project root directory, CD into back-end and run the Docker command:

```
cd backend
docker compose -f ./docker/docker-compose.yml up
```

**Recap Docker commands**:

If you want to rebuild the image, use:

```
docker compose -f ./docker/docker-compose.yml build --no-cache
```

You can also use:

```
docker compose -f ./docker/docker-compose.yml up --build
```

To remove container:

```
docker compose -f ./docker/docker-compose.yml down
```

> ⚠️ Note, if you change the database name in docker-compose.yml's `POSTGRES_DB`, remember to delete the mounted volume folder contents for the database before starting the container. Otherwise the change won't be picked up.
