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
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 text-stone-400">
          {icon}
        </div>
      )}
      <h3 className="mb-1.5 text-base font-semibold text-stone-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-stone-500 leading-relaxed">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
