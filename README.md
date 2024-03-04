# shopfashion README

# shopfashion

A fashion e-commerce application

# 1. Features

| Website | Features                                                                                                                                                                                                                                                                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin   | **Sales dashboard**<br>- Sales summary graph<br>- Recent customers and orders<br><br>**Product Management**<br>- Products<br>- Product variants<br>- Product taxons (or categories)<br>- Product associations<br><br>**Sales Management**<br>- Orders listing<br>- Manage orders status<br>- Customers listing |
| Store   | **Products**<br>- Browse products by categories<br>- Search, filter, sort products by criteria e.g price<br>- Shopping cart<br><br>**Purchase**<br>- Purchase products<br>- Stripe checkout<br><br>**Customer**<br>- Review products<br>- Manage past purchases<br>- Login and create account                  |

# 2. Deployment (Local)

**Step 1: Compile**
Compile back-end

```
./mvnw clean package -DskipTests
```

Compile front-end

```
cd frontend-admin
pnpm run build
```

```
cd frontend-store
pnpm run build
```

**Step 2: Run the backend**

```
cd backend
pm2 start pm2/ecosystem.config.js
```

OR

```
java -jar target/app.jar
```

> **Note** If you're using PM2, and there is error in running `ecosystem.config.js`, maybe the current working directory is wrong. After you have made fixes to `ecosystem.config.js` you need to stop and delete the PM2 process first before you can run `pm2 restart ecosystem.config.js`, otherwise the changes in `ecosystem.config.js` won't take effect.

**Step 3: Make sure NGINX is running and is serving the FE and BE**

NGINX setting:

```
cd /opt/homebrew/etc/nginx
```

Certificate setting:

```
cd ~/cert
```

Hosts setting:

```
nano /etc/hosts
```

**Step 4: Done. Visit site on browser**

# 3. Deployment (Using Docker, Local)

**Step 1: Run back-end with Docker**

```
docker-compose up
```

The data of database will be created in `docker` folder.

**Step 2: Compile front-end**

```
cd frontend-admin
pnpm run build
```

```
cd frontend-store
pnpm run build
```

**Step 3: Make sure NGINX is running and is serving the FE and BE**

**Step 4: Done. Visit browser to browse website**

# 4. Configuration
