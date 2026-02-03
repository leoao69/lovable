import { useState, useCallback } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { SummaryCards } from '@/components/SummaryCards';
import { FinancialTable } from '@/components/FinancialTable';
import { YearSelector } from '@/components/YearSelector';
import { ActionButtons } from '@/components/ActionButtons';
import { ValidationStatus } from '@/components/ValidationStatus';
import { FinancialData, ProcessingStatus as Status } from '@/types/financials';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [originalData, setOriginalData] = useState<FinancialData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setStatus('idle');
    setError(undefined);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setStatus('idle');
    setError(undefined);
    setFinancialData(null);
    setOriginalData(null);
    setHasChanges(false);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStatus('processing');
    
    try {
      // Read file content - for demo, we'll parse JSON directly
      // In production, this would call your backend API
      const content = await selectedFile.text();
      const parsed = JSON.parse(content) as FinancialData;
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFinancialData(parsed);
      setOriginalData(JSON.parse(JSON.stringify(parsed)));
      
      // Set the first year as selected
      const years = Object.keys(parsed);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
      
      setStatus('complete');
      toast({
        title: "Processing complete",
        description: `Successfully extracted financial data for ${years.length} period(s).`,
      });
    } catch (err) {
      setStatus('error');
      setError('Failed to parse file. Please ensure it\'s a valid format.');
    }
  }, [selectedFile, toast]);

  const handleDataChange = useCallback((path: string[], value: number) => {
    if (!financialData) return;

    setFinancialData(prev => {
      if (!prev) return prev;
      
      const newData = JSON.parse(JSON.stringify(prev));
      let current: unknown = newData[selectedYear];
      
      for (let i = 0; i < path.length - 1; i++) {
        current = (current as Record<string, unknown>)[path[i]];
      }
      
      (current as Record<string, unknown>)[path[path.length - 1]] = value;
      
      return newData;
    });
    
    setHasChanges(true);
  }, [financialData, selectedYear]);

  const handleLabelChange = useCallback((path: string[], oldKey: string, newKey: string) => {
    if (!financialData || oldKey === newKey) return;

    // Convert to snake_case for consistency
    const snakeCaseKey = newKey.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (!snakeCaseKey) return;

    setFinancialData(prev => {
      if (!prev) return prev;
      
      const newData = JSON.parse(JSON.stringify(prev));
      let current: unknown = newData[selectedYear];
      
      for (let i = 0; i < path.length; i++) {
        current = (current as Record<string, unknown>)[path[i]];
      }
      
      const container = current as Record<string, unknown>;
      if (container[oldKey] !== undefined) {
        container[snakeCaseKey] = container[oldKey];
        delete container[oldKey];
      }
      
      return newData;
    });
    
    setHasChanges(true);
  }, [financialData, selectedYear]);

  const handleAddRow = useCallback((path: string[]) => {
    if (!financialData) return;

    const newItemKey = `new_item_${Date.now()}`;
    const newItem = {
      amount: 0,
      source_text: 'User added',
      source_value: '0'
    };

    setFinancialData(prev => {
      if (!prev) return prev;
      
      const newData = JSON.parse(JSON.stringify(prev));
      let current: unknown = newData[selectedYear];
      
      for (let i = 0; i < path.length; i++) {
        current = (current as Record<string, unknown>)[path[i]];
      }
      
      (current as Record<string, unknown>)[newItemKey] = newItem;
      
      return newData;
    });
    
    setHasChanges(true);
    toast({
      title: "Row added",
      description: "Click the label to rename it.",
    });
  }, [financialData, selectedYear, toast]);

  const handleDeleteRow = useCallback((path: string[]) => {
    if (!financialData) return;

    setFinancialData(prev => {
      if (!prev) return prev;
      
      const newData = JSON.parse(JSON.stringify(prev));
      let current: unknown = newData[selectedYear];
      
      // Navigate to the parent of the item to delete
      for (let i = 0; i < path.length - 1; i++) {
        current = (current as Record<string, unknown>)[path[i]];
      }
      
      // Delete the item
      delete (current as Record<string, unknown>)[path[path.length - 1]];
      
      return newData;
    });
    
    setHasChanges(true);
    toast({
      title: "Row deleted",
      description: "The line item has been removed.",
    });
  }, [financialData, selectedYear, toast]);

  const handleExport = useCallback(() => {
    if (!financialData) return;
    
    const blob = new Blob([JSON.stringify(financialData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_data_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Financial data has been exported as JSON.",
    });
  }, [financialData, toast]);

  const handleReset = useCallback(() => {
    if (originalData) {
      setFinancialData(JSON.parse(JSON.stringify(originalData)));
      setHasChanges(false);
      toast({
        title: "Data reset",
        description: "All changes have been reverted.",
      });
    }
  }, [originalData, toast]);

  const handleSave = useCallback(() => {
    // In production, this would save to your backend
    setOriginalData(JSON.parse(JSON.stringify(financialData)));
    setHasChanges(false);
    toast({
      title: "Changes saved",
      description: "Your modifications have been saved.",
    });
  }, [financialData, toast]);

  const years = financialData ? Object.keys(financialData) : [];
  const currentYearData = financialData && selectedYear ? financialData[selectedYear] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Balance Sheet Extractor</h1>
              <p className="text-sm text-muted-foreground">Extract and edit financial data from documents</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section - Show when no data */}
        {!financialData && (
          <div className="max-w-xl mx-auto space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              isProcessing={status === 'uploading' || status === 'processing'}
              selectedFile={selectedFile}
              onClear={handleClearFile}
            />
            
            <ProcessingStatus status={status} error={error} />
            
            {selectedFile && status !== 'processing' && status !== 'uploading' && (
              <Button
                onClick={handleProcess}
                className="w-full"
                size="lg"
              >
                Process Balance Sheet
              </Button>
            )}
          </div>
        )}

        {/* Results Section - Show when data available */}
        {financialData && currentYearData && (
          <div className="space-y-6 animate-slide-up">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <YearSelector
                years={years}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="text-muted-foreground"
                >
                  Upload New File
                </Button>
                <ActionButtons
                  onExport={handleExport}
                  onReset={handleReset}
                  onSave={handleSave}
                  hasChanges={hasChanges}
                />
              </div>
            </div>

            {/* Validation Status */}
            <ValidationStatus 
              validation={currentYearData.validation_report} 
              currency={currentYearData.standardized_metadata.currency}
            />

            {/* Summary Cards */}
            <SummaryCards data={currentYearData} year={selectedYear} />

            {/* Data Table */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Financial Details
                <span className="ml-2 text-xs font-normal">(click values to edit)</span>
              </h3>
              <FinancialTable
                data={currentYearData}
                onDataChange={handleDataChange}
                onLabelChange={handleLabelChange}
                onAddRow={handleAddRow}
                onDeleteRow={handleDeleteRow}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
