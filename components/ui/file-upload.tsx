'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, FileText, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { Button } from './button';

export interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUrlChange?: (url: string) => void;
  accept?: string;
  maxSizeMb?: number;
  label?: string;
  description?: string;
  className?: string;
}

const FORBIDDEN_EXTENSIONS = [
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.msi',
  '.vbs',
  '.js',
  '.py',
  '.php',
  '.html',
  '.htm',
  '.svg',
];

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUrlChange,
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  maxSizeMb = 10,
  label = 'Upload document or provide URL',
  description = 'Supports PDF, Word documents or image files up to 10MB',
  className,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = accept
    .split(',')
    .map((ext) => ext.trim().toLowerCase())
    .filter(Boolean);

  const handleFiles = (files: FileList | null) => {
    setErrorMessage(null);
    if (!files || files.length === 0) return;
    const file = files[0];

    // 1. File size check
    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMessage(`File exceeds ${maxSizeMb}MB maximum limit.`);
      return;
    }

    // 2. Extension check
    const fileName = file.name.toLowerCase();
    const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    if (isForbidden) {
      setErrorMessage('Executable, script, or markup files are strictly prohibited for security.');
      return;
    }

    const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));
    if (!isAllowed) {
      setErrorMessage(`File type not allowed. Supported formats: ${accept}`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    setErrorMessage(null);

    const trimmed = val.trim();
    if (!trimmed) {
      onUrlChange?.('');
      return;
    }

    // Prevent unsafe URL schemes like javascript:, data:, file:, vbscript:
    if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) {
      setErrorMessage('Direct URL must start with https:// or http://');
      return;
    }

    onUrlChange?.(trimmed);
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              inputMode === 'upload' ? 'bg-slate-200 font-semibold text-slate-800' : 'text-slate-500'
            )}
          >
            File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              inputMode === 'url' ? 'bg-slate-200 font-semibold text-slate-800' : 'text-slate-500'
            )}
          >
            Direct URL
          </button>
        </div>
      </div>

      {inputMode === 'url' ? (
        <div className="space-y-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://docs.campusverse.edu/document.pdf"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {selectedFile ? (
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setErrorMessage(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-colors cursor-pointer text-center',
                dragActive
                  ? 'border-brand-500 bg-brand-50/50'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'
              )}
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
