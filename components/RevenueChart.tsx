import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';

const RevenueChart: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const safeTarget = target > 0 ? target : 0;

  const realPercentage = safeTarget > 0 ? (current / safeTarget) * 100 : 0;
  const pct = Math.min(Math.max(realPercentage, 0), 100);

  const remaining = Math.max(0, safeTarget - current);
  const isDone = safeTarget > 0 && current >= safeTarget;

  const data = [
    { name: 'Realizado', value: pct },
    { name: 'Restante', value: 100 - pct },
  ];

  const COLORS = ['#FFD700', '#1E1E1E'];

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

      {/* Gauge */}
      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="72%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centro: valor + status */}
        <div className="absolute bottom-[26%] left-0 right-0 flex flex-col items-center justify-end pointer-events-none">
          <span className="text-zinc-400 text-xs sm:text-sm uppercase tracking-widest mb-1">
            Atual
          </span>

          <span className="text-janela-yellow font-extrabold text-2xl sm:text-3xl bg-janela-yellow/10 px-4 py-1 rounded-full border border-janela-yellow/20">
            {formatCurrency(current)}
          </span>

          <span className="mt-2 text-xs sm:text-sm text-zinc-300">
            {isDone ? (
              <span className="text-green-400 font-bold">✅ Meta atingida</span>
            ) : (
              <>
                Falta <span className="text-white font-extrabold">{formatCurrency(remaining)}</span>{' '}
                para atingir a meta
              </>
            )}
          </span>
        </div>

        {/* Percentual padrão (igual aos cards) */}
        <div className="absolute bottom-[8%] left-0 right-0 flex items-center justify-center pointer-events-none">
          <span className="text-janela-yellow font-extrabold text-sm sm:text-base">
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
