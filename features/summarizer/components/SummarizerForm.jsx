"use client";

import { useState } from 'react';
import { CornerDownLeftIcon, Loader2Icon} from 'lucide-react';
import SummaryResult from './SummaryResult';

export default function SummarizerForm() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
  if (!input.trim()) return;

  setLoading(true);
  setError(null);
  setSummary(null);

  try {
    const res = await fetch(`/api/summarize?model=facebook/bart-large-cnn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.error?.message || "Something went wrong");
    
    setSummary(data.summary);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSummarize();
    }
  };

  return (
      <div className="w-full max-w-2xl">
        <div className="relative flex items-center bg-white border-2 border-gray-300 rounded-3xl shadow-sm focus-within:shadow-md transition-shadow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter text to summarize..."
            className="flex-1 px-6 py-4 rounded-3xl bg-white text-black placeholder-gray-400 outline-none resize-none max-h-32"
            rows="3"
          />
          <button 
            onClick={handleSummarize}
            disabled={loading || !input.trim()}
            className="absolute bottom-1 right-1 px-3 py-2 bg-black border-2 border-gray-300 text-white font-bold rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <CornerDownLeftIcon className="w-5 h-5" />}
          </button>
        </div>
        
        <SummaryResult summary={summary} error={error} />
      </div>
  );
}