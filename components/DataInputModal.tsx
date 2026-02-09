import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Beer, Tag, PieChart, LucideIcon, Calendar } from 'lucide-react';
import { MetricsState } from '../types';

interface DataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMetrics: MetricsState;
  currentDateLabel: string;
  onSave: (newMetrics: MetricsState, newDateLabel: string) => void;
}

type InputType = 'currency' | 'number' | 'decimal';

// Helper: Format number to Currency string (R$ 0,00)
const formatCurrencyValue = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

// Helper: Format number to Integer string with thousands separator (0.000)
const formatNumberValue = (val: number) => {
  return new Intl.NumberFormat('pt-BR').format(val);
};

// Component extracted to prevent re-mounting
const MetricInputGroup = ({
  title,
  icon: Icon,
  currentVal,
  targetVal,
  type,
  onChange,
}: {
  title: string;
  icon: LucideIcon;
  currentVal: string;
  targetVal: string;
  type: InputType;
  onChange: (field: 'current' | 'target', value: string) => void;
}) => {

  const handleInputChange = (field: 'current' | 'target', rawValue: string) => {
    let newValue = rawValue;

    // Remove existing formatting to process raw input
    if (type === 'currency') {
      const digits = rawValue.replace(/\D/g, '');
      const numberValue = digits ? Number(digits) / 100 : 0;
      newValue = formatCurrencyValue(numberValue);
    } else if (type === 'number') {
      const digits = rawValue.replace(/\D/g, '');
      const numberValue = digits ? Number(digits) : 0;
      newValue = formatNumberValue(numberValue);
    } 
    // For 'decimal' (Share), we allow free typing but maybe normalize commas/dots if needed. 
    // We leave it as is to allow typing "19,5" naturally.

    onChange(field, newValue);
  };

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
      <div className="flex items-center gap-2 mb-3 text-janela-yellow">
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-sm uppercase">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Realizado (Atual)</label>
          <input
            type="text"
            inputMode={type === 'decimal' ? 'decimal' : 'numeric'}
            value={currentVal}
            onChange={(e) => handleInputChange('current', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-3 sm:py-2 text-white text-base focus:outline-none focus:border-janela-yellow transition-colors placeholder-zinc-700 font-mono"
            placeholder={type === 'currency' ? 'R$ 0,00' : '0'}
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Meta (Alvo)</label>
          <input
            type="text"
            inputMode={type === 'decimal' ? 'decimal' : 'numeric'}
            value={targetVal}
            onChange={(e) => handleInputChange('target', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-3 sm:py-2 text-white text-base focus:outline-none focus:border-janela-yellow transition-colors placeholder-zinc-700 font-mono"
            placeholder={type === 'currency' ? 'R$ 0,00' : '0'}
          />
        </div>
      </div>
    </div>
  );
};

const DataInputModal: React.FC<DataInputModalProps> = ({ isOpen, onClose, currentMetrics, currentDateLabel, onSave }) => {
  // Local state holds the formatted strings
  const [localValues, setLocalValues] = useState<Record<string, { current: string; target: string }>>({});
  const [localDateLabel, setLocalDateLabel] = useState('');

  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, { current: string; target: string }> = {};
      
      const getFormattedInitial = (key: string, val: number) => {
        if (key === 'revenue' || key === 'ticket') return formatCurrencyValue(val);
        if (key === 'drinks') return formatNumberValue(val);
        // For Share, keep original string representation but ensure comma for BR
        return val.toString().replace('.', ',');
      };

      (Object.keys(currentMetrics) as Array<keyof MetricsState>).forEach((key) => {
        initialValues[key] = {
          current: getFormattedInitial(key, currentMetrics[key].current),
          target: getFormattedInitial(key, currentMetrics[key].target),
        };
      });
      setLocalValues(initialValues);
      setLocalDateLabel(currentDateLabel);
    }
  }, [isOpen, currentMetrics, currentDateLabel]);

  if (!isOpen) return null;

  const handleChange = (category: keyof MetricsState, field: 'current' | 'target', value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    const newMetrics = { ...currentMetrics };
    
    (Object.keys(localValues) as Array<keyof MetricsState>).forEach((key) => {
      if (localValues[key]) {
        const currentStr = localValues[key].current;
        const targetStr = localValues[key].target;
        
        let currentVal = 0;
        let targetVal = 0;

        if (key === 'revenue' || key === 'ticket') {
          // Parse Currency: remove non digits, divide by 100
          currentVal = Number(currentStr.replace(/\D/g, '')) / 100;
          targetVal = Number(targetStr.replace(/\D/g, '')) / 100;
        } else if (key === 'drinks') {
          // Parse Number: remove non digits
          currentVal = Number(currentStr.replace(/\D/g, ''));
          targetVal = Number(targetStr.replace(/\D/g, ''));
        } else {
          // Parse Decimal/Share: replace comma with dot
          currentVal = parseFloat(currentStr.replace(',', '.')) || 0;
          targetVal = parseFloat(targetStr.replace(',', '.')) || 0;
        }

        newMetrics[key] = {
          ...newMetrics[key],
          current: currentVal,
          target: targetVal,
        };
      }
    });

    onSave(newMetrics, localDateLabel);
    onClose();
  };

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
          
          {/* Reference Date Input */}
          <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2 mb-3 text-janela-yellow">
              <Calendar className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase">Mês de Referência</h3>
            </div>
            <div>
              <input
                type="text"
                value={localDateLabel}
                onChange={(e) => setLocalDateLabel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-3 sm:py-2 text-white text-base focus:outline-none focus:border-janela-yellow transition-colors placeholder-zinc-700 font-mono"
                placeholder="EX: JANEIRO 2025"
              />
            </div>
          </div>

          <MetricInputGroup 
            title="Faturamento" 
            icon={DollarSign} 
            currentVal={localValues['revenue']?.current ?? ''} 
            targetVal={localValues['revenue']?.target ?? ''}
            type="currency"
            onChange={(f, v) => handleChange('revenue', f, v)}
          />
          <MetricInputGroup 
            title="Venda de Drinks" 
            icon={Beer} 
            currentVal={localValues['drinks']?.current ?? ''} 
            targetVal={localValues['drinks']?.target ?? ''}
            type="number"
            onChange={(f, v) => handleChange('drinks', f, v)}
          />
          <MetricInputGroup 
            title="Participação (Share)" 
            icon={PieChart} 
            currentVal={localValues['share']?.current ?? ''} 
            targetVal={localValues['share']?.target ?? ''}
            type="decimal"
            onChange={(f, v) => handleChange('share', f, v)}
          />
          <MetricInputGroup 
            title="Ticket Médio" 
            icon={Tag} 
            currentVal={localValues['ticket']?.current ?? ''} 
            targetVal={localValues['ticket']?.target ?? ''}
            type="currency"
            onChange={(f, v) => handleChange('ticket', f, v)}
          />
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