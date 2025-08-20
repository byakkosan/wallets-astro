import { defineAction } from 'astro:actions';
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const client = initiateDeveloperControlledWalletsClient({
  apiKey: `${getSecret("API_KEY")}`,
  entitySecret: `${getSecret("ENTITY_SECRET")}`,
});

export const wallet = {
  create: defineAction({
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
  }),
  dripTestnetTokens: defineAction({
    accept: "form",
    input: z.object({
      address: z.string(),
      blockchain: z.string(),
      native: z.boolean(),
      usdc: z.boolean(),
      eurc: z.boolean(),
    }),
    handler: async (input) => {
      const apiKey = getSecret("API_KEY");
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: input.address,
          blockchain: input.blockchain,
          native: input.native,
          usdc: input.usdc,
          eurc: input.eurc
        })
      };
      
      fetch('https://api.circle.com/v1/faucet/drips', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    },
  })
}