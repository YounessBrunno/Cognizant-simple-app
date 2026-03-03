"use client";

import Link from "next/link";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import { useSummarizerHistory } from "../hooks/useSummarizerHistory";
import { Button } from "@/shared/ui/button";

export default function HistoryDetail({ id }) {
  const { history, isLoaded } = useSummarizerHistory();

  const numericId = Number(id);
  const entry = history.find((item) => item.id === numericId);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading history…</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-1 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to summarizer
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 px-6 py-8 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900">
            History item not found
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This history entry may have been cleared or the link is invalid. Try
            running a new summary from the main page.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(entry.timestamp).toLocaleString();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8">
      {/* Dear Recruiter, this is the Top bar with back + meta information, in the future they can be separated into different components */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-1 text-xs font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to summarizer
            </Button>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="inline-flex items-center rounded-full bg-gray-900 text-white px-3 py-1 text-[11px] font-medium">
          Summary #{id}
        </div>
      </div>

      {/* Dear Recruiter, this is the Content layout, as i said in the future they can be separated into different components*/}
      <div className="grid gap-5 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Original text
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500">
                INPUT
              </span>
              <span className="text-[11px] text-gray-400">
                {entry.text.length} characters
              </span>
            </div>
            <div className="p-4 text-sm text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
              {entry.text}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Summary
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500">
                OUTPUT
              </span>
              <span className="text-[11px] text-gray-400">
                Generated on {formattedDate}
              </span>
            </div>
            <div className="p-4 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed flex-1">
              {entry.summary}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

