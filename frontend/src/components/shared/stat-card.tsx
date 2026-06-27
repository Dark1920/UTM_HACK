import { TrendingUp, TrendingDown } from "lucide-react";

type ColorVariant = "amber" | "blue" | "green" | "orange" | "red" | "purple";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  variant?: ColorVariant;
}

const variantIconColor: Record<ColorVariant, string> = {
  amber: "text-primary-600",
  blue: "text-info-600",
  green: "text-success-600",
  orange: "text-stone-600",
  red: "text-error-600",
  purple: "text-purple-600",
};

export function StatCard({ icon, value, label, trend, variant = "amber" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className={["flex h-9 w-9 items-center justify-center rounded-md border border-stone-200", variantIconColor[variant]].join(" ")}>
          {icon}
        </div>

        {trend && (
          <div
            className={[
              "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
              trend.direction === "up" ? "text-success-700" : "text-error-700",
            ].join(" ")}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold text-stone-900 tracking-tight">{value}</p>
        <p className="mt-0.5 text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}
