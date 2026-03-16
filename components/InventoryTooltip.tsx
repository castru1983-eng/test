import React, { useState } from 'react';

interface InventoryTooltipProps {
  inventory: Record<string, { quantity: number | string, confirmed: boolean }>;
  activePageName: string;
  children: React.ReactNode;
  onToggleConfirm?: () => void;
}

export const InventoryTooltip: React.FC<InventoryTooltipProps> = ({ inventory, activePageName, children, onToggleConfirm }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 尋找符合當前工作區名稱 (也就是廠區名稱) 的資料
  const targetInventoryKey = Object.keys(inventory).find(
    key => key.trim().toLowerCase().includes(activePageName.trim().toLowerCase())
  );

  const inventoryData = targetInventoryKey ? inventory[targetInventoryKey] : undefined;
  const inventoryValue = inventoryData?.quantity;
  const isConfirmed = inventoryData?.confirmed || false;

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`border-b-2 border-dashed hover:bg-yellow-200 transition-colors ${isConfirmed ? 'border-green-600 bg-green-50' : 'border-black'}`}>
        {children}
        {isConfirmed && <i className="fas fa-check-circle text-green-600 ml-1 text-[10px]"></i>}
      </span>
      
      {showTooltip && (
        <div className="absolute z-[200] bottom-full left-1/2 -translate-x-1/2 mb-2 w-max animate-bounce-short">
          <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative min-w-[180px]">
            {/* Tooltip 底部箭頭 */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-black transform rotate-45"></div>
            
            <h4 className="font-black text-[10px] uppercase mb-1 text-gray-400 tracking-wider flex items-center gap-1">
               📍 {activePageName} 廠區庫存
            </h4>
            
            <div className={`text-4xl font-black italic tracking-tighter mb-4 drop-shadow-[2px_2px_0px_white] ${isConfirmed ? 'text-green-600' : 'text-blue-600'}`}>
               {inventoryValue !== undefined ? inventoryValue : <span className="text-red-500 text-sm font-normal not-italic">查無資料</span>}
            </div>

            <div 
              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all cursor-pointer select-none ${isConfirmed ? 'bg-green-100 border-green-600 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleConfirm?.();
              }}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isConfirmed ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-400'}`}>
                {isConfirmed && <i className="fas fa-check text-xs"></i>}
              </div>
              <span className="font-black text-xs">數量核對正確</span>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};
