import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
}

export function EditableCell({ value, onChange, currency }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(editValue.replace(/,/g, ''));
    if (!isNaN(numValue) && numValue !== value) {
      onChange(numValue);
    } else {
      setEditValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-right font-mono text-sm bg-background border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    );
  }

  return (
    <button
      onClick={() => {
        setEditValue(value.toString());
        setIsEditing(true);
      }}
      className={cn(
        "w-full text-right font-mono text-sm px-2 py-1 rounded transition-colors",
        "hover:bg-muted cursor-text"
      )}
    >
      {formattedValue}
    </button>
  );
}
