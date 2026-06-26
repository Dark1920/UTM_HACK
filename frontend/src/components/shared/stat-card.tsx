import { TrendingUp, TrendingDown } from "lucide-react";

type ColorVariant = "blue" | "green" | "orange" | "red" | "purple";

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

const variantStyles: Record<ColorVariant, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600" },
  red: { bg: "bg-red-50", icon: "text-red-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
};

export function StatCard({ icon, value, label, trend, variant = "blue" }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={["flex h-11 w-11 items-center justify-center rounded-lg", styles.bg].join(" ")}>
          <span className={styles.icon}>{icon}</span>
        </div>

        {trend && (
          <div
            className={[
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.direction === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700",
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
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
