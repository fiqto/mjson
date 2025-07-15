'use client';

import React, { useMemo } from 'react';
import { AlertCircle, CheckCircle, Merge } from 'lucide-react';
import { JsonFile, MergeResult } from '@/types/json';
import { mergeJsonFiles, validateStructureConsistency } from '@/lib/json-utils';

interface JsonMergerProps {
  files: JsonFile[];
  onMergeResult: (result: MergeResult) => void;
}

/**
 * JsonMerger Component
 * Validates file structure consistency and triggers merge operation
 */
export default function JsonMerger({ files, onMergeResult }: JsonMergerProps) {
  // Validate structure consistency
  const structureValidation = useMemo(() => {
    if (files.length === 0) {
      return { isValid: false, error: 'No files uploaded' };
    }
    return validateStructureConsistency(files);
  }, [files]);

  // Merge files when structure is valid
  const mergeResult = useMemo(() => {
    if (!structureValidation.isValid || files.length === 0) {
      return null;
    }
    return mergeJsonFiles(files);
  }, [files, structureValidation.isValid]);

  // Notify parent component of merge result
  React.useEffect(() => {
    if (mergeResult) {
      onMergeResult(mergeResult);
    } else if (files.length > 0 && !structureValidation.isValid) {
      onMergeResult({
        success: false,
        error: structureValidation.error || 'Cannot merge files'
      });
    }
  }, [mergeResult, files.length, structureValidation.isValid, structureValidation.error, onMergeResult]);

  const handleMergeClick = () => {
    if (structureValidation.isValid && files.length > 0) {
      const result = mergeJsonFiles(files);
      onMergeResult(result);
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <Merge className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Upload JSON files to start merging</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-700 bg-gray-800/30">
        {structureValidation.isValid ? (
          <>
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-400 mb-1">
                Structure Validation Passed
              </h3>
              <p className="text-sm text-gray-300">
                All {files.length} files have consistent structure and can be merged.
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-400 mb-1">
                Structure Validation Failed
              </h3>
              <p className="text-sm text-gray-300">
                {structureValidation.error}
              </p>
            </div>
          </>
        )}
      </div>

      {/* File Analysis */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">File Analysis:</h4>
        <div className="grid gap-2">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center justify-between text-xs p-2 bg-gray-800/20 rounded border border-gray-700/50"
            >
              <span className="text-gray-300">{file.name}</span>
              <span className="text-gray-400">
                {Array.isArray(file.content) 
                  ? `${file.content.length} items` 
                  : `${Object.keys(file.content).length} properties`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Merge Button */}
      {structureValidation.isValid && (
        <button
          onClick={handleMergeClick}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          <Merge className="w-5 h-5" />
          <span>Merge {files.length} Files</span>
        </button>
      )}

      {/* Merge Result Status */}
      {mergeResult && (
        <div className="mt-4">
          {mergeResult.success ? (
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Files merged successfully!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Merge failed: {mergeResult.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}