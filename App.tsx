import React, { useState } from 'react';
import { DollarSign, Beer, Tag, PieChart as PieChartIcon, TrendingDown, AlertTriangle, Download, Edit2 } from 'lucide-react';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import ShareChart from './components/ShareChart';
import DataInputModal from './components/DataInputModal';
import { MetricsState } from './types';
import { formatCurrency } from './utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const INITIAL_METRICS: MetricsState = {
  revenue: {
    label: 'Faturamento',
    target: 230000.00,
    current: 69634.24,
    unit: 'currency',
    description: 'Acumulado até a presente data'
  },
  drinks: {
    label: 'Venda de Drinks',
    target: 3000,
    current: 682,
    unit: 'number',
    description: 'Quantidade de drinks vendidos'
  },
  ticket: {
    label: 'Ticket Médio',
    target: 32.00,
    current: 29.23,
    unit: 'currency',
    description: 'Valor médio por pedido'
  },
  share: {
    label: 'Peso dos Drinks',
    target: 30.00,
    current: 19.88,
    unit: 'percent',
    description: '% do faturamento vindo de drinks'
  }
};

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsState>(INITIAL_METRICS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gapRevenue = metrics.revenue.target - metrics.revenue.current;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        logging: false,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains('no-print')
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      
      const ratio = imgProps.width / imgProps.height;
      const height = pdfWidth / ratio;
      
      let finalHeight = height;
      let finalWidth = pdfWidth;
      
      if (height > pdfHeight) {
         finalHeight = pdfHeight;
         finalWidth = finalHeight * ratio;
      }

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y > 0 ? 0 : 0, finalWidth, finalHeight);
      pdf.save('janela-bar-metas.pdf');
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Erro ao gerar PDF");
    }
  };

  return (
    <>
      <div id="dashboard-content" className="min-h-screen bg-janela-black text-white selection:bg-janela-yellow selection:text-black font-sans pb-10">
        
        {/* Navbar / Header */}
        <header className="bg-janela-yellow text-black py-3 sm:py-4 shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
               {/* Logo Area */}
               <div className="font-extrabold text-xl sm:text-2xl tracking-tighter italic border-b-2 border-black pb-1">
                  Janela
               </div>
               {/* Subtitle hidden on mobile to save space */}
               <span className="hidden sm:inline font-semibold text-lg opacity-80 border-l border-black/20 pl-3">Acompanhamento de Metas</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="no-print flex items-center justify-center gap-2 bg-black/10 hover:bg-black/20 text-black w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full text-sm font-bold transition-all border border-black/20"
                title="Editar Dados"
              >
                <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Editar</span>
              </button>

              <button 
                onClick={handleDownloadPDF}
                className="no-print flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-janela-yellow w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95"
                title="Baixar PDF"
              >
                <Download className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              
              {/* Date hidden on mobile */}
              <div className="hidden md:block text-sm font-semibold bg-black text-janela-yellow px-4 py-1 rounded-full border border-black/10">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-8">
          
          {/* Executive Summary Alert */}
          <div className="mb-6 sm:mb-8 p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start gap-4">
            <div className="hidden sm:block p-2 bg-red-900/30 rounded-full shrink-0">
              <TrendingDown className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-0">
                 <div className="sm:hidden p-1.5 bg-red-900/30 rounded-full shrink-0">
                    <TrendingDown className="text-red-500 w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-white">Status Geral</h2>
              </div>
              <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                {gapRevenue > 0 ? (
                  <>Faltam <span className="text-white font-bold">{formatCurrency(gapRevenue)}</span> para meta.</>
                ) : (
                  <span className="text-green-400 font-bold">Meta Atingida!</span>
                )}
                {' '}
                {metrics.ticket.current < metrics.ticket.target ? (
                  <>Ticket Médio <span className="text-red-400 font-bold">R$ {(metrics.ticket.target - metrics.ticket.current).toFixed(2)}</span> abaixo do ideal.</>
                ) : (
                  <>Ticket Médio <span className="text-green-400 font-bold">acima</span> do ideal.</>
                )}
              </p>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <KPICard data={metrics.revenue} icon={DollarSign} />
            <KPICard data={metrics.drinks} icon={Beer} />
            <KPICard data={metrics.ticket} icon={Tag} />
            <KPICard data={metrics.share} icon={PieChartIcon} />
          </div>

          {/* Deep Dive Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart - Revenue */}
            <div className="lg:col-span-2 bg-janela-gray p-4 sm:p-6 rounded-lg shadow-lg border border-zinc-800">
              <RevenueChart current={metrics.revenue.current} target={metrics.revenue.target} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-black/50 p-4 rounded border-l-2 border-janela-yellow">
                    <span className="text-xs text-zinc-500 block mb-1">PROJEÇÃO</span>
                    <p className="text-sm text-zinc-300">
                      {gapRevenue > 0 
                        ? 'Necessário faturar a diferença restante nos próximos dias.' 
                        : 'Meta de faturamento superada.'}
                    </p>
                 </div>
                 <div className="bg-black/50 p-4 rounded border-l-2 border-zinc-700">
                    <span className="text-xs text-zinc-500 block mb-1">VOLUME DRINKS</span>
                    <p className="text-sm text-zinc-300">
                      Vendas em {(metrics.drinks.current / metrics.drinks.target * 100).toFixed(1)}% da meta.
                    </p>
                 </div>
              </div>
            </div>

            {/* Secondary Chart - Drink Share */}
            <div className="bg-janela-gray p-4 sm:p-6 rounded-lg shadow-lg border border-zinc-800 flex flex-col">
              <ShareChart currentShare={metrics.share.current} targetShare={metrics.share.target} />
              
              <div className="mt-auto pt-4 border-t border-zinc-800">
                 <div className="flex items-start gap-2 text-sm text-zinc-400">
                    <AlertTriangle className="w-4 h-4 text-janela-yellow mt-0.5 shrink-0" />
                    <p>
                       {metrics.share.current < metrics.share.target 
                         ? `Share de drinks abaixo de ${metrics.share.target}%. Incentivar vendas.`
                         : `Share de drinks acima da meta de ${metrics.share.target}%.`
                       }
                    </p>
                 </div>
              </div>
            </div>

          </div>
        </main>

        <footer className="text-center text-zinc-600 text-xs sm:text-sm mt-8 sm:mt-12 pb-4">
          <p>&copy; {new Date().getFullYear()} Janela Bar.</p>
        </footer>
      </div>

      <DataInputModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMetrics={metrics}
        onSave={setMetrics}
      />
    </>
  );
};

export default App;