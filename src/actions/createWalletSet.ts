import { defineAction } from 'astro:actions';
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: `${getSecret("API_KEY")}`,
  entitySecret: `${getSecret("ENTITY_SECRET")}`,
});

const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

export const createWalletSet = {
  createWalletSet: defineAction({
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
  })
}