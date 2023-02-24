import { z } from "zod";
import { questionSchema } from "../../../data/questions";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { Configuration, OpenAIApi } from "openai";
import { prisma } from "../../db";
import { prompts as prompts } from "../../../data/prompts";
import { env } from "../../../env.mjs";
import { TRPCError } from "@trpc/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiRouter = createTRPCRouter({
  // getAIAnalysis: protectedProcedure
  //   .input(questionSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const formPromise = prisma.formResults.create({
  //       data: {
  //         formInput: input,
  //         ownerId: ctx.session.user.id,
  //       },
  //     });

  //     const basePrompt =
  //       "Context data:\n" +
  //       Object.entries((k: string, v: string) => k + ": " + v).join("\n") +
  //       "\n\nUsing the previous data, ";
  //     prompts[0]!.prompt;

  //     const results = await Promise.all(
  //       prompts.map(async ({ prompt, title }) => {
  //         const completion = await openai.createCompletion({
  //           model: "text-davinci-003",
  //           // model: "text-curie-001",
  //           // model: "text-ada-001",
  //           prompt: basePrompt + prompt,
  //           max_tokens: 256,
  //         });
  //         return {
  //           title,
  //           prompt,
  //           result: completion.data.choices[0]!.text || "",
  //         };
  //       })
  //     );
  //     console.log(results);

  //     const savedForm = await formPromise;
  //     await prisma.formResults.update({
  //       where: {
  //         id: savedForm.id,
  //       },
  //       data: {
  //         results: results,
  //       },
  //     });
  //     return {
  //       response: results,
  //     };
  //   }),
  generateIndividualAIAnalysis: publicProcedure //protectedProcedure
    .input(
      z.object({
        field: z.string(),
        questions: z.array(z.string()),
        responses: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      // setTimeout(() => {
      //   throw new TRPCError({
      //     code: "TIMEOUT",
      //     message: "Request timed out",
      //   });
      // }, 10000);
      console.log({ field: input.field });
      const promptData = prompts[input.field];
      const prompt =
        "Context data:\n" +
        input.questions.concat(input.responses).join("\n") +
        "\n\nUsing the previous data, " +
        promptData!.prompt;

      console.log(prompt);
      const completion = await openai.createCompletion({
        model: process.env.TEXT_MODEL || "text-ada-001",
        // model: "text-davinci-003"
        prompt: prompt,
        max_tokens: 128,
      });
      const results = completion.data.choices[0]!.text || "";

      // await prisma.formResults.create({
      //   data: {
      //     formInput: input,
      //     ownerId: ctx.session.user.id,
      //     results,
      //   },
      // });

      return {
        title: promptData!.title,
        prompt,
        result: results,
      };
    }),
});
