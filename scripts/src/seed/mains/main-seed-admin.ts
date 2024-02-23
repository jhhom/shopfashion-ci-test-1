import { loadSeedAdminConfig } from "@seed/config";
import { customers as _seedCustomers } from "@seed/data/customers";
import { options as _seedOptions } from "@seed/data/product-options";

import { seedAdmin } from "@seed/seed-admin/seed-admins";

const config = loadSeedAdminConfig();

seedAdmin(config.DATABASE_URL, {
  username: config.ADMIN_SEED_USERNAME,
  password: config.ADMIN_SEED_PASSWORD,
  email: config.ADMIN_SEED_EMAIL,
});
