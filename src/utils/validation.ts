import { z } from 'zod';

/**
 * Zod schema for validating scan metadata.
 */
export const scanMetadataSchema = z.object({
  id: z.string().min(1, 'Scan ID is required'),
  name: z
    .string()
    .min(1, 'Scan name is required')
    .max(100, 'Scan name too long'),
  createdAt: z.string().datetime({ message: 'Invalid createdAt date' }),
  updatedAt: z.string().datetime({ message: 'Invalid updatedAt date' }),
  duration: z.number().nonnegative('Duration must be non-negative'),
  vertexCount: z
    .number()
    .int()
    .nonnegative('Vertex count must be non-negative'),
  faceCount: z.number().int().nonnegative('Face count must be non-negative'),
  fileSize: z.number().int().nonnegative('File size must be non-negative'),
  thumbnailUri: z.string().optional(),
});

export type ValidatedScanMetadata = z.infer<typeof scanMetadataSchema>;

/**
 * Zod schema for validating export options.
 */
export const exportOptionsSchema = z.object({
  format: z.enum(['obj', 'dae', 'stl', 'dwg', 'ifc', 'ply', 'pdf'], {
    errorMap: () => ({ message: 'Invalid export format' }),
  }),
  scanId: z.string().min(1, 'Scan ID is required'),
  fileName: z
    .string()
    .regex(/^[a-zA-Z0-9_\-. ]+$/, 'File name contains invalid characters')
    .max(255, 'File name too long')
    .optional(),
  simplifyMesh: z.boolean().optional(),
  includeTextures: z.boolean().optional(),
});

export type ValidatedExportOptions = z.infer<typeof exportOptionsSchema>;

/**
 * Validate scan metadata and return a typed result.
 */
export function validateScanMetadata(data: unknown): {
  success: boolean;
  data?: ValidatedScanMetadata;
  errors?: z.ZodError;
} {
  const result = scanMetadataSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validate export options and return a typed result.
 */
export function validateExportOptions(data: unknown): {
  success: boolean;
  data?: ValidatedExportOptions;
  errors?: z.ZodError;
} {
  const result = exportOptionsSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
