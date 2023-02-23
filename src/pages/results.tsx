import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Propmt } from "../data/prompts";
import { Question, questionSchema } from "../data/questions";
import { api } from "../utils/api";

const ResultsPage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    console.log("Status check");
    if (status === "unauthenticated") {
      void router.push("/");
      return;
    }
    if (!localStorage.getItem("MVPBuilder_answers")) {
      void router.push("/");
      return;
    }
  }, [status, router]);

  const [results, setResults] = useState<
    { result: string; title: string; prompt: string }[] | null
  >(null);

  const resultsMutation = api.ai.getAIAnalysis.useMutation({
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("MVPBuilder_results", JSON.stringify(data.response));
      setResults(data.response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (!results && resultsMutation.isIdle) {
      const storedResults = JSON.parse(
        localStorage.getItem("MVPBuilder_results") || "null"
      ) as (Propmt & {
        result: string;
      })[];
      if (storedResults) {
        console.log("Using results from local storage instead of calling API");
        setResults(storedResults);
      } else {
        console.log("Calling API for results");
        const storedAnswers = JSON.parse(
          localStorage.getItem("MVPBuilder_answers") || "null"
        ) as z.infer<typeof questionSchema>;
        resultsMutation.mutate(storedAnswers);
      }
    }
  }, [resultsMutation, results]);

  console.log(results);
  return (
    <>
      <Head>
        <title>MVP Builder</title>
        <meta name="description" content="MVP Builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-between bg-neutral-800 bg-gradient-to-tr from-gray-800 to-black">
        <div
          className={
            "flex h-full w-full flex-col items-center justify-between gap-8 p-8 "
          }
        >
          <div className="flex w-full max-w-4xl flex-col gap-8 px-8">
            <h1 className="text-center text-4xl text-white">Results</h1>
            {results &&
              results.map((result) => (
                <div key={result.title}>
                  <h2 className="text-4xl text-white">{result.title}</h2>
                  <p className="whitespace-pre-wrap text-xl text-white">
                    {result.result}
                  </p>
                </div>
              ))}
          </div>
          <div className="relative h-12 w-56 opacity-80">
            <Image src="/images/bestem.svg" alt="Bestem.dev" fill />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
