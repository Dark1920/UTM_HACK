type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  message?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className={`${sizeStyles[size]} rounded-full border-4 border-stone-100 border-t-primary-500 animate-spin`} />
        {size === "lg" && (
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-secondary-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        )}
      </div>
      {message && (
        <p className="text-sm text-stone-500 font-medium">{message}</p>
      )}
    </div>
  );
}
