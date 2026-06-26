"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

function Dropdown({ trigger, items, align = "left" }: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        containerRef.current.querySelector("[data-dropdown-menu]")?.classList.add("hidden");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    const menu = containerRef.current?.querySelector("[data-dropdown-menu]");
    menu?.classList.toggle("hidden");
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      containerRef.current?.querySelector("[data-dropdown-menu]")?.classList.add("hidden");
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>
      <div
        data-dropdown-menu
        className={[
          "hidden absolute z-50 mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg",
          "animate-in zoom-in-95 fade-in duration-150",
          align === "right" ? "right-0" : "left-0",
        ].join(" ")}
        role="menu"
      >
        {items.map((item, index) =>
          item.divider ? (
            <div key={index} className="my-1 border-t border-slate-100" role="separator" />
          ) : (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={[
                "flex w-full items-center gap-2 px-3 py-2 text-sm text-left",
                "transition-colors",
                item.disabled
                  ? "cursor-not-allowed text-slate-400"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
              role="menuitem"
            >
              {item.icon && <span className="text-slate-400">{item.icon}</span>}
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export { Dropdown, type DropdownProps, type DropdownItem };
