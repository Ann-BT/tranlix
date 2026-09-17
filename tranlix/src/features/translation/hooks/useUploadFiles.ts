import { useState } from "react";

import { translationApi } from "../api/translationApi";
import { SUPPORTED_EXTENSIONS } from "../types";
import type { UploadFile } from "../types";

// Manages the list of files added to the form and analyzes each one
// independently in the background, so several files can be added and
// preflighted without one blocking or replacing another.
export function useUploadFiles(maxTasks: number) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const runPreflight = async (id: string, file: File) => {
    try {
      const preflight = await translationApi.preflight(file);
      setUploadFiles(prev => prev.map(f => (f.id === id ? { ...f, preflight, isAnalyzing: false } : f)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể phân tích file.";
      setUploadFiles(prev => prev.map(f => (f.id === id ? { ...f, error: message, isAnalyzing: false } : f)));
    }
  };

  const addFiles = (files: File[]) => {
    const room = maxTasks - uploadFiles.length;
    if (room <= 0) return;

    const accepted = files
      .filter((f) => {
        const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
        return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
      })
      .slice(0, room);

    const newEntries: UploadFile[] = accepted.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      isAnalyzing: true,
      topics: [],
      forceOcr: false,
    }));

    setUploadFiles(prev => [...prev, ...newEntries]);
    newEntries.forEach((entry) => runPreflight(entry.id, entry.file));
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const setFileTopics = (id: string, topics: string[]) => {
    setUploadFiles(prev => prev.map(f => (f.id === id ? { ...f, topics } : f)));
  };

  const setFileForceOcr = (id: string, forceOcr: boolean) => {
    setUploadFiles(prev => prev.map(f => (f.id === id ? { ...f, forceOcr } : f)));
  };

  const clear = () => setUploadFiles([]);

  return {
    uploadFiles,
    addFiles,
    removeFile,
    setFileTopics,
    setFileForceOcr,
    clear,
    isDragging,
    setIsDragging,
    canAddMore: uploadFiles.length < maxTasks,
    isAnalyzing: uploadFiles.some(f => f.isAnalyzing),
  };
}
