import { ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { apiContract } from "~/api-contract/admin-api/api";
import { config } from "~/config/config";

import { storage } from "~/external/browser/use-local-storage-auth";

export const client = initClient(apiContract, {
  baseUrl: config.SERVER_URL,
  baseHeaders: {
    authorization: "",
  },
  api: async (args: ApiFetcherArgs & { myCustomArg?: string }) => {
    if (args.myCustomArg) {
      console.log("PAKABOW!!");
      // do something with myCustomArg ✨
    }

    const token = storage.getToken();
    if (token !== null && token !== "") {
      args.headers["authorization"] = `Bearer ${token}`;
    }

    const r = await tsRestFetchApi(args);

    if (!(r.status == 200 || r.status == 201)) {
      console.log(
        "%c >>> Error calling API          ",
        "background-color: red; color: white;"
      );
      console.log("Error calling API:", args.path);
      console.log("Query", args.rawQuery);
      console.log("Body", args.body);
      console.log("Response", r.status);
      console.log(r.body);
      console.log(
        "%c ---------------------------------------",
        "background-color: blue; color: white;"
      );
    } else {
      console.log(
        "%c >>> API Call success           ",
        "background-color: green; color: white;"
      );
      console.log("API:", args.path);
      console.log("Query", args.rawQuery);
      console.log("Body", args.body);
      console.log("Response", r.status);
      console.log(r.body);
      console.log(
        "%c ---------------------------------------",
        "background-color: blue; color: white;"
      );
    }

    return r;
  },
  jsonQuery: true,
});
