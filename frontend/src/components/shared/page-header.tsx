import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-stone-400">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-stone-900">
            <Home className="h-3.5 w-3.5" />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-stone-900">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-stone-700 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
