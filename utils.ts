export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const calculateProgress = (current: number, target: number) => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};