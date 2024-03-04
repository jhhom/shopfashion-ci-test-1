import { ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { apiContract } from "~/shared/api-contract/store-api/api";
import { config } from "@config/config";

import { authStorage } from "~/external/browser/local-storage/auth";

export const client = initClient(apiContract, {
  baseUrl: config.SERVER_URL,
  baseHeaders: {
    authorization: "",
  },
  api: async (args: ApiFetcherArgs & { myCustomArg?: string }) => {
    if (args.myCustomArg) {
      // do something with myCustomArg ✨
    }

    const token = authStorage.token();
    if (token !== "" && token !== null) {
      try {
        args.headers["authorization"] = `Bearer ${JSON.parse(token)}`;
      } catch {}
    }

    const r = await tsRestFetchApi(args);

    if (!(r.status == 200 || r.status == 201)) {
      console.log(
        "%c >>> Error calling API",
        "background-color: red; color: white;",
      );
      console.log("Error calling API:", args.path);
      console.log("Query", args.rawQuery);
      console.log("Body", args.body);
      console.log("Response", r.status);
      console.log(r.body);
      console.log(
        "%c ---------------------------------------",
        "background-color: blue; color: white;",
      );
    } else {
      console.log(
        "%c >>> API Call success",
        "background-color: darkgreen; color: white;",
      );
      console.log("API:", args.path);
      console.log("Query", args.rawQuery);
      console.log("Body", args.body);
      console.log("Response", r.status);
      console.log(r.body);
      console.log(
        "%c ---------------------------------------",
        "background-color: blue; color: white;",
      );
    }

    return r;
  },
  jsonQuery: true,
});
