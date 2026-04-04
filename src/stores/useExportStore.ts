import { create } from 'zustand';
import type { ExportJob } from '@/types/export';

interface ExportState {
  /** All export jobs (active, queued, and completed). */
  jobs: ExportJob[];
  /** The currently active export job ID, if any. */
  activeJobId: string | null;
}

interface ExportActions {
  /** Add a new export job. */
  addJob: (job: ExportJob) => void;
  /** Update fields on an existing job. */
  updateJob: (jobId: string, updates: Partial<ExportJob>) => void;
  /** Remove a job by ID. */
  removeJob: (jobId: string) => void;
  /** Clear all completed and errored jobs. */
  clearFinished: () => void;
}

export const useExportStore = create<ExportState & ExportActions>((set) => ({
  jobs: [],
  activeJobId: null,

  addJob: (job) =>
    set((state) => ({
      jobs: [...state.jobs, job],
      activeJobId: state.activeJobId ?? job.id,
    })),

  updateJob: (jobId, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job,
      ),
    })),

  removeJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== jobId),
      activeJobId: state.activeJobId === jobId ? null : state.activeJobId,
    })),

  clearFinished: () =>
    set((state) => ({
      jobs: state.jobs.filter(
        (job) => job.state !== 'complete' && job.state !== 'error',
      ),
    })),
}));
