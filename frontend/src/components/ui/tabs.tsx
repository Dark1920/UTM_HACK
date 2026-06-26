"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

function Tabs({ tabs, defaultIndex = 0, onChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex border-b border-slate-200"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            onClick={() => handleTabClick(index)}
            className={[
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
              activeIndex === index
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {tab.label}
            {activeIndex === index && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeIndex !== index}
            className="animate-in fade-in duration-200"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Tabs, type TabsProps, type Tab };
