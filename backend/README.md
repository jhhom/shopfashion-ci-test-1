## Shopfashion

To copy over database

```
pg_dump -d fashionable > dump-fashionable.sql
```

Load the database

```
psql -d spring_shopfashion_1 < dump-fashionable.sql
```

To generate the Jooq models, run:

```
./mvnw compile exec:java -Dexec.mainClass="com.example.demo.scripts.GenerateJooqModels"
```

For health-check, you may visit URL:

```
http://localhost:9090/health/check
```

It should return "ShopFashion back-end is running" if the back-end is running.

Run the backend with

```
pm2 start ecosystem.config.js
```

To run in E2E environment, run

```
mvn spring-boot:run -Dspring-boot.run.arguments=--environment.e2e=true
```

To run all tests:

```
./mvnw clean test
```

To run the Cucumber test only:

```
./mvnw clean test -Dtest="CucumberIntegrationTest"
```
