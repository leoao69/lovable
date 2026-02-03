import { Download, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onExport: () => void;
  onReset: () => void;
  onSave: () => void;
  hasChanges: boolean;
}

export function ActionButtons({ onExport, onReset, onSave, hasChanges }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export JSON
      </Button>
      <Button
        size="sm"
        onClick={onSave}
        disabled={!hasChanges}
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </Button>
    </div>
  );
}
