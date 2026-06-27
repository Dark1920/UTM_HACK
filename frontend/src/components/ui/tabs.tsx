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
      <div role="tablist" className="flex gap-6 border-b border-stone-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            onClick={() => handleTabClick(index)}
            className={[
              "relative -mb-px py-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none",
              activeIndex === index
                ? "text-stone-900 border-b-2 border-stone-900"
                : "text-stone-400 border-b-2 border-transparent hover:text-stone-700",
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
            className="animate-in fade-in duration-150"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Tabs, type TabsProps, type Tab };
