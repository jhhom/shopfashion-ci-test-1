import { loadConfig } from "@seed/seed/config";
import { customers as _seedCustomers } from "@seed/data/customers";
import { options as _seedOptions } from "@seed/data/product-options";

import { seed } from "@seed/seed/seed";

// location relative to `packages/scripts` or the directory script is executed
const ASSET_SOURCE = "src/scripts/seed-db/seed-assets";
const ASSET_COPY_DESTINATION = "../backend/src/main/resources/static";

const config = loadConfig();

seed(config.DATABASE_URL, {
  seed: true,
  assetSource: ASSET_SOURCE,
  assetCopyDestination: ASSET_COPY_DESTINATION,
});
