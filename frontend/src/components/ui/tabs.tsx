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
        className="flex gap-1 border-b border-stone-100 bg-stone-50/50 p-1 rounded-xl"
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
              "relative flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              activeIndex === index
                ? "text-primary-700 bg-white shadow-sm"
                : "text-stone-500 hover:text-stone-700 hover:bg-white/50",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">
        {tabs.map((tab, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            hidden={activeIndex !== index}
            className="animate-in fade-in-up duration-300"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Tabs, type TabsProps, type Tab };
