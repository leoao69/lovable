import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ValidationReport } from '@/types/financials';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

interface ValidationStatusProps {
  validation?: ValidationReport;
  currency: string;
}

export function ValidationStatus({ validation, currency }: ValidationStatusProps) {
  if (!validation) return null;

  const isPassed = validation.status === 'PASS';
  const { assets, 'L+E': liabilitiesEquity, difference } = validation.accounting_equation;

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isPassed 
        ? "bg-success/5 border-success/20" 
        : "bg-warning/5 border-warning/20"
    )}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {isPassed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Validation Status</span>
              <Badge 
                variant={isPassed ? "default" : "secondary"}
                className={cn(
                  isPassed 
                    ? "bg-success text-success-foreground" 
                    : "bg-warning text-warning-foreground"
                )}
              >
                {validation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPassed 
                ? "Balance sheet is balanced (Assets = Liabilities + Equity)" 
                : "Balance sheet requires review - accounting equation doesn't balance"}
            </p>
          </div>
        </div>
        
        {!isPassed && (
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Assets:</span>
              <span className="ml-2 font-mono">{formatCurrency(assets, currency)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">L + E:</span>
              <span className="ml-2 font-mono">{formatCurrency(liabilitiesEquity, currency)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Difference:</span>
              <span className={cn("ml-2 font-mono", difference !== 0 && "text-warning")}>
                {formatCurrency(difference, currency)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
