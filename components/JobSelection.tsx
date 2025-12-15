import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Wrench, CheckCircle, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Job } from '../types';
import { useJobs } from '../context/JobContext';

interface JobSelectionProps {
  onSelectJob: (job: Job) => void;
}

export const JobSelection: React.FC<JobSelectionProps> = ({ onSelectJob }) => {
  const { jobs } = useJobs();
  const [toolsChecked, setToolsChecked] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  // Agrupar todos los materiales necesarios para el día (Ahora dinámico desde Context)
  const allMaterials = Array.from(new Set(jobs.flatMap(job => job.materials)));

  return (
    <div className="flex flex-col h-full w-full animate-fadeIn p-6">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          Hola, Operador
        </h1>
        <p className="text-gray-500 text-base">
          Tienes <span className="font-bold text-[#803746]">{jobs.length} tareas asignadas</span> para hoy.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 md:pb-4 space-y-6 min-h-0">
        
        {/* SECCIÓN: RESUMEN DE CARGA Y EQUIPO */}
        <div className="space-y-4">
          {/* Acordeón de Materiales */}
          <button 
            onClick={() => setShowMaterials(!showMaterials)}
            className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">Resumen de Carga</p>
                <p className="text-xs text-gray-500">{allMaterials.length} items necesarios para hoy</p>
              </div>
            </div>
            {showMaterials ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
          </button>
          
          {showMaterials && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fadeIn">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Material Requerido en Vehículo:</h4>
              <ul className="grid grid-cols-1 gap-2">
                {allMaterials.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100">
                    <div className="w-1.5 h-1.5 bg-[#803746] rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tarjeta de Verificación (Icono Centrado) */}
          <div className={`p-6 rounded-2xl border transition-all duration-500 ${
            toolsChecked 
              ? 'bg-green-50 border-green-200 shadow-sm' 
              : 'bg-orange-50 border-orange-100 shadow-sm'
          }`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`p-5 rounded-full shrink-0 transition-colors duration-500 flex items-center justify-center shadow-sm ${
                toolsChecked ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {toolsChecked ? <CheckCircle size={32} /> : <Wrench size={32} />}
              </div>
              <div className="w-full">
                <h3 className={`font-bold text-lg mb-1 ${
                  toolsChecked ? 'text-green-800' : 'text-orange-900'
                }`}>
                  {toolsChecked ? 'Carga Verificada' : 'Revisión de Equipo'}
                </h3>
                <p className={`text-sm mb-5 leading-relaxed max-w-xs mx-auto ${
                  toolsChecked ? 'text-green-700' : 'text-orange-800'
                }`}>
                  {toolsChecked 
                    ? 'Has confirmado la carga. Tareas desbloqueadas.' 
                    : 'Revisa el "Resumen de Carga" y confirma que tienes todo antes de salir.'}
                </p>
                
                {!toolsChecked && (
                  <button 
                    onClick={() => setToolsChecked(true)}
                    className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all"
                  >
                    Confirmar Carga
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE TAREAS (Dinámica) */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest pl-1 mt-2">
            Asignaciones ({jobs.length})
          </h3>
          {jobs.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400 text-sm">No hay órdenes asignadas por el despacho.</p>
            </div>
          )}
          {jobs.map((job) => (
            <button 
              key={job.id}
              onClick={() => onSelectJob(job)}
              disabled={!toolsChecked}
              className={`w-full bg-white p-6 rounded-2xl border shadow-sm transition-all text-left group relative overflow-hidden active:scale-[0.98] ${
                toolsChecked 
                  ? 'border-gray-100 hover:shadow-md hover:border-[#803746]/30 opacity-100 cursor-pointer' 
                  : 'border-gray-100 opacity-60 cursor-not-allowed grayscale-[0.5]'
              }`}
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${job.priority === 'high' ? 'bg-[#803746]' : 'bg-gray-300'}`}></div>
              
              <div className="flex justify-between items-start mb-3 pl-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                    <Calendar size={12} /> {job.date}
                  </span>
                  <h3 className="font-bold text-gray-800 text-xl leading-tight">{job.site}</h3>
                </div>
                {job.priority === 'high' && (
                  <span className="bg-red-50 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full border border-red-100">
                    PRIORITARIO
                  </span>
                )}
              </div>
              
              <div className="pl-3 flex items-center gap-2 text-sm text-gray-500 mb-5">
                <MapPin size={16} className="shrink-0 text-[#803746]"/>
                <span className="truncate">{job.location}</span>
              </div>

              <div className="pl-3 flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  {job.tasks.length} pasos técnicos
                </span>
                <span className="text-[#803746] text-sm font-bold group-hover:underline flex items-center gap-1">
                  Ver Detalles <ArrowRight size={16}/>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};