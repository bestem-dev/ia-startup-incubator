import { Listbox, Transition } from "@headlessui/react";
import type { FC, ReactNode } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { Control, FieldValues, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSwiper, useSwiperSlide } from "swiper/react";
import type { Question } from "../data/questions";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
interface FormItemProps<TFieldValues extends FieldValues = any>
  extends Question {
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  errors: { [key: string]: string };
}

const FormItem: FC<FormItemProps> = ({
  id,
  question,
  dataType,
  subtext,
  options,
  placeholder,
  checkBoxText,
  register,
  control,
  errors,
}) => {
  const swiper = useSwiper();
  const slide = useSwiperSlide();
  const [ignoreError, setIgnoreError] = useState<boolean>(true);
  const fieldError = !!Object.keys(errors).length;
  const displayError = fieldError && !ignoreError;
  const enterPass = dataType !== "multilinetext";

  if (slide.isActive) {
    swiper.allowSlideNext = !fieldError;
    document.getElementById(id)?.focus({ preventScroll: true });
  }

  const next = useCallback(() => {
    setIgnoreError(false);
    console.log("next");
    swiper.slideNext(500);
  }, [swiper]);

  useEffect(() => {
    if (slide.isActive && enterPass) {
      function onEvent(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }

          setTimeout(() => {
            next();
          }, 0);
        }
      }
      document.addEventListener("keypress", onEvent);
      return () => {
        document.removeEventListener("keypress", onEvent);
      };
    }
  }, [slide.isActive, next, enterPass]);

  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }

  const inputComponents = {
    text: (
      <>
        <InputBox displayError={displayError}>
          <input
            id={id}
            {...register(id)}
            className={
              "decoration-none h-12 w-full rounded-full bg-neutral-800 p-2 px-4 text-white outline-none focus:ring-4 " +
              "focus:ring-offset-1 focus:ring-offset-transparent " +
              (displayError ? "focus:ring-error/50" : "focus:ring-primary/50")
            }
            type={dataType}
            placeholder={placeholder}
          />
        </InputBox>
        <ErrorText displayError={displayError} errors={errors} />
      </>
    ),
    select: (
      <>
        <InputBox>
          <Controller
            render={({ field }) => (
              <Listbox {...field}>
                {({ open }) => (
                  <div className="relative h-full w-full">
                    <Listbox.Button
                      className={
                        "decoration-none flex h-full w-full items-center justify-between rounded-full bg-neutral-800 p-2 px-4 text-white outline-none focus:ring-4 " +
                        "focus:ring-offset-1 focus:ring-offset-transparent " +
                        (displayError
                          ? "focus:ring-error/50"
                          : "focus:ring-primary/50")
                      }
                    >
                      <span className="flex items-center">
                        <span className="ml-3 block truncate">
                          {field.value || "Select an option"}
                        </span>
                      </span>
                      <span className="">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-3xl bg-neutral-600  text-white shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none sm:text-sm">
                        {options &&
                          options.map((o) => (
                            <Listbox.Option
                              key={o}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-secondary text-white"
                                    : "text-gray-300",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={o}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {o}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    >
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            )}
            name={id}
            control={control}
            defaultValue={"Select a value..."}
          />
        </InputBox>
      </>
    ),
    boolean: (
      <div className="flex w-full items-center">
        <div className="inline-flex items-center">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-6"
            htmlFor={id}
            data-ripple-dark="true"
          >
            <input
              type="checkbox"
              className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 p- peer relative h-8 w-8 cursor-pointer appearance-none
              rounded-md border outline-none transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12
              before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-primary
              checked:bg-primary checked:before:bg-primary focus:ring-offset-1 focus:ring-offset-transparent hover:before:opacity-10"
              {...register(id)}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-neutral-900 opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <span className="ml-2 text-lg text-white">{checkBoxText}</span>
        </div>
      </div>
    ),
    multilinetext: (
      <>
        <InputBox displayError={displayError} className="h-64">
          <textarea
            id={id}
            {...register(id)}
            className={
              "decoration-none h-full w-full resize-none rounded-3xl bg-neutral-800 p-2 px-4 text-white outline-none focus:ring-4 " +
              "scrollbar-none scrollbar-track-black focus:ring-offset-1 focus:ring-offset-transparent" +
              " " +
              (displayError ? "focus:ring-error/50" : "focus:ring-primary/50")
            }
            placeholder={placeholder}
          />
        </InputBox>
        <ErrorText displayError={displayError} errors={errors} />
      </>
    ),
  };

  return (
    <div
      className=" mx-auto flex h-screen max-w-screen-md flex-col items-center justify-center gap-2 p-10 transition-all duration-1000"
      style={{
        opacity: slide.isActive ? 1 : 0,
      }}
    >
      {swiper.activeIndex !== 0 && (
        <button
          className="absolute top-4 left-4 h-10 w-14 rounded-xl text-lg font-extrabold text-white
          outline-none focus:ring-4 focus:ring-primary/50 hover:opacity-95"
          type="button"
          style={{
            display: slide.isActive ? "block" : "none",
          }}
          onClick={() => {
            swiper.slidePrev(500);
          }}
        >
          <BackIcon />
        </button>
      )}
      <div className="w-full">
        <h1 className="text-2xl text-white md:text-4xl">{question}</h1>
        <h2 className=" font-light text-neutral-400 md:text-2xl">{subtext}</h2>
      </div>
      {inputComponents[dataType]}

      <div className="mt-4 flex w-full flex-row items-center">
        <button
          className="mr-4 h-10 w-24 rounded-xl bg-primary bg-gradient-to-r from-secondary to-primary text-lg font-extrabold text-white outline-none focus:ring-4 focus:ring-primary/50 hover:opacity-95"
          type="button"
          onClick={() => {
            next();
          }}
        >
          Ok
          <OkIcon />
        </button>
        {enterPass ? (
          <span className="text-white">
            Press <b>Enter</b>
            <EnterIcon />
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const EnterIcon = () => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    <path
      d="M3.7107 3.19097C3.7107 4.24074 3.73283 5.02619 3.70332 5.80786C3.68488 6.26477 3.85088 6.39694 4.28618 6.39316C6.5254 6.37428 8.76461 6.37428 11.0075 6.39316C11.5203 6.39694 11.6162 6.16282 11.6125 5.7059C11.5941 4.04061 11.6346 2.37531 11.5904 0.713796C11.5719 0.0982795 11.7859 -0.00367724 12.3245 9.89376e-05C12.8373 0.00387511 13.0033 0.139817 12.9959 0.679811C12.9664 2.81335 12.959 4.95066 12.9996 7.08798C13.0106 7.69217 12.8151 7.81301 12.2692 7.80545C9.75326 7.77902 7.23737 7.83944 4.72148 7.76769C3.82875 7.74126 3.62216 8.05091 3.70332 8.87034C3.76234 9.48963 3.71439 10.124 3.71439 11.0039C2.42693 9.68599 1.27228 8.50782 0.113934 7.32966C-0.103717 7.10686 0.0290868 6.95581 0.191402 6.78966C1.31286 5.64171 2.43062 4.49752 3.7107 3.19097Z"
      fill="white"
    />
  </svg>
);

const OkIcon = () => (
  <svg
    width="15"
    height="12"
    viewBox="0 0 15 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ml-2 mb-1 inline-block"
  >
    <path
      d="M0.333252 6.03053C0.523196 5.76871 0.758887 5.54833 0.975682 5.31177C1.33568 4.91954 1.70065 4.53135 2.06364 4.14215C2.27745 3.91267 2.4654 3.90762 2.69015 4.12395C3.617 5.01659 4.54485 5.90821 5.4707 6.80186C5.56219 6.89082 5.65866 6.95855 5.79092 6.94844C5.90031 6.93934 5.98186 6.88172 6.05346 6.7968C7.56208 5.01356 9.07169 3.23031 10.5813 1.44807C10.9373 1.02753 11.2924 0.605983 11.6494 0.186455C11.8473 -0.0460549 12.0362 -0.0602076 12.264 0.138942C12.8457 0.646419 13.4265 1.15491 14.0073 1.66441C14.239 1.8676 14.2549 2.05361 14.057 2.28814C12.1337 4.56067 10.2094 6.83319 8.28506 9.10673C7.63468 9.87503 6.98429 10.6433 6.3349 11.4116C6.10518 11.6835 5.9381 11.6926 5.67954 11.444C3.97601 9.80426 2.27248 8.16457 0.567948 6.52588C0.480434 6.44197 0.398887 6.35301 0.333252 6.2499C0.333252 6.17711 0.333252 6.10332 0.333252 6.03053Z"
      fill="white"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    width="22"
    height="21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <path
      d="M5.05372 9.14916C5.15383 9.17942 5.26062 9.17942 5.36073 9.14916H20.6775C20.9299 9.14916 21.0186 9.19689 21.0118 9.47068C21.0118 10.1552 21.0118 10.8397 21.0118 11.5241C21.0118 11.7637 20.9436 11.8119 20.7184 11.8119H5.02642C5.02642 11.9351 5.13558 11.9829 5.19699 12.0445C7.49848 14.3581 9.79997 16.6717 12.1015 18.9853C12.272 19.1564 12.2652 19.2383 12.1015 19.3957C11.5829 19.8885 11.0849 20.395 10.5869 20.9084C10.4845 21.0179 10.4299 21.0316 10.3139 20.9084C6.90264 17.4768 3.49133 14.0544 0.0800277 10.6411C-0.0700698 10.4837 0.0186225 10.4223 0.120962 10.3196L8.06248 2.3521C8.81297 1.59917 9.56346 0.853056 10.3003 0.100122C10.4299 -0.0299298 10.4982 -0.0367746 10.6278 0.100122C11.1258 0.613486 11.6375 1.12015 12.156 1.61983C12.3061 1.77041 12.2925 1.84556 12.156 1.98246L5.2311 8.90952C5.1697 8.99851 5.08101 9.04649 5.05372 9.14916Z"
      fill="white"
    />
  </svg>
);

export default FormItem;

const ErrorText: FC<{
  displayError: boolean;
  errors: { [key: string]: string };
}> = ({ displayError, errors }) =>
  displayError ? (
    <p className="mr-12 w-full text-right text-xs text-error">
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        errors.message
      }
    </p>
  ) : (
    <></>
  );

const InputBox: FC<{
  displayError?: boolean;
  children: ReactNode;
  className?: string;
}> = ({ displayError, children, className }) => (
  <div
    className={
      "mt-4 h-fit w-full rounded-3xl p-[2px]" +
      (displayError ? " bg-error" : " bg-neutral-600") +
      " " +
      (className || "")
    }
  >
    {children}
  </div>
);
