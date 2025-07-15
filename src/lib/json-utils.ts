/**
 * Utilities for JSON validation, structure comparison, and merging
 */

import { JsonFile, ValidationResult, MergeResult } from '@/types/json';

/**
 * Validates if a string is valid JSON and returns parsed content
 */
export function validateJsonString(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (typeof parsed !== 'object' || parsed === null) {
      return {
        isValid: false,
        error: 'JSON must be an object or array at root level'
      };
    }

    return {
      isValid: true,
      structureHash: generateStructureHash(parsed)
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format'
    };
  }
}

/**
 * Generates a hash representing the structure of a JSON object
 * Used to compare if multiple JSON files have the same structure
 */
export function generateStructureHash(obj: Record<string, any>): string {
  const getStructure = (value: any): any => {
    if (value === null) return 'nullable';
    if (Array.isArray(value)) {
      return ['array', value.length > 0 ? getStructure(value[0]) : 'empty'];
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value).sort();
      return ['object', keys.map(key => [key, getStructure(value[key])])];
    }
    return typeof value;
  };

  const normalizeStructure = (structure: any): any => {
    if (Array.isArray(structure)) {
      if (structure[0] === 'object') {
        // For objects, normalize nullable fields
        const [type, properties] = structure;
        return [type, properties.map(([key, valueStructure]: [string, any]) => {
          const normalized = normalizeStructure(valueStructure);
          // Treat 'nullable' as compatible with any type for optional fields
          if (normalized === 'nullable') {
            return [key, 'nullable-field'];
          }
          if (Array.isArray(normalized) && normalized[0] === 'object') {
            return [key, 'nullable-field']; // Objects can be null
          }
          if (typeof normalized === 'string' && ['string', 'number', 'boolean'].includes(normalized)) {
            return [key, 'nullable-field']; // Primitives can be null
          }
          return [key, normalized];
        })];
      } else if (structure[0] === 'array') {
        return [structure[0], normalizeStructure(structure[1])];
      }
    }
    return structure;
  };

  const rawStructure = getStructure(obj);
  const normalizedStructure = normalizeStructure(rawStructure);
  return JSON.stringify(normalizedStructure);
}

/**
 * Checks if all JSON files have compatible structures for merging
 * Compatible means same root type (array/object) and overlapping property sets
 */
export function validateStructureConsistency(files: JsonFile[]): ValidationResult {
  if (files.length === 0) {
    return { isValid: false, error: 'No files to validate' };
  }

  if (files.length === 1) {
    return { isValid: true };
  }

  // Check if all files have the same root type (array vs object)
  const isFirstArray = Array.isArray(files[0].content);
  for (let i = 1; i < files.length; i++) {
    const isCurrentArray = Array.isArray(files[i].content);
    if (isFirstArray !== isCurrentArray) {
      return {
        isValid: false,
        error: `File "${files[i].name}" has different root type than "${files[0].name}" (array vs object)`
      };
    }
  }

  // For arrays, check if the first element structures are compatible
  if (isFirstArray) {
    const compatibleStructures = files.map(file => {
      if (Array.isArray(file.content) && file.content.length === 0) return null;
      return generateCompatibleStructureHash(Array.isArray(file.content) ? file.content[0] : file.content);
    });

    const baseStructure = compatibleStructures[0];
    for (let i = 1; i < compatibleStructures.length; i++) {
      if (compatibleStructures[i] && baseStructure && compatibleStructures[i] !== baseStructure) {
        return {
          isValid: false,
          error: `File "${files[i].name}" has incompatible array element structure than "${files[0].name}"`
        };
      }
    }
  } else {
    // For objects, use the same compatible structure check
    const compatibleStructures = files.map(file => generateCompatibleStructureHash(file.content));
    
    const baseStructure = compatibleStructures[0];
    for (let i = 1; i < compatibleStructures.length; i++) {
      if (compatibleStructures[i] !== baseStructure) {
        return {
          isValid: false,
          error: `File "${files[i].name}" has incompatible object structure than "${files[0].name}"`
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Generates a simplified structure hash that only considers core data types
 * This allows for flexible merging of objects with different optional properties
 */
function generateCompatibleStructureHash(obj: Record<string, any> | any[]): string {
  if (Array.isArray(obj)) {
    return JSON.stringify(['array', 'flexible-object']);
  } else if (typeof obj === 'object' && obj !== null) {
    return JSON.stringify(['object', 'flexible-properties']);
  } else {
    return JSON.stringify(typeof obj);
  }
}

/**
 * Merges multiple JSON objects with the same structure
 * For arrays: concatenates them
 * For objects: recursively merges them
 * For primitives: takes the last non-null value
 */
export function mergeJsonFiles(files: JsonFile[]): MergeResult {
  if (files.length === 0) {
    return { success: false, error: 'No files to merge' };
  }

  // Validate structure consistency
  const structureValidation = validateStructureConsistency(files);
  if (!structureValidation.isValid) {
    return { success: false, error: structureValidation.error };
  }

  try {
    // Determine if we're working with arrays or objects
    const isArrayType = Array.isArray(files[0].content);
    
    const merged = files.reduce((acc, file) => {
      return deepMerge(acc, file.content);
    }, isArrayType ? [] as any[] : {} as Record<string, any>);

    return { success: true, data: merged };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to merge files'
    };
  }
}

/**
 * Deep merge two objects
 */
function deepMerge(target: any, source: any): any {
  if (source === null || source === undefined) {
    return target;
  }

  if (target === null || target === undefined) {
    return source;
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }

  if (typeof target === 'object' && typeof source === 'object' && !Array.isArray(target) && !Array.isArray(source)) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = deepMerge(target[key], source[key]);
      }
    }
    
    return result;
  }

  // For primitives, take the source value (last wins)
  return source;
}

/**
 * Downloads JSON data as a file
 */
export function downloadJsonFile(data: Record<string, any> | any[], filename: string = 'merged-data.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}