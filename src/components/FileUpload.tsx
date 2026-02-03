import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelect, isProcessing, selectedFile, onClear }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  if (selectedFile) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        {!isProcessing && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input
        type="file"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        accept=".pdf,.xlsx,.xls,.csv,.json"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Upload className={cn(
            "w-6 h-6 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <p className="font-medium text-foreground mb-1">
          Drop your balance sheet here
        </p>
        <p className="text-sm text-muted-foreground">
          or click to browse • PDF, Excel, CSV supported
        </p>
      </label>
    </div>
  );
}
