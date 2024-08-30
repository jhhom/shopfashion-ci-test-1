# shopfashion

## Table of contents

- [1. Features](#1-features-)
- [2. Screenshots](#2-screenshots-)
- 3 to 6. Engineering Practices
  - [3. Testing](#3-engineering-practices---automated-testing-)
  - [4. Logging](#4-engineering-practices---logging-)
  - [5. Code convention / Standardisation](#5-engineering-practices---code-convention--standardisation-)
  - [6. Containerisation](#6-engineering-practices---containerisation-)
- [7. Development guide](#7-development-guide-)
- [8. Screenshots of every feature](#8-screenshots-of-every-feature-)
  - [8.1 Admin](#81-admin-)
  - [8.2 Store](#82-store-)

////

### Project Description

A fashion e-commerce application developed with ReactJS, Spring Boot, and PostgreSQL.

It consists of two websites:

1. Store front: A store front for online-shoppers to browse and purchase products

2. Admin Panel: An admin interface for managing the products published on the store front website, the registered customers and orders placed.

## 1. Features [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

| Website | Features                                                                                                                                                                                                                                                                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin   | **Sales dashboard**<br>- Sales summary graph<br>- Recent customers and orders<br><br>**Product Management**<br>- Products<br>- Product variants<br>- Product taxons (or categories)<br>- Product associations<br><br>**Sales Management**<br>- Orders listing<br>- Manage orders status<br>- Customers listing |
| Store   | **Products**<br>- Browse products by categories<br>- Search, filter, sort products by criteria e.g price<br>- Shopping cart<br><br>**Purchase**<br>- Purchase products<br>- Stripe checkout<br><br>**Customer**<br>- Review products<br>- Manage past purchases<br>- Login and create account                  |

## 2. Screenshots [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

Admin

<img style="max-height: 600px; display: block; margin: 0 auto; margin-bottom: 20px;" src="/docs/media/admin-dashboard.png">

Store

<img style="max-height: 600px; display: block; margin: 0 auto; margin-bottom: 20px;" src="/docs/media/store-list-search.png">

Mobile

<img style="width: 240px; margin: 0 auto; display: block;" src="/docs/media/mobile-polo.png" />

## 3. Engineering Practices - Automated Testing [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

### 3.1 Unit testing

- [Front-end unit test example](https://github.com/jhhom/shopfashion/blob/master/frontend-store/src/pages/ProductDetails/components/get-disabled-options/get-disabled-options-3.test.ts#L37-L116)

- [Back-end unit test example](https://github.com/jhhom/shopfashion/blob/master/backend/src/test/java/com/example/demo/example/util/TaxonUtilTest.java#L79-L147)

### 3.2 Integration testing

- [Front-end integration test example](https://github.com/jhhom/shopfashion/blob/master/frontend-store/src/pages/layouts/Root.layout/components/Search.test.tsx#L105-L126)
- [Mocking back-end with MSW example](https://github.com/jhhom/shopfashion/blob/master/frontend-store/src/pages/layouts/Root.layout/components/Search.test.tsx#L78-L94)

- [Back-end integration test example 1](https://github.com/jhhom/shopfashion/blob/master/backend/src/test/java/com/example/demo/example/controllers/DashboardControllerTest.java#L29-L54)
- [Back-end integration test example 2](https://github.com/jhhom/shopfashion/blob/master/backend/src/test/java/com/example/demo/example/apis/CustomersApiTest.java#L47-L104)
- [Back-end mocking Stripe payment service for testing example](https://github.com/jhhom/shopfashion/blob/master/backend/src/test/java/com/example/demo/example/apis/CustomersApiTest.java#L96-L102)

### 3.3 End-to-end (E2E) testing

- [Admin E2E test example](https://github.com/jhhom/shopfashion/blob/master/e2e/tests/admin.spec.ts)

### 3.4 Test helpers

- [Code example: Test helper for simplifiying the login setup process in testing APIs requiring authentication](https://github.com/jhhom/shopfashion/blob/master/backend/src/test/java/com/example/demo/example/TestWithCurrentCustomer.java#L20-L48)

### 3.5 Cucumber test (Behavior-driven development)

- [Code example: Cucumber feature](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/test/resources/features/product.feature)

- [Code example: Cucumber test step definitions](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/test/java/com/example/demo/cucumber/ProductSearchStepDefinitions.java#L30-L59)

![](/docs/media/cucumber-test-results.png)

Generated-report from running Cucumber test

## 4. Engineering Practices - Logging [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

- [Code example: Request ID generation](https://github.com/jhhom/shopfashion/blob/master/backend/src/main/java/com/example/demo/config/ProjectConfig.java#L101-L105)

  - Request ID is an added contextual information to help trace which log happen as part of handling which request

- [Code example: Logging of HTTP requests and responses](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/main/java/com/example/demo/filters/HttpLoggingFilter.java#L35-L83)

- [Code example: Logging of unhandled exceptions](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/main/java/com/example/demo/filters/HttpLoggingFilter.java#L31-L60)

- [Code example: Logging of all SQL queries](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/main/java/com/example/demo/config/JooqExecuteListener.java#L35-L41)

- [Code example: Logging of business logic-specific event](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/src/main/java/com/example/demo/services/store/customers/checkout/RequestCheckoutService.java#L77)

## 5. Engineering Practices - Code convention / standardisation [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

Back-end code organization

```
src/main/java/com/example/demo
|
+-- config
|
+-- controllers         # Spring controllers
|
+-- filters             # Spring filters
|
+-- jackson
|
+-- jooqmodels          # Generated Jooq models
|
+-- logging             # General logging data models and class
|
+-- repositories        # Repositories
|
+-- scripts             # Scripts that can be run standalone for one-off tasks like code generation
|
+-- services            # Services
|
+-- utils               # General utility, pure functions that are used across the codebase
|
+-- DemoApplication.java        # Entry point to the application
```

Front-end code organization

```
src
|
+-- assets
|
+-- config
|
+-- external
|
+-- pages
|
+-- providers
|
+-- routes
|
+-- api-contract
|
+-- stores
|
+-- utils
|
+-- App.tsx
|
+-- main.tsx
```

## 6. Engineering Practices - Containerisation [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

In this project, the back-end infrastructure is containerized. This eases the developer in getting the back-end running as quickly and easily as possible without having to worry about installing the infrastructure components such as Java and PostgreSQL in their computer.

After setting up the configurations, we just need to run docker compose up -f ./docker/docker-compose.yml to run the back-end.

[Code example: Dockerfile](https://github.com/jhhom/portfolio-draft-1.shopfashion/blob/master/backend/docker/app.Dockerfile)

## 7. Development guide [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

Follow the instructions in [CONFIGURATION.md](CONFIGURATION.md) and [SETUP.md](SETUP.md) to setup the application in your local computer for development.

## 8. Screenshots of every feature [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

### 8.1 Admin [🔼](#table-of-contents)

![](/docs/media/feature-screenshots/admin/1-dashboard.png)

Sales dashboard / summary

![](/docs/media/feature-screenshots/admin/1-products.png)

Manage products

![](/docs/media/feature-screenshots/admin/3-edit-prod-option.png)

Edit products

![](/docs/media/feature-screenshots/admin/4-orders.png)

Manage orders: Update order status

![](/docs/media/feature-screenshots/admin/5-orders-listing.png)

Manage orders: Find unfulfilled orders efficiently with data table filter

### 8.2 Store [🔼](#table-of-contents)

[🔼 Back to top](#table-of-contents)

![](/docs/media/feature-screenshots/store/1-products-listing.png)

Browse products

![](/docs/media/feature-screenshots/store/2-search.png)

Search products

![](/docs/media/feature-screenshots/store/3-cart.png)

Add products to shopping cart

![](/docs/media/feature-screenshots/store/4-checkout.png)

Checkout and purchase

![](/docs/media/feature-screenshots/store/5-stripe.png)

Stripe payment

![](/docs/media/feature-screenshots/store/6-thank-you.png)

After-purchase thank you

![](/docs/media/feature-screenshots/store/7-review-product.png)

Review products

![](/docs/media/feature-screenshots/store/8-reviews.png)

List all reviews

![](/docs/media/feature-screenshots/store/9-product-details.png)

Product details
