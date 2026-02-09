import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Beer, Tag, PieChart } from 'lucide-react';
import { MetricsState } from '../types';

interface DataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMetrics: MetricsState;
  onSave: (newMetrics: MetricsState) => void;
}

const DataInputModal: React.FC<DataInputModalProps> = ({ isOpen, onClose, currentMetrics, onSave }) => {
  const [formData, setFormData] = useState<MetricsState>(currentMetrics);

  // Update local state when prop changes or modal opens
  useEffect(() => {
    setFormData(currentMetrics);
  }, [currentMetrics, isOpen]);

  if (!isOpen) return null;

  const handleChange = (category: keyof MetricsState, field: 'current' | 'target', value: string) => {
    // Replace comma with dot for international format handling if user types comma
    const cleanValue = value.replace(',', '.');
    const numValue = parseFloat(cleanValue);
    
    // Allow empty string to let user clear input
    const finalValue = isNaN(numValue) && value !== '' ? formData[category][field] : numValue;

    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: finalValue
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const InputGroup = ({ 
    category, 
    title, 
    icon: Icon 
  }: { 
    category: keyof MetricsState; 
    title: string; 
    icon: any 
  }) => (
    <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
      <div className="flex items-center gap-2 mb-3 text-janela-yellow">
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-sm uppercase">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Realizado (Atual)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={isNaN(formData[category].current) ? '' : formData[category].current}
            onChange={(e) => handleChange(category, 'current', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-3 sm:py-2 text-white text-base focus:outline-none focus:border-janela-yellow transition-colors placeholder-zinc-700"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Meta (Alvo)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={isNaN(formData[category].target) ? '' : formData[category].target}
            onChange={(e) => handleChange(category, 'target', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-3 sm:py-2 text-white text-base focus:outline-none focus:border-janela-yellow transition-colors placeholder-zinc-700"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-zinc-900 sm:border border-zinc-700 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">Atualizar Métricas</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          <InputGroup category="revenue" title="Faturamento" icon={DollarSign} />
          <InputGroup category="drinks" title="Venda de Drinks" icon={Beer} />
          <InputGroup category="share" title="Participação (Share)" icon={PieChart} />
          <InputGroup category="ticket" title="Ticket Médio" icon={Tag} />
          {/* Add extra padding at bottom for mobile scrolling */}
          <div className="h-20 sm:h-0"></div> 
        </div>

        <div className="p-4 sm:p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900 sm:rounded-b-xl sticky bottom-0 z-10 pb-8 sm:pb-6">
          <button 
            onClick={onClose}
            className="hidden sm:block px-4 py-2 text-zinc-400 hover:text-white font-medium transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-janela-yellow text-black px-6 py-3 sm:py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10 active:scale-95"
          >
            <Save className="w-5 h-5 sm:w-4 sm:h-4" />
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
};

export default DataInputModal;