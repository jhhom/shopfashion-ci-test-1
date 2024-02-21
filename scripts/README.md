Project setup based on following guide:

[dev.to: How to setup TypeScript, NodeJS, Express](https://dev.to/cristain/how-to-set-up-typescript-with-nodejs-and-express-2023-gf)

To run the seed, run from the folder `scripts`:

```
tsx src/seed/main.tsx
```

## To run migration

Run migration at the `scripts` directory.

`knex migrate:make create_volunteers_table --knexfile knexfile.cjs`

`knex migrate:latest --knexfile src/migrate-db/knexfile.cjs`

`knex migrate:latest --knexfile src/migrate-db/knexfile.cjs --env=e2e`

`knex migrate:up --knexfile knexfile.cjs`

`knex migrate:down --knexfile knexfile.cjs`

Or you may also use the `package.json` commands:

`pnpm run migrate-db`

`pnpm run migrate-db:e2e`
