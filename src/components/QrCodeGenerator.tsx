import React, { useState } from 'react';
import { Printer, ExternalLink, QrCode, Grid, Sliders, Check } from 'lucide-react';
import { PrintableTableCard } from './PrintableTableCard';

interface QrCodeGeneratorProps {
  onSimulateScan: (tableNum: string) => void;
}

export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ onSimulateScan }) => {
  const [selectedTable, setSelectedTable] = useState<string>('01');
  const [customTableInput, setCustomTableInput] = useState<string>('');
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [batchCount, setBatchCount] = useState<number>(12);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Derive current base app URL
  const currentBaseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://kimmo-restaurant.cambodia';

  const quickTables = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const handlePrint = () => {
    window.print();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTableInput.trim()) {
      setSelectedTable(customTableInput.trim());
      setCustomTableInput('');
    }
  };

  const handleCopyLink = () => {
    const url = `${currentBaseUrl}?table=${encodeURIComponent(selectedTable)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden when printing) */}
      <div className="no-print bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-dangrek text-[#8B0000] flex items-center gap-2">
              <QrCode className="w-6 h-6 text-[#8B0000]" />
              <span>បង្កើត QR Code សម្រាប់បិទលើតុអាហារ (Table QR Generator)</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              បោះពុម្ពស្លាក QR Code នេះដើម្បីបិទ ឬដាក់តាំងលើតុអាហារនីមួយៗក្នុងហាង KIMMO
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl self-start md:self-auto">
            <button
              id="btn-mode-single"
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dangrek transition-all ${
                mode === 'single'
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>ស្លាកតុទោល (Single)</span>
            </button>
            <button
              id="btn-mode-batch"
              type="button"
              onClick={() => setMode('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dangrek transition-all ${
                mode === 'batch'
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>បោះពុម្ពច្រើនតុ (Batch Sheet)</span>
            </button>
          </div>
        </div>

        {/* Mode-specific configuration */}
        {mode === 'single' ? (
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Quick table selector */}
            <div className="w-full sm:w-auto">
              <span className="text-xs font-bold text-stone-600 block mb-2 font-dangrek">
                ជ្រើសរើសលេខតុរហ័ស៖
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTables.map((t) => (
                  <button
                    id={`btn-select-table-${t}`}
                    key={t}
                    type="button"
                    onClick={() => setSelectedTable(t)}
                    className={`w-9 h-9 rounded-lg font-dangrek text-sm transition-all border ${
                      selectedTable === t
                        ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm scale-105'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom table number input */}
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                id="input-custom-table"
                type="text"
                placeholder="លេខតុផ្សេង..."
                value={customTableInput}
                onChange={(e) => setCustomTableInput(e.target.value)}
                className="w-28 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#8B0000]"
              />
              <button
                id="btn-apply-custom-table"
                type="submit"
                className="px-3 py-2 bg-stone-800 hover:bg-black text-white text-xs font-dangrek rounded-lg transition-colors whitespace-nowrap"
              >
                កំណត់
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-stone-600 font-dangrek">
              ចំនួនតុដែលត្រូវបោះពុម្ព៖
            </span>
            {[6, 12, 18, 24].map((count) => (
              <button
                id={`btn-batch-count-${count}`}
                key={count}
                type="button"
                onClick={() => setBatchCount(count)}
                className={`px-3 py-1.5 rounded-lg text-xs font-dangrek border transition-all ${
                  batchCount === count
                    ? 'bg-[#8B0000] text-white border-[#8B0000]'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                តុ ១ ដល់ {count} ({count} តុ)
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-print-table-card"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B0000] hover:bg-[#730000] text-white font-dangrek rounded-xl shadow-md transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ពស្លាកតុ (Print Stickers / Cards)</span>
            </button>

            {mode === 'single' && (
              <button
                id="btn-copy-table-link"
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl border border-stone-200 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'បានចម្លងតំណភ្ជាប់!' : 'ចម្លងតំណ Link'}</span>
              </button>
            )}
          </div>

          {mode === 'single' && (
            <button
              id="btn-simulate-customer-scan"
              type="button"
              onClick={() => onSimulateScan(selectedTable)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-dangrek rounded-xl text-xs transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              <span>សាកល្បងស្កេនតុ {selectedTable} នេះផ្ទាល់</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Area */}
      {mode === 'single' ? (
        <div className="printable-area py-4 flex flex-col items-center justify-center">
          <div className="no-print mb-3 text-xs text-stone-500 font-medium">
            ទម្រង់បង្ហាញស្លាកតុអាហារ (Single Table Card Preview)
          </div>
          <PrintableTableCard tableNumber={selectedTable} baseUrl={currentBaseUrl} variant="single" />
        </div>
      ) : (
        <div className="printable-area">
          <div className="no-print mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#8B0000] font-medium flex items-center justify-between">
            <span>
              កំពុងបង្ហាញស្លាក QR Code ចំនួន {batchCount} តុ ត្រៀមសម្រាប់ការបោះពុម្ពលើក្រដាស A4 ឬ Sticker
            </span>
            <button
              id="btn-print-batch-top"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B0000] text-white rounded-lg text-xs font-dangrek"
            >
              <Printer className="w-3.5 h-3.5" />
              បោះពុម្ពទាំងអស់
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: batchCount }).map((_, i) => {
              const tableNum = (i + 1).toString().padStart(2, '0');
              return (
                <div key={tableNum} className="relative group">
                  <PrintableTableCard
                    tableNumber={tableNum}
                    baseUrl={currentBaseUrl}
                    variant="grid-item"
                  />
                  <div className="no-print mt-2 text-center">
                    <button
                      id={`btn-batch-simulate-table-${tableNum}`}
                      type="button"
                      onClick={() => onSimulateScan(tableNum)}
                      className="text-[11px] text-[#8B0000] hover:underline font-semibold"
                    >
                      សាកល្បងស្កេនតុ {tableNum} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
