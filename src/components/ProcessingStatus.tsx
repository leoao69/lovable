import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessingStatus as Status } from '@/types/financials';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  status: Status;
  error?: string;
}

export function ProcessingStatus({ status, error }: ProcessingStatusProps) {
  if (status === 'idle') return null;

  const statusConfig = {
    uploading: {
      icon: Loader2,
      text: 'Uploading file...',
      className: 'text-primary',
      animate: true,
    },
    processing: {
      icon: Loader2,
      text: 'Extracting financial data...',
      className: 'text-primary',
      animate: true,
    },
    complete: {
      icon: CheckCircle2,
      text: 'Processing complete',
      className: 'text-success',
      animate: false,
    },
    error: {
      icon: AlertCircle,
      text: error || 'Processing failed',
      className: 'text-destructive',
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 py-3 px-4 rounded-lg bg-card border border-border animate-slide-up",
      status === 'complete' && "bg-success/5 border-success/20",
      status === 'error' && "bg-destructive/5 border-destructive/20"
    )}>
      <Icon className={cn(
        "w-4 h-4",
        config.className,
        config.animate && "animate-spin"
      )} />
      <span className={cn("text-sm font-medium", config.className)}>
        {config.text}
      </span>
    </div>
  );
}
