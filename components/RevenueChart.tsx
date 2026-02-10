import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';

type Props = {
  current: number;
  target: number;
};

const RevenueChart: React.FC<Props> = ({ current, target }) => {
  const safeTarget = Number(target) || 0;
  const safeCurrent = Number(current) || 0;

  const pct = useMemo(() => {
    if (safeTarget <= 0) return 0;
    const p = (safeCurrent / safeTarget) * 100;
    return Math.min(Math.max(p, 0), 100);
  }, [safeCurrent, safeTarget]);

  const remaining = useMemo(() => {
    if (safeTarget <= 0) return 0;
    return Math.max(0, safeTarget - safeCurrent);
  }, [safeCurrent, safeTarget]);

  const isDone = safeTarget > 0 && safeCurrent >= safeTarget;

  // Rosca (semi-gauge)
  const data = [
    { name: 'Realizado', value: pct },
    { name: 'Restante', value: 100 - pct },
  ];

  const COLORS = ['#FFD700', '#1E1E1E'];

  return (
    <div className="w-full flex flex-col">
      {/* Header (igual ao padrão do outro card) */}
      <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">Progresso Faturamento</h3>

        <div className="text-right">
          <span className="text-[10px] sm:text-xs text-zinc-500 block uppercase tracking-wider">
            Meta Total
          </span>
          <span className="text-xs sm:text-sm font-bold text-white">{formatCurrency(safeTarget)}</span>
        </div>
      </div>

      {/* Corpo do card (centralizado como o "Peso dos Drinks") */}
      <div className="relative h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="54%"          // centraliza melhor no card (sem ficar “lá embaixo”)
              startAngle={180}
              endAngle={0}
              innerRadius={72}  // rosca com espessura parecida do outro card
              outerRadius={92}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Texto central (igual ao ShareChart) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-sm text-zinc-400 mb-1">Atual</div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none">
            {pct.toFixed(1)}%
          </div>

          <div className="mt-2 text-janela-yellow font-extrabold text-xl sm:text-2xl bg-janela-yellow/10 px-4 py-1 rounded-full border border-janela-yellow/20">
            {formatCurrency(safeCurrent)}
          </div>

          <div className="mt-2 text-sm text-zinc-400">
            {safeTarget <= 0 ? (
              <>Defina a meta para calcular.</>
            ) : isDone ? (
              <span className="text-green-400 font-bold">Meta atingida</span>
            ) : (
              <>
                Falta <span className="text-white font-bold">{formatCurrency(remaining)}</span> para atingir a meta
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
