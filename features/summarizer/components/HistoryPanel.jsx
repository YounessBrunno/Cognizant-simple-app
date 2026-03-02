"use client";

import { useSummarizerHistory } from '../hooks/useSummarizerHistory';

export default function HistoryPanel() {
  const { history, clearHistory } = useSummarizerHistory();

  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-2">History</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-0">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No history yet</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="p-1 bg-gray-100 rounded text-sm">
              <p className="font-semibold truncate">{item.text.substring(0, 50)}...</p>
              <p className="text-gray-600 text-xs mt-1">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <button 
        onClick={clearHistory}
        disabled={history.length === 0}
        className="w-full bg-black text-white py-2 px-9 rounded-md hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition mt-auto">
        Clear History
      </button>
    </div>
  );
}

