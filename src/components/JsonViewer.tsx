'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface JsonViewerProps {
  data: Record<string, any> | any[] | null;
  title?: string;
}

/**
 * JsonViewer Component
 * Displays JSON data with syntax highlighting and copy functionality
 */
export default function JsonViewer({ data, title = "Merged JSON" }: JsonViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!data) {
    return (
      <div className="text-center py-8">
        <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No data to display</p>
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const renderJsonValue = (value: any, key: string | number | null = null, depth: number = 0): React.ReactNode => {
    const indent = '  '.repeat(depth);
    
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-orange-400">{String(value)}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-400">{value}</span>;
    }
    
    if (typeof value === 'string') {
      return <span className="text-green-400">"{value}"</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-300">[]</span>;
      }
      
      return (
        <span>
          <span className="text-gray-300">[</span>
          {value.map((item, index) => (
            <div key={index} className="ml-4">
              {renderJsonValue(item, index, depth + 1)}
              {index < value.length - 1 && <span className="text-gray-300">,</span>}
            </div>
          ))}
          <div className={`text-gray-300`} style={{ marginLeft: `${depth * 16}px` }}>]</div>
        </span>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return <span className="text-gray-300">{'{}'}</span>;
      }
      
      return (
        <span>
          <span className="text-gray-300">{'{'}</span>
          {keys.map((objKey, index) => (
            <div key={objKey} className="ml-4">
              <span className="text-purple-400">"{objKey}"</span>
              <span className="text-gray-300">: </span>
              {renderJsonValue(value[objKey], objKey, depth + 1)}
              {index < keys.length - 1 && <span className="text-gray-300">,</span>}
            </div>
          ))}
          <div className={`text-gray-300`} style={{ marginLeft: `${depth * 16}px` }}>{'}'}</div>
        </span>
      );
    }
    
    return <span className="text-gray-300">{String(value)}</span>;
  };

  const getSummary = () => {
    const totalSize = JSON.stringify(data).length;
    if (Array.isArray(data)) {
      return `${data.length} items • ${(totalSize / 1024).toFixed(1)} KB`;
    } else {
      const keys = Object.keys(data);
      return `${keys.length} properties • ${(totalSize / 1024).toFixed(1)} KB`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-200">{title}</h3>
          <p className="text-sm text-gray-400">{getSummary()}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Display */}
      {!isCollapsed && (
        <div className="relative">
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            {/* Line numbers and content */}
            <div className="flex">
              {/* Line numbers */}
              <div className="bg-gray-800 px-4 py-4 text-xs text-gray-500 select-none border-r border-gray-700">
                {jsonString.split('\n').map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
              
              {/* JSON content */}
              <div className="flex-1 p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-6 text-gray-200">
                  <code>{renderJsonValue(data)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed view */}
      {isCollapsed && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">JSON viewer collapsed - click the eye icon to expand</p>
        </div>
      )}
    </div>
  );
}