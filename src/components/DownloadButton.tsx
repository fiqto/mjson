'use client';

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { downloadJsonFile } from '@/lib/json-utils';

interface DownloadButtonProps {
  data: Record<string, any> | any[] | null;
  filename?: string;
  disabled?: boolean;
}

/**
 * DownloadButton Component
 * Handles downloading merged JSON data as a file
 */
export default function DownloadButton({ 
  data, 
  filename = 'merged-data.json',
  disabled = false 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    if (!data || disabled || isDownloading) return;

    try {
      setIsDownloading(true);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      downloadJsonFile(data, filename);
      
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 2000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isDisabled = disabled || !data || isDownloading;

  const getButtonContent = () => {
    if (downloadComplete) {
      return (
        <>
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-green-400">Downloaded!</span>
        </>
      );
    }

    if (isDownloading) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
          <span>Downloading...</span>
        </>
      );
    }

    return (
      <>
        <Download className="w-5 h-5" />
        <span>Download JSON</span>
      </>
    );
  };

  const getFileInfo = () => {
    if (!data) return null;
    
    const size = JSON.stringify(data, null, 2).length;
    const sizeKB = (size / 1024).toFixed(1);
    
    return `${sizeKB} KB`;
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
          font-medium transition-all duration-200
          ${isDisabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : downloadComplete
            ? 'bg-green-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105'
          }
        `}
      >
        {getButtonContent()}
      </button>
      
      {data && (
        <div className="text-center">
          <p className="text-xs text-gray-400">
            File size: {getFileInfo()} • Format: JSON
          </p>
        </div>
      )}
    </div>
  );
}