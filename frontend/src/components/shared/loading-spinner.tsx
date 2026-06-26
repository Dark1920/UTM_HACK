import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={[sizeStyles[size], "animate-spin text-blue-600"].join(" ")} />
      {message && (
        <p className="text-sm text-slate-500">{message}</p>
      )}
    </div>
  );
}
