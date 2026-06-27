import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-stone-50 to-stone-100 text-stone-300">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-stone-900">{title}</h3>
      {description && (
        <p className="mb-8 max-w-sm text-sm text-stone-500 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
