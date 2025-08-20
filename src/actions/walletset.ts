import { defineAction } from 'astro:actions';
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: `${getSecret("API_KEY")}`,
  entitySecret: `${getSecret("ENTITY_SECRET")}`,
});

const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

export const walletset = {
  create: defineAction({
    accept: "form",
    input: z.object({
      walletSetName: z.string(),
    }),
    handler: async (input) => {
      const walletSet = await client.createWalletSet({
        name: `${slugify(input.walletSetName)}-wallet-set`,
      })
      return walletSet.data;
    },
  }),
  pagination: defineAction({
    input: z.object({
      url: z.string(),
    }),
    handler: async (input) => {
      const url = input.url;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getSecret('API_KEY')}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(url, options);
      const json = await response.json();
      const data = json.data;
      return data;
    },
  }),
}