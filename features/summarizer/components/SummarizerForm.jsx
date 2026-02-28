"use client";

import { useState } from 'react';
import { FileTextIcon } from 'lucide-react';

export default function SummarizerForm() {
  const [input, setInput] = useState('');

  const handleSummarize = () => {
    if (input.trim()) {
      console.log('Summarizing:', input);
      // Add your summarize logic here
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
        <div className="flex items-center bg-white border-2 border-gray-300 rounded-3xl shadow-sm focus-within:shadow-md transition-shadow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to summarize..."
            className="relative flex-1 px-6 py-4 bg-white text-black placeholder-gray-400 outline-none resize-none max-h-32"
            rows="3"
          />
          <button onClick={handleSummarize}
            className="absolute mr-2 px-4 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
            <FileTextIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
  );
}