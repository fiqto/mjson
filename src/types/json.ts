/**
 * Type definitions for JSON merger application
 */

export interface JsonFile {
  id: string;
  name: string;
  content: Record<string, any> | any[];
  size: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  structureHash?: string;
}

export interface MergeResult {
  success: boolean;
  data?: Record<string, any> | any[];
  error?: string;
}

export interface FileUploadError {
  fileName: string;
  error: string;
}