import { defineAction } from 'astro:actions';
import { getSecret } from "astro:env/server";
import { z } from "astro:schema";

export const dripTestnetTokens = {
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