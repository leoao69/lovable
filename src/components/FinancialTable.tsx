import { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Plus, Trash2 } from 'lucide-react';
import { YearData, FinancialItem } from '@/types/financials';
import { EditableCell } from './EditableCell';
import { EditableLabel } from './EditableLabel';
import { labelToReadable } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface FinancialTableProps {
  data: YearData;
  onDataChange: (path: string[], value: number) => void;
  onLabelChange: (path: string[], oldKey: string, newKey: string) => void;
  onAddRow: (path: string[]) => void;
  onDeleteRow: (path: string[]) => void;
}

interface SectionProps {
  title: string;
  items: Record<string, unknown>;
  path: string[];
  currency: string;
  onDataChange: (path: string[], value: number) => void;
  onLabelChange: (path: string[], oldKey: string, newKey: string) => void;
  onAddRow: (path: string[]) => void;
  onDeleteRow: (path: string[]) => void;
  level?: number;
}

function FinancialSection({ title, items, path, currency, onDataChange, onLabelChange, onAddRow, onDeleteRow, level = 0 }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const isTotal = title.toLowerCase().includes('total');
  
  return (
    <div className={cn(level > 0 && "ml-4")}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2 py-2 px-3 rounded-lg transition-colors text-left",
          isTotal 
            ? "bg-primary/5 hover:bg-primary/10 font-semibold" 
            : "hover:bg-muted"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <span className={cn(
          "flex-1 text-sm",
          isTotal ? "text-foreground" : "text-foreground"
        )}>
          {labelToReadable(title)}
        </span>
      </button>
      
      {isExpanded && (
        <div className="space-y-0.5 mt-1">
          {Object.entries(items).map(([key, value]) => {
            // Skip null/undefined values or non-objects
            if (value === null || value === undefined || typeof value !== 'object') return null;
            
            // Check if it's a leaf node (has amount property)
            if ('amount' in value) {
              const item = value as FinancialItem;
              // Skip items where amount is null
              if (item.amount === null) return null;
              return (
                <FinancialRow
                  key={key}
                  label={key}
                  item={item}
                  path={[...path, key]}
                  currency={currency}
                  onDataChange={onDataChange}
                  onLabelChange={onLabelChange}
                  onDeleteRow={onDeleteRow}
                  isTotal={key.toLowerCase().includes('total')}
                />
              );
            } else {
              // It's a nested section
              return (
                <FinancialSection
                  key={key}
                  title={key}
                  items={value as Record<string, FinancialItem | undefined>}
                  path={[...path, key]}
                  currency={currency}
                  onDataChange={onDataChange}
                  onLabelChange={onLabelChange}
                  onAddRow={onAddRow}
                  onDeleteRow={onDeleteRow}
                  level={level + 1}
                />
              );
            }
          })}
          
          {/* Add Row Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddRow(path)}
            className="w-full mt-1 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/50"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add line item
          </Button>
        </div>
      )}
    </div>
  );
}

interface RowProps {
  label: string;
  item: FinancialItem;
  path: string[];
  currency: string;
  onDataChange: (path: string[], value: number) => void;
  onLabelChange: (path: string[], oldKey: string, newKey: string) => void;
  onDeleteRow?: (path: string[]) => void;
  isTotal?: boolean;
}

function FinancialRow({ label, item, path, currency, onDataChange, onLabelChange, onDeleteRow, isTotal }: RowProps) {
  const parentPath = path.slice(0, -1);
  
  return (
    <div className={cn(
      "grid grid-cols-12 gap-4 py-2 px-3 rounded-lg items-center data-row group",
      isTotal && "bg-muted/50 font-medium"
    )}>
      <div className="col-span-4 flex items-center gap-2">
        {!isTotal && onDeleteRow && (
          <button
            onClick={() => onDeleteRow(path)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
            title="Delete row"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <EditableLabel
          value={label}
          onChange={(newLabel) => onLabelChange(parentPath, label, newLabel)}
          isTotal={isTotal}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors flex-shrink-0">
              <Info className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-xs">Source</p>
              <p className="text-xs text-muted-foreground">{item.source_text}</p>
              <p className="text-xs font-mono">{item.source_value}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="col-span-4">
        <p className="text-xs text-muted-foreground truncate" title={item.source_text}>
          {item.source_text}
        </p>
      </div>
      <div className="col-span-4">
        <EditableCell
          value={item.amount}
          currency={currency}
          onChange={(newValue) => onDataChange([...path, 'amount'], newValue)}
        />
      </div>
    </div>
  );
}

export function FinancialTable({ data, onDataChange, onLabelChange, onAddRow, onDeleteRow }: FinancialTableProps) {
  const { financials, standardized_metadata } = data;
  const currency = standardized_metadata.currency;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 py-3 px-3 bg-table-header border-b border-border">
        <div className="col-span-4">
          <span className="section-header">Account</span>
        </div>
        <div className="col-span-4">
          <span className="section-header">Source</span>
        </div>
        <div className="col-span-4 text-right">
          <span className="section-header">Amount ({currency})</span>
        </div>
      </div>

      {/* Assets Section */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">Assets</span>
        </div>
        <FinancialRow
          label="total_assets"
          item={financials.assets.total_assets}
          path={['financials', 'assets', 'total_assets']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          isTotal
        />
        <FinancialSection
          title="current"
          items={financials.assets.current as unknown as Record<string, unknown>}
          path={['financials', 'assets', 'current']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
        />
        <FinancialSection
          title="non_current"
          items={financials.assets.non_current as unknown as Record<string, unknown>}
          path={['financials', 'assets', 'non_current']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
        />
      </div>

      {/* Liabilities Section */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-sm font-semibold text-warning uppercase tracking-wide">Liabilities</span>
        </div>
        <FinancialRow
          label="total_liabilities"
          item={financials.liabilities.total_liabilities}
          path={['financials', 'liabilities', 'total_liabilities']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          isTotal
        />
        <FinancialSection
          title="current"
          items={financials.liabilities.current as unknown as Record<string, unknown>}
          path={['financials', 'liabilities', 'current']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
        />
        <FinancialSection
          title="non_current"
          items={financials.liabilities.non_current as unknown as Record<string, unknown>}
          path={['financials', 'liabilities', 'non_current']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
        />
      </div>

      {/* Equity Section */}
      <div className="p-2">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-sm font-semibold text-success uppercase tracking-wide">Equity</span>
        </div>
        <FinancialRow
          label="total_equity"
          item={financials.equity.total_equity}
          path={['financials', 'equity', 'total_equity']}
          currency={currency}
          onDataChange={onDataChange}
          onLabelChange={onLabelChange}
          isTotal
        />
        {Object.entries(financials.equity)
          .filter(([key, value]) => key !== 'total_equity' && value && typeof value === 'object' && 'amount' in value && (value as FinancialItem).amount !== null)
          .map(([key, value]) => (
            <FinancialRow
              key={key}
              label={key}
              item={value as FinancialItem}
              path={['financials', 'equity', key]}
              currency={currency}
              onDataChange={onDataChange}
              onLabelChange={onLabelChange}
              onDeleteRow={onDeleteRow}
            />
          ))}
        
        {/* Add Row Button for Equity */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddRow(['financials', 'equity'])}
          className="w-full mt-1 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/50"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add line item
        </Button>
      </div>
    </div>
  );
}
