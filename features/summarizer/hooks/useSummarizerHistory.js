"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "summarizer_history";

export function useSummarizerHistory() {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // DearRecruiter, this is to Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // this for adding to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addToHistory = (text, summary) => {
    const newEntry = {
      id: Date.now(),
      text,
      summary,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
