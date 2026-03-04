"use client";

import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { useSummarizerHistory } from "../hooks/useSummarizerHistory";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

export default function HistoryPanel() {
  const { history, clearHistory, removeFromHistory } = useSummarizerHistory();

  return (
    <div className="flex flex-col w-full h-full pl-3">
      <h2 className="text-sm font-semibold tracking-wide text-gray-700 mb-2 pr-3">
        History
      </h2>
      <div className="flex-1 overflow-y-auto mb-4 w-full">
        <div className="pr-3 space-y-1.5">
        {history.length === 0 ? (
          <p className="text-gray-500 text-xs">No history yet</p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-xs w-full overflow-hidden flex justify-between items-center gap-2 transition-colors"
            >
              <Link
                href={`/history/${item.id}`}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <p className="font-medium truncate text-gray-900 group-hover:text-black">
                  {item.text.substring(0, 80)}
                  {item.text.length > 80 ? "..." : ""}
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </Link>
              {/* Dear Recruiter, this and the below  alert dialog,  we can in  the future turn it into a reusable component */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 text-[11px] font-semibold px-1.5 shrink-0"
                  >
                    <Trash2Icon className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remove this history item?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeFromHistory(item.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
        </div>
      </div>

      <div className="pr-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={history.length === 0}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition mt-auto font-semibold"
              variant="destructive"
            >
              Clear history
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all saved summaries. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

