"use client";

import { XIcon } from "lucide-react";
import HistoryPanel from "@/features/summarizer/components/HistoryPanel";
import { Button } from "@/shared/ui/button";

export default function SummarizerSideBar({ isOpen = true, onClose }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-screen w-58 flex-col items-center justify-start gap-2 border-r border-gray-200 bg-white py-2 pb-3 overflow-hidden shadow-lg transition-transform duration-200 ease-out lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar"
    >
      <div className="absolute right-2 top-2 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-300 hover:text-gray-900"
          aria-label="Close menu"
        >
          <XIcon className="h-5 w-5" strokeWidth={2} />
        </Button>
      </div>

      <div className="w-full flex-1 overflow-hidden pt-10 lg:pt-2">
        <HistoryPanel />
      </div>
    </aside>
  );
}
