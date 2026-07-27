interface DurationSource {
  processing_seconds?: number | null;
  created_at: string;
  updated_at: string;
}

function formatSeconds(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds));
  if (secs < 60) return `${secs} giây`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins} phút ${remSecs} giây`;
}

// Prefers the real elapsed processing time measured directly in the Celery
// task (see TranslationJob.processing_seconds's own docstring on the
// backend for why: updated_at - created_at turned out unreliable as a
// duration measurement, confirmed against real job rows where it read as a
// fraction of a second despite a real, full-sized translated output).
// Falls back to that timestamp diff only for jobs that predate the field.
export function formatJobDuration(job: DurationSource): string {
  if (job.processing_seconds != null) {
    return formatSeconds(job.processing_seconds);
  }
  const start = new Date(job.created_at).getTime();
  const end = new Date(job.updated_at).getTime();
  const diffMs = end - start;
  if (isNaN(diffMs) || diffMs < 0) return "---";
  return formatSeconds(diffMs / 1000);
}
