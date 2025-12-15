import React, { useState } from 'react';
import { ShieldCheck, Info, Bot, Settings } from 'lucide-react';
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
        <div className="h-[100dvh] bg-[#FAF5F6] flex items-center justify-center font-sans md:p-8 overflow-hidden">
          
          {/* Contenedor Principal */}
          <div className="bg-white w-full h-full md:max-w-md lg:max-w-5xl md:h-[850px] md:rounded-[2rem] shadow-none md:shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Lado Izquierdo (Móvil: Interfaz Principal) */}
            <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col relative z-10 bg-white h-full max-h-full">
                
                {/* Header Móvil */}
                <div className="h-16 bg-[#803746] text-white flex items-center justify-between px-6 shadow-md shrink-0 z-20">
                    <span className="font-bold text-sm tracking-wide flex items-center gap-2">
                        <ShieldCheck size={18}/> OPERADOR APP
                    </span>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs opacity-80 bg-white/10 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="hidden xs:inline">Online</span>
                        </div>
                        {/* Botón de Info (Solo móvil) */}
                        <button 
                          onClick={() => setIsInfoOpen(true)} 
                          className="md:hidden p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Info size={18} />
                        </button>
                        {/* Admin Button - Made visible */}
                        <button 
                            onClick={() => setView('admin')}
                            className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors"
                            title="Ir al Backend (Admin)"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Vistas Dinámicas - min-h-0 is crucial for nested flex scrolling */}
                <div className="flex-1 overflow-hidden relative min-h-0 flex flex-col">
                    {view === 'selection' && <JobSelection onSelectJob={handleSelectJob} />}
                    {view === 'detail' && activeJob && <JobDetail job={activeJob} onStart={() => setView('sequence')} onBack={handleBackToSelection} />}
                    {view === 'sequence' && activeJob && <TaskSequence job={activeJob} onBack={() => setView('detail')} onCompleteAll={() => setView('completed')} />}
                    {view === 'completed' && <JobComplete onReset={handleBackToSelection} />}
                </div>
            </div>

            {/* Lado Derecho (Desktop Only - Contexto - Replicando Screenshot 2) */}
            <div className="hidden md:flex w-full md:w-1/2 lg:w-[40%] bg-[#F9FAFB] relative border-l border-gray-100 flex-col h-full">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                
                {/* Botón Admin Desktop */}
                <div className="absolute top-4 right-4 z-50">
                     <button 
                        onClick={() => setView('admin')}
                        className="bg-white border border-gray-200 text-gray-400 hover:text-[#803746] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                        <Settings size={14} /> BACKEND ADMIN
                    </button>
                </div>

                <div className="flex-1 p-12 flex flex-col justify-center relative z-10">
                    
                    {/* Header Icon & Title */}
                    <div className="mb-12">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-[#803746] mb-8 border border-gray-100">
                            <Bot size={48} strokeWidth={1.5}/>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            Asistente Inteligente
                        </h2>
                        <p className="text-gray-500 leading-relaxed text-lg">
                            El sistema está validando cada dato ingresado contra la base de datos de ingeniería y las normativas vigentes.
                        </p>
                    </div>

                    {/* Status Cards */}
                    <div className="space-y-5">
                        {/* Card 1 */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transform transition-all hover:scale-[1.02] duration-300">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">Servidor Seguro</p>
                                <p className="text-sm text-gray-500">Conexión cifrada establecida</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transform transition-all hover:scale-[1.02] duration-300">
                            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                                <Bot size={28} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">IA Activa</p>
                                <p className="text-sm text-gray-500">Revisión de anomalías activada</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-200/50 text-center">
                    <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">ID: OP-01 • v4.2.0 Stable</p>
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