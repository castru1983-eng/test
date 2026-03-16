import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface InventoryTooltipProps {
  inventory: Record<string, { quantity: number | string, confirmed: boolean }>;
  activePageName: string;
  children: React.ReactNode;
  onToggleConfirm?: () => void;
}

export const InventoryTooltip: React.FC<InventoryTooltipProps> = ({ inventory, activePageName, children, onToggleConfirm }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // 尋找符合當前工作區名稱 (也就是廠區名稱) 的資料
  const targetInventoryKey = Object.keys(inventory).find(
    key => key.trim().toLowerCase().includes(activePageName.trim().toLowerCase())
  );

  const inventoryData = targetInventoryKey ? inventory[targetInventoryKey] : undefined;
  const inventoryValue = inventoryData?.quantity;
  const isConfirmed = inventoryData?.confirmed || false;

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const needsBottom = rect.top < 300;
      setPosition(needsBottom ? 'bottom' : 'top');
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    updatePosition();
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowTooltip(false);
    }, 200);
  };

  // 監聽捲軸與視窗縮放，確保 Portal 位置正確
  React.useEffect(() => {
    if (showTooltip) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showTooltip]);

  const tooltipElement = showTooltip && (
    <div 
      className="fixed z-[99999] pointer-events-auto"
      style={{
        top: position === 'top' ? coords.top : coords.top + 30, // 30 is approximate trigger height
        left: coords.left + (coords.width / 2),
        transform: `translateX(-50%) ${position === 'top' ? 'translateY(-100%)' : 'translateY(0)'}`,
        marginTop: position === 'top' ? '-12px' : '12px'
      }}
      onMouseEnter={() => {
        if (closeTimeoutRef.current) {
          window.clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* 隱形透明橋接器 */}
      <div 
        className={`absolute left-0 right-0 h-8 bg-transparent ${position === 'top' ? 'top-full' : 'bottom-full'}`}
      ></div>

      <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative min-w-[220px] animate-in fade-in zoom-in duration-150">
        {/* Tooltip 箭頭 */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-black
          ${position === 'top' ? '-bottom-2.5 border-b-4 border-r-4' : '-top-2.5 border-t-4 border-l-4'}`}>
        </div>
        
        <h4 className="font-black text-[10px] uppercase mb-1 text-gray-400 tracking-wider flex items-center gap-1">
           📍 {activePageName} 廠區庫存
        </h4>
        
        <div className={`text-5xl font-black italic tracking-tighter mb-5 drop-shadow-[2px_2px_0px_white] ${isConfirmed ? 'text-green-600' : 'text-blue-600'}`}>
           {inventoryValue !== undefined ? inventoryValue : <span className="text-red-500 text-sm font-normal not-italic">查無資料</span>}
        </div>

        <div 
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer select-none ${isConfirmed ? 'bg-green-100 border-green-600 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleConfirm?.();
          }}
        >
          <div className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${isConfirmed ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-400 font-bold'}`}>
            {isConfirmed && <i className="fas fa-check text-sm"></i>}
          </div>
          <span className="font-black text-sm">數量核對正確</span>
        </div>
      </div>
    </div>
  );

  return (
    <span 
      ref={triggerRef}
      className={`relative inline-block cursor-help ${isConfirmed ? 'bg-green-50/50' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={`border-b-2 border-dashed hover:bg-yellow-200 transition-colors ${isConfirmed ? 'border-green-600' : 'border-black'}`}>
        {children}
        {isConfirmed && <i className="fas fa-check-circle text-green-600 ml-1 text-[10px]"></i>}
      </span>
      {createPortal(tooltipElement, document.body)}
    </span>
  );
};
