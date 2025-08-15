import { defineAction } from 'astro:actions';
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: `${getSecret("API_KEY")}`,
  entitySecret: `${getSecret("ENTITY_SECRET")}`,
});

export const createWallet = {
  createWallet: defineAction({
    accept: "form",
    input: z.object({
      accountType: z.string(),
      blockChain: z.string(),
      numberOfWallets: z.number(),
      walletSetId: z.string()
    }),
    handler: async (input) => {
      const response = await client.createWallets({
        blockchains: [`${input.blockChain}` as any],
        count: input.numberOfWallets,
        accountType: input.accountType.toUpperCase() as any,
        walletSetId: input.walletSetId,
      });
      return response.data;
    },
  })
}