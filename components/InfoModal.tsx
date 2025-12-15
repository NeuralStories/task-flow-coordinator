import React from 'react';
import { X, Bot, ShieldCheck, Zap } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="w-full md:w-auto md:max-w-sm bg-[#F9FAFB] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col animate-slideUp" 
        onClick={e => e.stopPropagation()}
      >
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

        {/* Mobile Drag Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300/80 rounded-full md:hidden z-20"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm border border-gray-100 z-20 backdrop-blur-sm"
        >
          <X size={20} className="text-gray-400 hover:text-gray-600" />
        </button>

        <div className="p-8 pb-10 pt-12 relative z-10 flex flex-col">
            
            {/* Header Section */}
            <div className="mb-8">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-[#803746] mb-6 border border-gray-100">
                    <Bot size={40} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
                    Asistente Inteligente
                </h3>
                
                <p className="text-gray-500 text-base leading-relaxed">
                    El sistema está validando cada dato ingresado contra la base de datos de ingeniería y las normativas vigentes.
                </p>
            </div>

            {/* Status Cards */}
            <div className="space-y-4 mb-6">
                {/* Card 1: Servidor Seguro */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900">Servidor Seguro</p>
                        <p className="text-xs text-gray-500">Conexión cifrada establecida</p>
                    </div>
                </div>

                {/* Card 2: IA Activa */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                        <Bot size={24} />
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900">IA Activa</p>
                        <p className="text-xs text-gray-500">Revisión de anomalías activada</p>
                    </div>
                </div>
            </div>

            {/* Footer Data */}
            <div className="pt-6 border-t border-gray-200/60 text-center mt-auto">
                 <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">ID: OP-01 • v4.2.0 Stable</p>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slideUp {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};