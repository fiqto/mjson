'use client';

import React, { useState } from 'react';
import { Layers, AlertTriangle } from 'lucide-react';
import JsonUploader from '@/components/JsonUploader';
import JsonMerger from '@/components/JsonMerger';
import JsonViewer from '@/components/JsonViewer';
import DownloadButton from '@/components/DownloadButton';
import { JsonFile, FileUploadError, MergeResult } from '@/types/json';

/**
 * Home Page - JSON Merger Application
 * A professional tool for merging multiple JSON files with the same structure
 */
export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<JsonFile[]>([]);
  const [uploadErrors, setUploadErrors] = useState<FileUploadError[]>([]);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);

  const handleFilesChange = React.useCallback((files: JsonFile[]) => {
    setUploadedFiles(files);
    // Clear previous merge result when files change
    if (files.length === 0) {
      setMergeResult(null);
    }
  }, []);

  const handleUploadErrors = React.useCallback((errors: FileUploadError[]) => {
    setUploadErrors(errors);
  }, []);

  const handleMergeResult = React.useCallback((result: MergeResult) => {
    setMergeResult(result);
  }, []);

  const clearErrors = React.useCallback(() => {
    setUploadErrors([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-100">JSON Merger</h1>
                <p className="text-sm text-gray-400">Merge multiple JSON files with ease</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-400 mb-2">Upload Errors</h3>
                  <ul className="space-y-1">
                    {uploadErrors.map((error, index) => (
                      <li key={index} className="text-sm text-gray-300">
                        <span className="font-medium">{error.fileName}:</span> {error.error}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={clearErrors}
                    className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Clear errors
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Upload JSON Files</h2>
              <p className="text-gray-400">
                Upload multiple JSON files with the same structure to merge them into one.
              </p>
            </div>
            
            <JsonUploader
              onFilesChange={handleFilesChange}
              onError={handleUploadErrors}
            />
          </section>

          {/* Merge Section */}
          {uploadedFiles.length > 0 && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Merge Configuration</h2>
                <p className="text-gray-400">
                  Validate structure consistency and merge your JSON files.
                </p>
              </div>
              
              <JsonMerger
                files={uploadedFiles}
                onMergeResult={handleMergeResult}
              />
            </section>
          )}

          {/* Results Section */}
          {mergeResult && (
            <section>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* JSON Viewer */}
                <div className="lg:col-span-2">
                  <JsonViewer
                    data={mergeResult.success ? mergeResult.data : null}
                    title="Merged JSON Result"
                  />
                </div>

                {/* Download Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-4">Export Options</h3>
                    <DownloadButton
                      data={mergeResult.success ? mergeResult.data : null}
                      filename="merged-data.json"
                      disabled={!mergeResult.success}
                    />
                  </div>

                  {/* Stats */}
                  {mergeResult.success && mergeResult.data && (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-200 mb-3">Merge Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Files merged:</span>
                          <span className="text-gray-200">{uploadedFiles.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            {Array.isArray(mergeResult.data) ? 'Items:' : 'Properties:'}
                          </span>
                          <span className="text-gray-200">
                            {Array.isArray(mergeResult.data) 
                              ? mergeResult.data.length 
                              : Object.keys(mergeResult.data).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total size:</span>
                          <span className="text-gray-200">
                            {(JSON.stringify(mergeResult.data).length / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Help Section */}
          <section className="bg-gray-800/20 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">How to Use</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <span>Upload multiple JSON files that share the same root-level structure</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <span>The app will validate that all files have consistent structure</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <span>Files will be automatically merged: arrays concatenated, objects deep-merged</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <span>Preview the result and download the merged JSON file</span>
              </li>
            </ol>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Built with Next.js 15, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}