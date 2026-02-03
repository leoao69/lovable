import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { labelToReadable } from '@/lib/formatters';

interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
  isTotal?: boolean;
}

export function EditableLabel({ value, onChange, isTotal }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setEditValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    );
  }

  return (
    <button
      onClick={() => {
        setEditValue(value);
        setIsEditing(true);
      }}
      className={cn(
        "text-sm truncate text-left px-2 py-1 rounded transition-colors w-full",
        "hover:bg-muted cursor-text",
        isTotal ? "text-foreground font-medium" : "text-muted-foreground"
      )}
      title="Click to edit"
    >
      {labelToReadable(value)}
    </button>
  );
}
