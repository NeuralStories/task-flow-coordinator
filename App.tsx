import React, { useState } from 'react';
import { ShieldCheck, Info, Bot, Settings, LayoutDashboard } from 'lucide-react';
import { JobSelection } from './components/JobSelection';
import { JobDetail } from './components/JobDetail';
import { TaskSequence } from './components/TaskSequence';
import { JobComplete } from './components/JobComplete';
import { InfoModal } from './components/InfoModal';
import { DispatcherDashboard } from './components/DispatcherDashboard';
import { JobProvider } from './context/JobContext';
import { Job, ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState | 'admin'>('selection');
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleSelectJob = (job: Job) => {
    setActiveJob(job);
    setView('detail');
  };

  const handleBackToSelection = () => {
    setActiveJob(null);
    setView('selection');
  };

  // Wrapper principal para proveer el contexto
  return (
    <JobProvider>
      {view === 'admin' ? (
        <DispatcherDashboard onSwitchToApp={() => setView('selection')} />
      ) : (
        <div className="h-[100dvh] w-full bg-[#FAF5F6] flex items-center justify-center font-sans md:p-8 overflow-hidden">
          
          {/* Contenedor Principal */}
          <div className="bg-white w-full h-full md:max-w-md lg:max-w-5xl md:h-[850px] md:rounded-[2rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Lado Izquierdo (Móvil: Interfaz Principal) */}
            <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col relative z-10 bg-white h-full max-h-full">
                
                {/* Header Móvil y Desktop (Lado Izquierdo) */}
                <div className="h-16 bg-[#803746] text-white flex items-center justify-between px-4 sm:px-6 shadow-md shrink-0 z-30 relative">
                    <span className="font-bold text-sm tracking-wide flex items-center gap-2">
                        <ShieldCheck size={20} className="text-white"/> 
                        <span className="truncate">OPERADOR APP</span>
                    </span>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs opacity-90 bg-black/20 px-2 sm:px-3 py-1 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                            <span className="hidden xs:inline font-medium">Online</span>
                        </div>
                        
                        {/* Botón de Info (Solo móvil) */}
                        <button 
                          onClick={() => setIsInfoOpen(true)} 
                          className="md:hidden p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors active:scale-95"
                          aria-label="Información"
                        >
                          <Info size={18} />
                        </button>

                        {/* Admin Button - High Visibility */}
                        <button 
                            onClick={() => setView('admin')}
                            className="flex items-center gap-2 p-2 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-all active:scale-95 border border-white/10 shadow-sm"
                            title="Ir al Backend (Admin)"
                            aria-label="Administrador"
                        >
                            <Settings size={18} />
                            <span className="hidden sm:inline text-xs font-bold">ADMIN</span>
                        </button>
                    </div>
                </div>

                {/* Vistas Dinámicas - min-h-0 is crucial for nested flex scrolling */}
                <div className="flex-1 overflow-hidden relative min-h-0 flex flex-col bg-[#FAF5F6]">
                    {view === 'selection' && <JobSelection onSelectJob={handleSelectJob} />}
                    {view === 'detail' && activeJob && <JobDetail job={activeJob} onStart={() => setView('sequence')} onBack={handleBackToSelection} />}
                    {view === 'sequence' && activeJob && <TaskSequence job={activeJob} onBack={() => setView('detail')} onCompleteAll={() => setView('completed')} />}
                    {view === 'completed' && <JobComplete onReset={handleBackToSelection} />}
                </div>
            </div>

            {/* Lado Derecho (Desktop Only - Contexto) */}
            <div className="hidden md:flex w-full md:w-1/2 lg:w-[40%] bg-[#F9FAFB] relative border-l border-gray-100 flex-col h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                
                {/* Botón Admin Desktop (Redundante pero útil) */}
                <div className="absolute top-6 right-6 z-50">
                     <button 
                        onClick={() => setView('admin')}
                        className="bg-white/80 backdrop-blur border border-gray-200 text-gray-500 hover:text-[#803746] hover:border-[#803746]/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <LayoutDashboard size={16} /> PANEL ADMIN
                    </button>
                </div>

                <div className="flex-1 p-12 flex flex-col justify-center relative z-10">
                    
                    {/* Header Icon & Title */}
                    <div className="mb-12 animate-fadeIn">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#803746] mb-8 border border-gray-100">
                            <Bot size={48} strokeWidth={1.5}/>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                            Asistente <br/>Inteligente
                        </h2>
                        <p className="text-gray-500 leading-relaxed text-lg max-w-sm">
                            El sistema está validando cada dato ingresado contra la base de datos de ingeniería y las normativas vigentes.
                        </p>
                    </div>

                    {/* Status Cards */}
                    <div className="space-y-4 max-w-sm">
                        {/* Card 1 */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transform transition-all hover:scale-[1.02] duration-300 hover:shadow-md cursor-default">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">Servidor Seguro</p>
                                <p className="text-sm text-gray-500">Conexión cifrada establecida</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transform transition-all hover:scale-[1.02] duration-300 hover:shadow-md cursor-default">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                <Bot size={28} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">IA Activa</p>
                                <p className="text-sm text-gray-500">Revisión de anomalías activada</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-200/50 text-center bg-white/30 backdrop-blur-sm">
                    <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase opacity-60">ID: OP-01 • v4.2.0 Stable</p>
                </div>
            </div>

            {/* Info Modal para Mobile */}
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} view={view} />

          </div>
        </div>
      )}
    </JobProvider>
  );
}