import { useEffect, useState, useCallback } from "react";

const KEY = "rawafed_saved_jobs";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const emit = () => window.dispatchEvent(new Event("saved-jobs-changed"));

export const useSavedJobs = () => {
  const [saved, setSaved] = useState<string[]>(read);

  useEffect(() => {
    const sync = () => setSaved(read());
    window.addEventListener("saved-jobs-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("saved-jobs-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    setSaved(next);
    emit();
  }, []);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  return { saved, toggle, isSaved, count: saved.length };
};
