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
    <div className="w-full flex flex-col">
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

      {/* Chart (menor + rosca mais fina) */}
      <div className="relative w-full max-w-[520px] mx-auto h-[170px] sm:h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="85%"              // joga a rosca mais pra baixo
              startAngle={180}
              endAngle={0}
              innerRadius="88%"     // MAIS FINO (antes estava muito grosso)
              outerRadius="100%"
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Texto abaixo (sem sobrepor) */}
      <div className="mt-2 flex flex-col items-center text-center gap-1">
        <span className="text-zinc-400 text-xs uppercase tracking-widest">Atual</span>

        <span className="text-janela-yellow font-extrabold text-2xl sm:text-3xl bg-janela-yellow/10 px-4 py-1 rounded-full border border-janela-yellow/20">
          {formatCurrency(current)}
        </span>

        <span className="text-sm text-zinc-300">
          {isDone ? (
            <span className="text-green-400 font-bold">✅ Meta atingida</span>
          ) : (
            <>
              Falta <span className="text-white font-extrabold">{formatCurrency(remaining)}</span> para atingir a meta
            </>
          )}
        </span>

        {/* Percentual padrão */}
        <span className="text-janela-yellow font-extrabold text-sm sm:text-base mt-1">
          {pct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default RevenueChart;
