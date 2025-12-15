import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  Camera, 
  UploadCloud, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Bot, 
  ArrowRight,
  PauseCircle
} from 'lucide-react';
import { Job } from '../types';
import { ProgressBar } from './ProgressBar';

interface TaskSequenceProps {
  job: Job;
  onBack: () => void;
  onCompleteAll: () => void;
}

export const TaskSequence: React.FC<TaskSequenceProps> = ({ job, onBack, onCompleteAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentData, setCurrentData] = useState<{ 
      width: string; height: string; depth: string; selection: string; photo: string | null; 
  }>({ 
      width: '', height: '', depth: '', selection: '', photo: null 
  });
  const [status, setStatus] = useState<'idle' | 'uploading_photo' | 'validating' | 'valid' | 'error'>('idle');
  const [aiFeedback, setAiFeedback] = useState('');

  const currentTask = job.tasks[currentIndex];
  const isLast = currentIndex === job.tasks.length - 1;

  useEffect(() => {
    setCurrentData({ width: '', height: '', depth: '', selection: '', photo: null });
    setStatus('idle');
    setAiFeedback('');
  }, [currentIndex]);

  const handleTakePhoto = () => {
    setStatus('uploading_photo');
    // Simulate photo upload
    setTimeout(() => {
      setCurrentData(prev => ({
        ...prev, 
        photo: "https://picsum.photos/400/300"
      }));
      setStatus('idle');
    }, 1500);
  };

  const handleNext = () => {
    if (status !== 'valid') {
      // Local validation
      if (currentTask.type === 'measure' && (!currentData.width || !currentData.height)) {
        setStatus('error');
        setAiFeedback('Error: Faltan dimensiones obligatorias.');
        return;
      }
      if (currentTask.type === 'photo' && !currentData.photo) {
        setStatus('error');
        setAiFeedback('Error: Debes adjuntar la evidencia fotográfica.');
        return;
      }

      setStatus('validating');
      // Simulate Server + AI validation
      setTimeout(() => {
        setStatus('valid');
        setAiFeedback('Datos recibidos y validados por IA Server (v2.4).');
      }, 1500);
    } else {
      if (isLast) {
        onCompleteAll();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn p-6 bg-[#FAF5F6] relative">
      {/* Header: Progreso + Info */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Paso {currentIndex + 1} de {job.tasks.length}
          </span>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-[#803746] transition-colors"
          >
            <PauseCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">Pausar</span>
          </button>
        </div>
        <ProgressBar current={currentIndex + 1} total={job.tasks.length + 1} />
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2 leading-tight">{currentTask.title}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{currentTask.desc}</p>
      </div>

      {/* Panel Central: Formulario Activo */}
      <div className="flex-1 overflow-y-auto mb-20 custom-scrollbar pb-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-8">
          
          {/* TIPO: MEDICIÓN */}
          {currentTask.type === 'measure' && (
            <div className="grid grid-cols-1 gap-6">
              {['Ancho', 'Alto', 'Profundo'].map((label, idx) => {
                const key = ['width', 'height', 'depth'][idx] as 'width' | 'height' | 'depth';
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label} (cm)</label>
                    <input 
                      type="number"
                      disabled={status === 'valid'}
                      value={currentData[key]}
                      onChange={e => setCurrentData({...currentData, [key]: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-mono text-gray-900 outline-none focus:ring-2 focus:ring-[#803746] transition-all"
                      placeholder="0.00"
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* TIPO: CHECKLIST */}
          {currentTask.type === 'checklist' && currentTask.options && (
            <div className="space-y-4">
              {currentTask.options.map(opt => (
                <button
                  key={opt}
                  disabled={status === 'valid'}
                  onClick={() => setCurrentData({...currentData, selection: opt})}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex justify-between items-center ${
                    currentData.selection === opt 
                    ? 'bg-[#803746]/5 border-[#803746] text-[#803746] font-bold shadow-sm' 
                    : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                  {currentData.selection === opt && <Check size={20}/>}
                </button>
              ))}
            </div>
          )}

          {/* TIPO: FOTO */}
          {currentTask.type === 'photo' && (
            <div className="space-y-4">
              {!currentData.photo ? (
                status === 'uploading_photo' ? (
                  <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 animate-pulse">
                    <Loader2 size={40} className="text-[#803746] animate-spin mb-3"/>
                    <p className="text-gray-500 font-bold text-sm">Subiendo evidencia al servidor...</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleTakePhoto}
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-[#803746] hover:text-[#803746] transition-all gap-4 group bg-white active:scale-[0.98]"
                  >
                    <div className="bg-gray-100 p-5 rounded-full group-hover:bg-[#803746]/10 transition-colors">
                      <Camera size={40} className="opacity-60 group-hover:opacity-100 transition-opacity"/>
                    </div>
                    <div className="text-center">
                      <span className="block font-bold text-sm uppercase tracking-wide mb-1">Abrir Cámara</span>
                      <span className="text-xs text-gray-400 font-normal group-hover:text-[#803746]/60">Tomar foto y adjuntar</span>
                    </div>
                  </button>
                )
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md group">
                  <img src={currentData.photo} alt="Evidencia" className="w-full h-64 object-cover" />
                  
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <UploadCloud size={12} /> Adjuntado
                  </div>

                  {status !== 'valid' && (
                    <button 
                      onClick={() => setCurrentData({...currentData, photo: null})}
                      className="absolute bottom-3 right-3 bg-white text-red-500 p-2.5 rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Feedback Estado de Validación */}
          {status === 'validating' && (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl gap-3 animate-fadeIn">
              <Loader2 className="animate-spin text-[#803746]" size={24}/>
              <span className="text-sm font-bold text-gray-500">Analizando datos con Servidor IA...</span>
            </div>
          )}

          {status === 'valid' && (
            <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex gap-4 animate-fadeIn">
              <div className="bg-green-100 p-2.5 h-fit rounded-full text-green-600 shadow-sm">
                <ShieldCheck size={24}/>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Validado Correctamente</p>
                <p className="text-xs text-green-700 mt-1 leading-relaxed">{aiFeedback}</p>
              </div>
            </div>
          )}
            
            {/* Feedback Error */}
            {status === 'error' && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex gap-4 animate-fadeIn">
              <div className="bg-red-100 p-2.5 h-fit rounded-full text-red-600 shadow-sm">
                <AlertCircle size={24}/>
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Atención Requerida</p>
                <p className="text-xs text-red-700 mt-1 leading-relaxed">{aiFeedback}</p>
              </div>
            </div>
          )}

        </div>

        {/* Info Contextual IA - Visibilidad Mejorada */}
        <div className="mt-6 p-6 bg-white rounded-[20px] shadow-sm flex flex-col gap-3 animate-fadeIn border border-gray-100">
          <div className="flex items-center gap-2.5 text-purple-700">
            <Bot size={20} className="shrink-0"/>
            <span className="text-xs font-bold uppercase tracking-wide">Sugerencia IA en Tiempo Real</span>
          </div>
          <p className="text-base text-gray-800 italic leading-relaxed pl-1">
            "Recuerda que para <span className="text-gray-900 not-italic font-bold">{currentTask.title}</span>, el margen de error permitido es +/- 2mm. Asegúrate de limpiar la superficie antes de medir."
          </p>
        </div>
      </div>

      {/* Botón de Acción Fixed Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-[#FAF5F6]/90 backdrop-blur z-10">
        <button 
          onClick={handleNext}
          disabled={status === 'validating' || status === 'uploading_photo'}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
            status === 'valid' 
            ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700' 
            : 'bg-[#803746] text-white shadow-[#803746]/20 hover:bg-[#602935] disabled:opacity-50 disabled:shadow-none'
          }`}
        >
          {status === 'valid' 
            ? (isLast ? 'Finalizar Todo' : 'Siguiente Paso') 
            : (status === 'validating' || status === 'uploading_photo' ? 'Procesando...' : 'Validar y Continuar')
          }
          {status === 'valid' && <ArrowRight size={22} />}
        </button>
      </div>
    </div>
  );
};