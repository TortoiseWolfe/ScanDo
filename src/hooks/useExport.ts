import { useCallback } from 'react';
import type { ExportOptions, ExportJob, ExportResult } from '@/types/export';
import { useExportStore } from '@/stores/useExportStore';
import { exportScan as performExport } from '@/services/export/ExportService';

interface UseExportReturn {
  exportScan: (options: ExportOptions) => Promise<ExportResult>;
  activeJobs: ExportJob[];
  cancelJob: (jobId: string) => void;
}

function generateJobId(): string {
  return `export_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useExport(): UseExportReturn {
  const { jobs, addJob, updateJob, removeJob } = useExportStore();

  const exportScan = useCallback(
    async (options: ExportOptions): Promise<ExportResult> => {
      const jobId = generateJobId();
      const job: ExportJob = {
        id: jobId,
        options,
        progress: 0,
        state: 'queued',
      };

      addJob(job);

      try {
        updateJob(jobId, { state: 'exporting', progress: 0.1 });

        const result = await performExport(options);

        updateJob(jobId, {
          state: result.success ? 'complete' : 'error',
          progress: result.success ? 1 : job.progress,
          result,
        });

        return result;
      } catch (error) {
        const errorResult: ExportResult = {
          success: false,
          format: options.format,
          error: error instanceof Error ? error.message : 'Export failed',
        };

        updateJob(jobId, {
          state: 'error',
          result: errorResult,
        });

        return errorResult;
      }
    },
    [addJob, updateJob],
  );

  const cancelJob = useCallback(
    (jobId: string) => {
      removeJob(jobId);
    },
    [removeJob],
  );

  return {
    exportScan,
    activeJobs: jobs,
    cancelJob,
  };
}
