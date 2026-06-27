type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeStyles[size]} rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin`}
      />
      {message && <p className="text-sm text-stone-500">{message}</p>}
    </div>
  );
}
