import type { FC } from "react";

type LoadingButtonProps = {
  progress: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const LoadingButton: FC<LoadingButtonProps> = ({
  progress,
  children,
  ...props
}) => {
  const { className, ...buttonProps } = props;
  return (
    <button
      className={
        "overflow-hidden rounded-full bg-secondary" + " " + (className || "")
      }
      {...buttonProps}
    >
      <div
        className="relative h-full w-full bg-primary"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="relative -top-full mx-auto flex h-full w-full items-center justify-center text-center font-bold text-white">
        {children}
      </div>
    </button>
  );
};

export default LoadingButton;
