'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { JsonFile, FileUploadError } from '@/types/json';
import { validateJsonString } from '@/lib/json-utils';

interface JsonUploaderProps {
  onFilesChange: (files: JsonFile[]) => void;
  onError: (errors: FileUploadError[]) => void;
}

/**
 * JsonUploader Component
 * Handles drag-and-drop file uploads with JSON validation
 */
export default function JsonUploader({ onFilesChange, onError }: JsonUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<JsonFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    const newJsonFiles: JsonFile[] = [];
    const errors: FileUploadError[] = [];

    for (const file of files) {
      try {
        // Check file type
        if (!file.name.toLowerCase().endsWith('.json')) {
          errors.push({
            fileName: file.name,
            error: 'File must have .json extension'
          });
          continue;
        }

        // Read file content
        const text = await file.text();
        const validation = validateJsonString(text);

        if (!validation.isValid) {
          errors.push({
            fileName: file.name,
            error: validation.error || 'Invalid JSON format'
          });
          continue;
        }

        // Create JsonFile object
        const jsonFile: JsonFile = {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          content: JSON.parse(text),
          size: file.size
        };

        newJsonFiles.push(jsonFile);
      } catch (error) {
        errors.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Failed to process file'
        });
      }
    }

    const updatedFiles = [...uploadedFiles, ...newJsonFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    if (errors.length > 0) {
      onError(errors);
    }
    
    setIsProcessing(false);
  }, [uploadedFiles, onFilesChange, onError]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles);
  }, [processFiles]);

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [uploadedFiles, onFilesChange]);

  const clearAllFiles = useCallback(() => {
    setUploadedFiles([]);
    onFilesChange([]);
  }, [onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: true,
    disabled: isProcessing
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50/5 scale-105' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload 
            className={`w-12 h-12 transition-colors duration-200 ${
              isDragActive ? 'text-blue-400' : 'text-gray-400'
            }`} 
          />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-200">
              {isDragActive 
                ? 'Drop your JSON files here' 
                : 'Drag & drop JSON files here'
              }
            </p>
            <p className="text-sm text-gray-400">
              or click to browse files
            </p>
          </div>
          
          {isProcessing && (
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-200">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}