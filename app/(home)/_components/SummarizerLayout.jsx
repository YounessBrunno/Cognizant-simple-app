"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";
import SummarizerSideBar from "./SummarizerSideBar";
import { Button } from "@/shared/ui/button";

export default function SummarizerLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <SummarizerSideBar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div
        aria-hidden
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <div className="fixed left-4 top-4 z-20 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={openSidebar}
          className="h-10 w-10 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      <main className="min-h-screen bg-gray-50 flex flex-col items-stretch justify-start gap-4 pt-4 pb-4 pl-0 lg:pl-58">
        <div className="h-12 shrink-0 lg:hidden" aria-hidden />
        {children}
      </main>
    </>
  );
}
