'use client';

import React, { useState, useRef } from 'react';
import { Paperclip, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export interface UploadedFile {
  filename: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
}

interface FileUploadZoneProps {
  attachments: UploadedFile[];
  onAttachmentsChange: (attachments: UploadedFile[]) => void;
  maxFiles?: number;
}

export function FileUploadZone({
  attachments,
  onAttachmentsChange,
  maxFiles = 5
}: FileUploadZoneProps) {
  const { lang } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > maxFiles) {
      setUploadError(
        lang === 'ar'
          ? `الحد الأقصى للمرفقات هو ${maxFiles} ملفات`
          : `Maximum ${maxFiles} attachments allowed`
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const newAttachments = [...attachments];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await api.uploadFile(file);
        if (res.success && res.data) {
          newAttachments.push(res.data);
        }
      } catch (err: any) {
        setUploadError(err.message || 'File upload failed');
      }
    }

    onAttachmentsChange(newAttachments);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="crm-file-upload-input"
        />
        <button
          type="button"
          disabled={isUploading || attachments.length >= maxFiles}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-navy-700 bg-navy-900/90 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-400" />
          ) : (
            <Paperclip className="w-3.5 h-3.5 text-gold-400" />
          )}
          <span>
            {isUploading
              ? lang === 'ar'
                ? 'جاري الرفع...'
                : 'Uploading...'
              : lang === 'ar'
                ? 'إرفاق ملفات أو صور'
                : 'Attach Files / Images'}
          </span>
        </button>
        <span className="text-[10.5px] text-slate-500 font-mono">
          ({attachments.length}/{maxFiles})
        </span>
      </div>

      {uploadError && <div className="text-[11px] text-rose-400 font-medium">{uploadError}</div>}

      {/* Attachment Badges */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachments.map((file, idx) => {
            const isImage = file.mimeType.startsWith('image/');
            return (
              <div
                key={file.filename || idx}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-navy-900 border border-gold-500/30 text-xs text-slate-200 group"
              >
                {isImage ? (
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                )}
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-gold-300 truncate max-w-[140px] text-[11px]"
                  title={file.originalName}
                >
                  {file.originalName}
                </a>
                <span className="text-[10px] text-slate-500 font-mono">
                  {(file.sizeBytes / 1024).toFixed(0)}KB
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
