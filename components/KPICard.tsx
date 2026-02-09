import React from 'react';
import { KPIData } from '../types';
import { formatCurrency, formatNumber, formatPercent, calculateProgress } from '../utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  data: KPIData;
  icon: LucideIcon;
}

const KPICard: React.FC<KPICardProps> = ({ data, icon: Icon }) => {
  const { label, target, current, unit, description } = data;
  
  const progress = calculateProgress(current, target);

  const formattedCurrent = unit === 'currency' ? formatCurrency(current) : unit === 'percent' ? formatPercent(current) : formatNumber(current);
  const formattedTarget = unit === 'currency' ? formatCurrency(target) : unit === 'percent' ? formatPercent(target) : formatNumber(target);

  return (
    <div className="bg-janela-gray border-l-4 border-janela-yellow p-4 sm:p-6 rounded-r-lg shadow-lg hover:bg-zinc-800 transition-colors duration-200 group">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div>
          <h3 className="text-zinc-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">{label}</h3>
          {description && <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 line-clamp-1">{description}</p>}
        </div>
        <div className="p-1.5 sm:p-2 bg-janela-black rounded-lg border border-zinc-800 group-hover:border-janela-yellow transition-colors shrink-0 ml-2">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-janela-yellow" />
        </div>
      </div>

      <div className="mb-2">
        <span className="text-2xl sm:text-3xl font-bold text-white block truncate">{formattedCurrent}</span>
        <span className="text-[10px] sm:text-xs text-zinc-400">Meta: {formattedTarget}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black h-2 sm:h-3 rounded-full overflow-hidden mt-3 sm:mt-4 border border-zinc-800">
        <div 
          className="h-full bg-janela-yellow transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
         <span className="text-[10px] sm:text-xs text-janela-yellow font-bold">{progress.toFixed(1)}%</span>
         <span className="text-[10px] sm:text-xs text-zinc-600">Concluído</span>
      </div>
    </div>
  );
};

export default KPICard;