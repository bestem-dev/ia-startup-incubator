import { z } from "zod";
import { questionSchema } from "../../../data/questions";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { Configuration, OpenAIApi } from "openai";
import { prisma } from "../../db";
import { propmts as prompts } from "../../../data/prompts";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string,
});
const openai = new OpenAIApi(configuration);

export const aiRouter = createTRPCRouter({
  getAIAnalysis: protectedProcedure
    .input(questionSchema)
    .mutation(async ({ input, ctx }) => {
      const formPromise = prisma.formResults.create({
        data: {
          formInput: input,
          ownerId: ctx.session.user.id,
        },
      });

      const basePrompt =
        "Context data:\n" +
        Object.entries((k: string, v: string) => k + ": " + v).join("\n") +
        "\n\nUsing the previous data, ";
      prompts[0]!.prompt;

      const results = await Promise.all(
        prompts.map(async ({ prompt, title }) => {
          const completion = await openai.createCompletion({
            model: "text-davinci-003",
            // model: "text-curie-001",
            // model: "text-ada-001",
            prompt: basePrompt + prompt,
            max_tokens: 256,
          });
          return {
            title,
            prompt,
            result: completion.data.choices[0]!.text || "",
          };
        })
      );
      console.log(results);

      const savedForm = await formPromise;
      await prisma.formResults.update({
        where: {
          id: savedForm.id,
        },
        data: {
          results: results,
        },
      });
      return {
        response: results,
      };
    }),
});
