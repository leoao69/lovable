import { TrendingUp, TrendingDown, Building2, Calendar, DollarSign } from 'lucide-react';
import { YearData } from '@/types/financials';
import { formatCurrency } from '@/lib/formatters';

interface SummaryCardsProps {
  data: YearData;
  year: string;
}

export function SummaryCards({ data, year }: SummaryCardsProps) {
  const { standardized_metadata, financials } = data;
  const totalAssets = financials.assets.total_assets.amount;
  const totalLiabilities = financials.liabilities.total_liabilities.amount;
  const totalEquity = financials.equity.total_equity.amount;
  const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;

  const cards = [
    {
      label: 'Total Assets',
      value: formatCurrency(totalAssets, standardized_metadata.currency),
      icon: TrendingUp,
      iconClass: 'text-success bg-success/10',
    },
    {
      label: 'Total Liabilities',
      value: formatCurrency(totalLiabilities, standardized_metadata.currency),
      icon: TrendingDown,
      iconClass: 'text-warning bg-warning/10',
    },
    {
      label: 'Total Equity',
      value: formatCurrency(totalEquity, standardized_metadata.currency),
      icon: DollarSign,
      iconClass: 'text-primary bg-primary/10',
    },
    {
      label: 'Debt to Equity',
      value: debtToEquity.toFixed(2) + 'x',
      icon: Building2,
      iconClass: 'text-muted-foreground bg-muted',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {standardized_metadata.company_name}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {standardized_metadata.date}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {standardized_metadata.currency}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          FY {year}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-lg p-4 animate-slide-up"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconClass}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="text-lg font-semibold font-mono text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
