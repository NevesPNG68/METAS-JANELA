import React from 'react';
import { formatCurrency } from '../utils';

const RevenueChart: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const safeTarget = target > 0 ? target : 0;
  const realPercentage = safeTarget > 0 ? (current / safeTarget) * 100 : 0;
  const pct = Math.min(100, Math.max(0, realPercentage));
  const remaining = Math.max(0, safeTarget - current);
  const isDone = safeTarget > 0 && current >= safeTarget;

  return (
    <div className="h-[280px] sm:h-[300px] w-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">Progresso Faturamento</h3>
        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-zinc-500 block uppercase tracking-wider">
            Meta Total
          </span>
          <span className="text-xs sm:text-sm font-bold text-white">
            {formatCurrency(safeTarget)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        {/* Top values */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs text-zinc-500 block uppercase tracking-wider">
              Atual
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-janela-yellow tracking-tight">
              {formatCurrency(current)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-zinc-500 block uppercase tracking-wider">
              Atingido
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {pct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="h-3 sm:h-4 w-full rounded-full bg-black/60 border border-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-janela-yellow transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">
            <span>R$ 0</span>
            <span>{formatCurrency(safeTarget)}</span>
          </div>
        </div>

        {/* Status box (replaces the confusing "R$ 0") */}
        <div className="mt-5 p-4 rounded-lg bg-black/40 border border-zinc-800">
          {isDone ? (
            <p className="text-sm text-green-400 font-bold">✅ Meta de faturamento atingida.</p>
          ) : (
            <p className="text-sm text-zinc-200">
              Falta{' '}
              <span className="text-white font-extrabold">{formatCurrency(remaining)}</span> para
              atingir a meta.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
