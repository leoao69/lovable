import { cn } from '@/lib/utils';

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  if (years.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Period:</span>
      <div className="flex rounded-lg bg-muted p-1">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              selectedYear === year
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
