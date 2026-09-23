import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { KimmoLogo } from './KimmoLogo';
import { Smartphone } from 'lucide-react';

interface PrintableTableCardProps {
  tableNumber: string;
  baseUrl: string;
  variant?: 'single' | 'grid-item';
}

export const PrintableTableCard: React.FC<PrintableTableCardProps> = ({
  tableNumber,
  baseUrl,
  variant = 'single',
}) => {
  // Target URL with table parameter
  const scanUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}table=${encodeURIComponent(
    tableNumber
  )}`;

  return (
    <div
      className={`bg-white border-4 border-[#8B0000] rounded-2xl p-5 text-center shadow-lg transition-transform relative overflow-hidden flex flex-col items-center justify-between ${
        variant === 'grid-item'
          ? 'w-[280px] h-[360px] mx-auto'
          : 'max-w-xs sm:max-w-sm w-full mx-auto min-h-[400px]'
      }`}
      style={{
        boxShadow: '0 4px 20px rgba(139, 0, 0, 0.12)',
      }}
    >
      {/* Decorative top dark red strip */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#8B0000]" />

      {/* Brand Header */}
      <div className="pt-2 flex flex-col items-center">
        <KimmoLogo size="sm" variant="dark" showSubtitle={false} />
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8B0000] font-dangrek">
          <span>គីមម៉ូ មីហឹរ 7 កម្រិត</span>
        </div>
      </div>

      {/* Table Number Callout */}
      <div className="my-2 bg-[#8B0000] text-white px-5 py-1.5 rounded-full shadow-inner font-dangrek text-lg tracking-wider border-2 border-amber-300">
        តុលេខ {tableNumber}
      </div>

      {/* Instructions */}
      <div className="text-xs text-stone-700 font-semibold mb-2">
        ស្កេនទីនេះដើម្បីបញ្ចេញមតិយោបល់ ឬត្អូញត្អែរ
      </div>

      {/* High contrast QR code frame */}
      <div className="p-3 bg-white border-2 border-[#8B0000] rounded-xl shadow-sm flex items-center justify-center">
        <QRCodeSVG
          value={scanUrl}
          size={variant === 'grid-item' ? 140 : 160}
          level="H"
          fgColor="#8B0000"
          bgColor="#FFFFFF"
          includeMargin={false}
          imageSettings={{
            src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%238B0000"/><text x="50" y="62" fill="white" font-size="34" font-weight="900" font-family="sans-serif" text-anchor="middle">K</text></svg>',
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>

      {/* Call to action & Footer */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B0000] bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
          <Smartphone className="w-3.5 h-3.5" />
          <span>បើកកាមេរ៉ាទូរស័ព្ទដើម្បីស្កេន</span>
        </div>
        <p className="text-[10px] text-stone-500 mt-1 font-medium">
          យើងខ្ញុំរីករាយទទួលយកការរិះគន់ដើម្បីស្ថាបនា!
        </p>
      </div>

      {/* Decorative bottom dark red strip */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#8B0000]" />
    </div>
  );
};
