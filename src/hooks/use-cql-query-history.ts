import { useState } from "react";

export interface HistoryItem {
  query: string;
  date: Date;
}

export const useCqlQueryHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addQueryToHistory = (query: string) => {
    const newHistoryItem = {
      query,
      date: new Date(),
    };

    setHistory((prevState) => {
      return [...prevState, newHistoryItem].sort((history1, history2) => {
        return (
          new Date(history2.date).getTime() - new Date(history1.date).getTime()
        );
      });
    });
  };

  return { history, addQueryToHistory };
};
