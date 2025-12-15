import React from 'react';
import { ArrowLeft, MapPin, FileText, ClipboardList, Maximize, Bot, ArrowRight } from 'lucide-react';
import { Job } from '../types';

interface JobDetailProps {
  job: Job;
  onStart: () => void;
  onBack: () => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job, onStart, onBack }) => (
  <div className="flex flex-col h-full animate-fadeIn p-6 relative">
    {/* Header Navegación */}
    <div className="mb-6 flex items-center gap-2">
      <button onClick={onBack} className="p-3 -ml-3 hover:bg-gray-100 rounded-full transition-colors group">
        <ArrowLeft size={24} className="text-gray-400 group-hover:text-gray-800"/>
      </button>
      <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Volver a lista</span>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
      {/* Título Principal */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
          {job.site}
        </h1>
        <div className="flex items-start gap-3 text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <MapPin size={20} className="text-[#803746] shrink-0 mt-0.5"/>
          <div>
            <p className="text-base font-medium">{job.location}</p>
            <button className="text-xs text-[#803746] font-bold underline mt-2 py-1">Abrir en Mapa</button>
          </div>
        </div>
      </div>

      {/* Sección: Descripción y Procedimiento */}
      <div className="space-y-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            <FileText size={18} className="text-gray-400"/> Descripción
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {job.description}
          </p>
          
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <ClipboardList size={14}/> Protocolo Obligatorio
            </h4>
            <ul className="space-y-3">
              {job.procedure.map((step, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 text-gray-400">{i+1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sección: Contexto Crítico */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
            <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-2">
              <Maximize size={16}/> Nota del Supervisor
            </p>
            <p className="text-sm text-blue-900 italic leading-relaxed">"{job.supervisorNote}"</p>
          </div>
          
          <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
            <p className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-2">
              <Bot size={16}/> Análisis IA Previo
            </p>
            <p className="text-sm text-purple-900 leading-relaxed">{job.aiContext}</p>
          </div>
        </div>
      </div>
      
      {/* Preview de Pasos */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-4 opacity-80">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Secuencia de trabajo ({job.tasks.length} pasos)</p>
        <div className="flex gap-1.5">
          {job.tasks.map((t, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>

    {/* Botón Flotante Fijo */}
    <div className="absolute bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur border-t border-gray-100 z-10">
      <button 
        onClick={onStart}
        className="w-full py-4 bg-[#803746] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#803746]/20 hover:bg-[#602935] transition-all active:scale-95 flex items-center justify-center gap-3"
      >
        Iniciar Tareas <ArrowRight size={22} />
      </button>
    </div>
  </div>
);