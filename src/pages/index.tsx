import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FC } from "react";
import LoadingButton from "../components/LoadingButton";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
import "swiper/css";
import { Question, questions, questionSchema } from "../data/questions";

import type { Swiper as SwiperType } from "swiper/types";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormItem from "../components/FormItem";
import { signIn, useSession } from "next-auth/react";
import { api } from "../utils/api";

const FAST_MODE = process.env.NEXT_PUBLIC_FAST_MODE === "true";
const Home: NextPage = () => {
  const [stage, setStage] = useState<"loading" | "loaded">("loading");
  const [initialLoadProgress, setInitialLoadProgress] = useState(
    FAST_MODE ? 100 : 0
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setInitialLoadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("loaded");
          }, 500);
          return prevProgress;
        } else {
          return prevProgress + 1 / 3;
        }
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);
  const stages = {
    loading: (
      <div
        className={
          "flex h-full w-full flex-col items-center justify-center transition-all duration-1000" +
          (initialLoadProgress >= 100 ? " opacity-0" : "")
        }
      >
        <div className="relative h-12 w-56 opacity-80">
          <Image src="/images/bestem.svg" alt="Bestem.dev" fill />
        </div>
        <LoadingButton progress={initialLoadProgress} className="m-4 h-12 w-56">
          MVP Builder
        </LoadingButton>
      </div>
    ),
    loaded: <QuestionView questions={questions}></QuestionView>,
  };

  return (
    <>
      <Head>
        <title>MVP Builder</title>
        <meta name="description" content="MVP Builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-between bg-neutral-800 bg-gradient-to-tr from-gray-800 to-black">
        {stages[stage]}
      </div>
    </>
  );
};

export default Home;

interface QuestionViewProps {
  questions: Question[];
}

const QuestionView: FC<QuestionViewProps> = ({ questions }) => {
  if (!questions.length) throw new Error("No questions provided");
  const progressStages = useMemo(() => {
    let stages: number[] = [0];
    questions.forEach((q) => {
      stages.push((stages[stages.length - 1] || 0) + q.progressWeight);
    });
    stages = stages.map((s) => (s / stages[stages.length - 1]!) * 100);

    return stages;
  }, [questions]);

  // For another version of this I think we can prescind of react-hook-form and just use zod
  // It's a bit overkill for this use case and it doen't actually fit the use case very well
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    mode: "all",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    defaultValues: JSON.parse(
      localStorage.getItem("MVPBuilder_answers") || "{}"
    ),
  });

  const { data: session, status } = useSession();
  console.log(session, status);

  const [swiper, updateSwiper] = useState<SwiperType | undefined>();
  const [progressIndex, setProgressIndex] = useState<number>(0);
  swiper?.onAny(() => {
    if (progressIndex === swiper.activeIndex) return;
    setProgressIndex(swiper.activeIndex);
    localStorage.setItem("MVPBuilder_answers", JSON.stringify(getValues()));
  });

  return (
    <>
      <div className="h-2 w-full bg-secondary">
        <div
          className="h-2 bg-primary transition-all duration-1000"
          style={{ width: `${progressStages[swiper?.activeIndex || 0]!}%` }}
        ></div>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <Swiper
          direction={"vertical"}
          pagination={{
            clickable: true,
          }}
          onSwiper={(swiper) => {
            updateSwiper(swiper);
          }}
          className=" mx-auto flex w-full"
        >
          {questions.map((question, index) => (
            <SwiperSlide key={index}>
              {({ isActive, isNext, isPrev }) =>
                isActive || isNext || isPrev ? (
                  <>
                    <FormItem
                      {...question}
                      register={register}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                      errors={(errors as any)[question.id] || {}}
                      control={control}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                      // value={(getValues as any)[question.id]}
                    />
                    {index === 0 ? (
                      <span className="absolute left-1/2 bottom-0 -mx-32 w-64 animate-pulse text-center text-xs text-neutral-400">
                        You can swipe up or down to navigate
                      </span>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )
              }
            </SwiperSlide>
          ))}
          <SwiperSlide key={questions.length}>
            {({ isActive }) => {
              const resultsMutation = api.ai.getAIAnalysis.useMutation({
                onSuccess: (data) => {
                  console.log(data);
                  localStorage.setItem(
                    "MVPBuilder_results",
                    JSON.stringify(data)
                  );
                },
                onError: (error) => {
                  console.log(error);
                },
              });

              return (
                <div
                  className=" mx-auto flex h-screen max-w-screen-md flex-col items-center justify-center gap-2 p-10 transition-all duration-1000"
                  style={{
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <h1 className="text-center text-4xl font-bold text-white">
                    Thank you for your time!
                  </h1>
                  {status === "authenticated" ? (
                    <>
                      <h2 className="text-center text-2xl font-light text-white">
                        We will use AI to evaluate your project and offer you
                        feedback and suggestions
                      </h2>
                      <h3 className="text-center font-light text-neutral-400">
                        Or you can swipe up to edit your answers
                      </h3>
                      <button
                        id="resultsButton"
                        onClick={() => void resultsMutation.mutate(getValues())}
                        className="my-4 flex h-12 w-48 items-center justify-center gap-4 rounded-xl bg-primary bg-gradient-to-r from-secondary to-primary text-lg font-bold text-white outline-none focus:ring-4 focus:ring-primary/50 hover:opacity-95"
                      >
                        See Results
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-center text-2xl font-light text-white">
                        Login to see your MVP
                      </h2>
                      <button
                        className="my-8 flex h-14 w-64 items-center justify-center gap-4 rounded-xl bg-primary bg-gradient-to-r from-secondary to-primary text-lg font-bold text-white outline-none focus:ring-4 focus:ring-primary/50 hover:opacity-95"
                        onClick={() =>
                          void signIn("google", {
                            callbackUrl: "/results",
                          })
                        }
                      >
                        Sign in with Google
                        <img
                          alt="google"
                          src="/images/btn_google_dark_normal_ios.svg"
                          className="h-10 w-10 rounded-xl"
                        />
                      </button>
                    </>
                  )}
                </div>
              );
            }}
          </SwiperSlide>
        </Swiper>
      </div>
      <Link href="https://bestem.dev" className="opacity-60 hover:opacity-50">
        <div className="mb-32 -mt-44 flex flex-col items-center justify-center gap-2">
          <h2 className="text-center text-lg font-light text-white">
            Developed by:
          </h2>
          <div className="relative h-10 w-40">
            <Image src="/images/bestem.svg" alt="Bestem.dev" fill />
          </div>
        </div>
      </Link>
    </>
  );
};
