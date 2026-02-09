import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ShareChart: React.FC<{ currentShare: number; targetShare: number }> = ({ currentShare, targetShare }) => {
  // We want to visualize the Current Share vs The "Rest" of the revenue
  // Also visually indicate the target.
  
  const data = [
    { name: 'Drinks', value: currentShare },
    { name: 'Outros', value: 100 - currentShare },
  ];

  const COLORS = ['#FFD700', '#1E1E1E'];

  return (
    <div className="h-[300px] w-full relative">
       <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
        <h3 className="text-lg font-bold text-white">
          Peso dos Drinks
        </h3>
        <span className="text-xs text-zinc-400">Meta: {targetShare}%</span>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#121212', borderColor: '#FFD700', borderRadius: '8px' }}
             itemStyle={{ color: '#fff' }}
             formatter={(val: number) => `${val.toFixed(2)}%`}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="block text-2xl font-bold text-white">{currentShare}%</span>
        <span className="text-xs text-zinc-500">Realizado</span>
      </div>
    </div>
  );
};

export default ShareChart;