import type { ExportOptions, ExportResult, ExportFormat } from '@/types/export';
import { FREE_FORMATS, PRO_FORMATS } from '@/types/export';
import { ScannerService } from '@/services/scanner/ScannerService';
import { ScanStorage } from '@/services/storage/ScanStorage';

/**
 * Maps export format to file extension.
 */
function getFileExtension(format: ExportFormat): string {
  return format; // format names match their extensions
}

/**
 * Determine the output file path for an export.
 */
function buildOutputPath(
  scanId: string,
  fileName: string | undefined,
  format: ExportFormat,
): string {
  const baseName = fileName ?? `scan_${scanId}`;
  const ext = getFileExtension(format);
  return `${scanId}/${baseName}.${ext}`;
}

/**
 * Check if a format requires a pro subscription.
 */
export function isProFormat(format: ExportFormat): boolean {
  return (PRO_FORMATS as readonly string[]).includes(format);
}

/**
 * Check if a format is available in the free tier.
 */
export function isFreeFormat(format: ExportFormat): boolean {
  return (FREE_FORMATS as readonly string[]).includes(format);
}

/**
 * Unified export API.
 * Delegates to the native module for the actual file conversion,
 * then returns the result with file path and size info.
 */
export async function exportScan(
  options: ExportOptions,
): Promise<ExportResult> {
  const { format, scanId, fileName, simplifyMesh } = options;

  try {
    // Verify the scan exists
    const scanMeta = await ScanStorage.loadScan(scanId);
    if (!scanMeta) {
      return {
        success: false,
        format,
        error: `Scan not found: ${scanId}`,
      };
    }

    const outputPath = buildOutputPath(scanId, fileName, format);

    // If mesh simplification is requested, log a note (stub for now)
    if (simplifyMesh) {
      console.info(
        `[ExportService] Mesh simplification requested for scan ${scanId}`,
      );
    }

    // Delegate to native module for the actual export
    const resultPath = await ScannerService.exportMesh(format, outputPath);

    return {
      success: true,
      filePath: resultPath,
      format,
      // fileSize would be read from the resulting file in production
    };
  } catch (error) {
    return {
      success: false,
      format,
      error: error instanceof Error ? error.message : 'Unknown export error',
    };
  }
}
