import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';

const RevenueChart: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const realPercentage = target > 0 ? (current / target) * 100 : 0;
  const chartPercentage = Math.min(realPercentage, 100);
  
  const data = [
    { name: 'Realizado', value: chartPercentage },
    { name: 'Restante', value: Math.max(0, 100 - chartPercentage) },
  ];

  const COLORS = ['#FFD700', '#1E1E1E']; // Janela Yellow and Dark Gray

  return (
    <div className="h-[280px] sm:h-[300px] w-full flex flex-col">
      <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          Progresso Faturamento
        </h3>
        <div className="text-right">
           <span className="text-[10px] sm:text-xs text-zinc-500 block uppercase tracking-wider">Meta Total</span>
           <span className="text-xs sm:text-sm font-bold text-white">{formatCurrency(target)}</span>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="75%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-progress" fill={COLORS[0]} />
              <Cell key="cell-remaining" fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Central Information Overlay */}
        <div className="absolute bottom-[25%] left-0 right-0 flex flex-col items-center justify-end pointer-events-none">
          <span className="text-zinc-400 text-xs sm:text-sm uppercase tracking-widest mb-1">Atingido</span>
          {/* Responsive font size */}
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter">
            {realPercentage.toFixed(1)}%
          </span>
          <span className="text-janela-yellow font-bold text-lg sm:text-xl mt-2 bg-janela-yellow/10 px-4 py-1 rounded-full border border-janela-yellow/20">
            {formatCurrency(current)}
          </span>
        </div>

        {/* Gauge Labels */}
        <div className="absolute bottom-[5%] w-full flex justify-between px-4 sm:px-8 text-[10px] sm:text-xs font-semibold text-zinc-500 uppercase">
          <span>R$ 0</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;