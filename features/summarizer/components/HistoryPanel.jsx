"use client";

import { Trash2Icon } from 'lucide-react';
import { useSummarizerHistory } from '../hooks/useSummarizerHistory';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';

export default function HistoryPanel() {
  const { history, clearHistory, removeFromHistory } = useSummarizerHistory();

  return (
    <div className="flex flex-col w-full flex-1 px-3">
      <h2 className="text-[17px] mb-2">History</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 w-full">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No history yet</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="p-1 bg-gray-100 rounded text-sm w-full overflow-hidden flex justify-between items-center gap-1">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.text.substring(0, 50)}...</p>
                <p className="text-gray-600 text-xs mt-1">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost" 
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-1 shrink-0">
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
           disabled={history.length === 0}
           className="w-full bg-black text-white py-2 px-9 rounded-md hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition mt-auto"
           variant="destructive">
            Clear History
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
  );
}

