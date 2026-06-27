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

const variantStyles: Record<ColorVariant, { bg: string; icon: string; ring: string }> = {
  amber: { bg: "bg-gradient-to-br from-primary-50 to-primary-100", icon: "text-primary-600", ring: "ring-primary-200/50" },
  blue: { bg: "bg-gradient-to-br from-info-50 to-info-100", icon: "text-info-600", ring: "ring-info-200/50" },
  green: { bg: "bg-gradient-to-br from-success-50 to-success-100", icon: "text-success-600", ring: "ring-success-200/50" },
  orange: { bg: "bg-gradient-to-br from-secondary-50 to-secondary-100", icon: "text-secondary-600", ring: "ring-secondary-200/50" },
  red: { bg: "bg-gradient-to-br from-error-50 to-error-100", icon: "text-error-600", ring: "ring-error-200/50" },
  purple: { bg: "bg-gradient-to-br from-purple-50 to-purple-100", icon: "text-purple-600", ring: "ring-purple-200/50" },
};

export function StatCard({ icon, value, label, trend, variant = "amber" }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={["flex h-12 w-12 items-center justify-center rounded-xl ring-1", styles.bg, styles.ring].join(" ")}>
          <span className={styles.icon}>{icon}</span>
        </div>

        {trend && (
          <div
            className={[
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              trend.direction === "up"
                ? "bg-success-100 text-success-700"
                : "bg-error-100 text-error-700",
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

      <div className="mt-5">
        <p className="text-3xl font-bold text-stone-900 tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}
