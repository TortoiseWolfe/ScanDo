export type FreeExportFormat = 'obj' | 'dae' | 'stl';
export type ProExportFormat = 'dwg' | 'ifc' | 'ply' | 'pdf' | 'kml' | 'geojson';
export type ExportFormat = FreeExportFormat | ProExportFormat;

export interface ExportOptions {
  format: ExportFormat;
  scanId: string;
  fileName?: string;
  simplifyMesh?: boolean;
  includeTextures?: boolean;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  format: ExportFormat;
  error?: string;
}

export interface ExportJob {
  id: string;
  options: ExportOptions;
  progress: number; // 0-1
  state: 'queued' | 'exporting' | 'complete' | 'error';
  result?: ExportResult;
}

export const FREE_FORMATS: FreeExportFormat[] = ['obj', 'dae', 'stl'];
export const PRO_FORMATS: ProExportFormat[] = [
  'dwg',
  'ifc',
  'ply',
  'pdf',
  'kml',
  'geojson',
];

export const FORMAT_LABELS: Record<ExportFormat, string> = {
  obj: 'OBJ (SketchUp)',
  dae: 'DAE / Collada',
  stl: 'STL (3D Print)',
  dwg: 'DWG (AutoCAD)',
  ifc: 'IFC (BIM)',
  ply: 'PLY (Point Cloud)',
  pdf: 'PDF Floor Plan',
  kml: 'KML (Google Earth)',
  geojson: 'GeoJSON (GIS)',
};
