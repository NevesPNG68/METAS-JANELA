export interface KPIData {
  label: string;
  target: number;
  current: number;
  unit: 'currency' | 'number' | 'percent';
  description?: string;
}

export interface MetricsState {
  revenue: KPIData;
  drinks: KPIData;
  ticket: KPIData;
  share: KPIData;
}

export interface ChartDataPoint {
  name: string;
  realizado: number;
  meta: number;
  amt?: number;
}