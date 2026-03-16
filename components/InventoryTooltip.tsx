import React, { useState } from 'react';

interface InventoryTooltipProps {
  inventory: Record<string, number | string>;
  activePageName: string;
  children: React.ReactNode;
}

export const InventoryTooltip: React.FC<InventoryTooltipProps> = ({ inventory, activePageName, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 尋找符合當前工作區名稱 (也就是廠區名稱) 的資料
  // 透過 .includes() 檢查「產品位置」欄位是否包含當前分頁名稱 (例如: "P2/庫存" 包含 "P2")
  const targetInventoryKey = Object.keys(inventory).find(
    key => key.trim().toLowerCase().includes(activePageName.trim().toLowerCase())
  );

  const inventoryValue = targetInventoryKey ? inventory[targetInventoryKey] : undefined;

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="border-b-2 border-dashed border-black hover:bg-yellow-200 transition-colors">
        {children}
      </span>
      
      {showTooltip && (
        <div className="absolute z-[200] bottom-full left-1/2 -translate-x-1/2 mb-2 w-max animate-bounce-short">
          <div className="bg-white border-4 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
            {/* Tooltip 底部箭頭 */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-black transform rotate-45"></div>
            
            <h4 className="font-black text-xs uppercase mb-1 text-gray-500">{activePageName} 庫存數量</h4>
            <div className="text-2xl font-black italic">
               {inventoryValue !== undefined ? inventoryValue : <span className="text-red-500 text-sm">無資料</span>}
            </div>
          </div>
        </div>
      )}
    </span>
  );
};
