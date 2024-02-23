import { loadSeedConfig } from "@seed/config";
import { customers as _seedCustomers } from "@seed/data/customers";
import { options as _seedOptions } from "@seed/data/product-options";

import { seed } from "@seed/seed";

// location relative to `packages/scripts` or the directory script is executed
const config = loadSeedConfig();

seed(config.DATABASE_URL, {
  seed: true,
  assetSource: config.SEED_ASSET_SOURCE,
  assetCopyDestination: config.SEED_ASSET_DESTINATION,
});
