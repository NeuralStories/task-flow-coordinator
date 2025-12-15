import React, { useState, useEffect, useRef } from 'react';
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
  PauseCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Job } from '../types';
import { ProgressBar } from './ProgressBar';
import { useJobs } from '../context/JobContext';

interface TaskSequenceProps {
  job: Job;
  onBack: () => void;
  onCompleteAll: () => void;
}

export const TaskSequence: React.FC<TaskSequenceProps> = ({ job, onBack, onCompleteAll }) => {
  const { aiEnabled } = useJobs();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State for different input types
  const [currentData, setCurrentData] = useState<{ 
      width: string; height: string; depth: string; selection: string; photo: string | null;
      multiMeasures: string[]; 
  }>({ 
      width: '', height: '', depth: '', selection: '', photo: null, multiMeasures: Array(8).fill('') 
  });

  const [status, setStatus] = useState<'idle' | 'uploading_photo' | 'validating' | 'valid' | 'pending_manual' | 'error'>('idle');
  const [aiFeedback, setAiFeedback] = useState('');
  
  // Camera Refs and State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const currentTask = job.tasks[currentIndex];
  const isLast = currentIndex === job.tasks.length - 1;

  useEffect(() => {
    // Reset state when task changes
    setCurrentData({ width: '', height: '', depth: '', selection: '', photo: null, multiMeasures: Array(8).fill('') });
    setStatus('idle');
    setAiFeedback('');
    stopCamera();
  }, [currentIndex]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      // Wait for React to render the video element
      setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara. Verifique los permisos.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCurrentData(prev => ({ ...prev, photo: dataUrl }));
            stopCamera();
        }
    }
  };

  const handleMultiMeasureChange = (index: number, value: string) => {
      const newMeasures = [...currentData.multiMeasures];
      newMeasures[index] = value;
      setCurrentData({...currentData, multiMeasures: newMeasures});
  };

  const handleNext = () => {
    // Logic to proceed if valid OR pending manual validation
    if (status === 'valid' || status === 'pending_manual') {
      if (isLast) {
        onCompleteAll();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      return;
    }

    // Local Validation logic
    if (currentTask.type === 'measure' && (!currentData.width || !currentData.height)) {
        setStatus('error');
        setAiFeedback('Error: Faltan dimensiones obligatorias.');
        return;
    }
    if (currentTask.type === 'multi_measure') {
        if (currentData.multiMeasures.some(m => m === '')) {
            setStatus('error');
            setAiFeedback('Error: Faltan medidas por registrar (8 requeridas).');
            return;
        }
    }
    if (currentTask.type === 'photo' && !currentData.photo) {
        setStatus('error');
        setAiFeedback('Error: Debes adjuntar la evidencia fotográfica.');
        return;
    }

    // AI TOGGLE LOGIC
    if (!aiEnabled) {
        // If AI is disabled, skip simulation/validation time
        setStatus('valid'); // Or 'pending_manual' if you prefer everything to be manual. 'valid' means instant approve in this context.
        setAiFeedback(''); 
        return; 
    }

    // If AI Enabled, start simulation
    setStatus('validating');
    
    // Simulate Server + AI validation
    setTimeout(() => {
        // Change: Instead of auto-validating, we set it to 'pending_manual'
        setStatus('pending_manual');
        setAiFeedback('Datos registrados correctamente. Pendiente de validación manual por supervisión.');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn p-6 bg-[#FAF5F6] relative">
      
      {/* Hidden Canvas for Camera Capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Camera Overlay */}
      {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6">
              <div className="flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg">Cámara</h3>
                  <button onClick={stopCamera} className="p-2 bg-white/10 rounded-full">
                      <XCircle size={28} />
                  </button>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden my-4 bg-black rounded-2xl relative">
                  <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                  ></video>
              </div>
              <div className="flex justify-center pb-6">
                  <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                  >
                      <div className="w-16 h-16 bg-white border-2 border-black rounded-full"></div>
                  </button>
              </div>
          </div>
      )}

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
          
          {/* TIPO: MEDICIÓN SIMPLE */}
          {currentTask.type === 'measure' && (
            <div className="grid grid-cols-1 gap-6">
              {['Ancho', 'Alto', 'Profundo'].map((label, idx) => {
                const key = ['width', 'height', 'depth'][idx] as 'width' | 'height' | 'depth';
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label} (cm)</label>
                    <input 
                      type="number"
                      disabled={status === 'valid' || status === 'pending_manual'}
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

           {/* TIPO: 8 MEDIDAS (MULTI-MEASURE) */}
           {currentTask.type === 'multi_measure' && (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="space-y-1">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Medida #{idx + 1}</label>
                             <input 
                                type="number"
                                disabled={status === 'valid' || status === 'pending_manual'}
                                value={currentData.multiMeasures[idx]}
                                onChange={e => handleMultiMeasureChange(idx, e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-mono text-gray-900 outline-none focus:ring-2 focus:ring-[#803746] text-center"
                                placeholder="0.0"
                             />
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* TIPO: CHECKLIST */}
          {currentTask.type === 'checklist' && currentTask.options && (
            <div className="space-y-4">
              {currentTask.options.map(opt => (
                <button
                  key={opt}
                  disabled={status === 'valid' || status === 'pending_manual'}
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
                    <p className="text-gray-500 font-bold text-sm">Procesando imagen...</p>
                  </div>
                ) : (
                  <button 
                    onClick={startCamera}
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

                  {status !== 'valid' && status !== 'pending_manual' && (
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
          {status === 'validating' && aiEnabled && (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl gap-3 animate-fadeIn">
              <Loader2 className="animate-spin text-[#803746]" size={24}/>
              <span className="text-sm font-bold text-gray-500">Analizando datos con Servidor IA...</span>
            </div>
          )}

          {/* Estado Aprobado (Green) */}
          {status === 'valid' && (
            <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex gap-4 animate-fadeIn">
              <div className="bg-green-100 p-2.5 h-fit rounded-full text-green-600 shadow-sm">
                <ShieldCheck size={24}/>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">
                    {aiEnabled ? "Validado Automáticamente" : "Dato Registrado"}
                </p>
                {aiEnabled && <p className="text-xs text-green-700 mt-1 leading-relaxed">{aiFeedback}</p>}
              </div>
            </div>
          )}

           {/* Estado Pendiente Manual (Yellow/Orange) */}
           {status === 'pending_manual' && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-4 animate-fadeIn">
              <div className="bg-amber-100 p-2.5 h-fit rounded-full text-amber-700 shadow-sm">
                <Clock size={24}/>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Espera de Validación Manual</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">{aiFeedback}</p>
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

        {/* Info Contextual IA - Sólo si AI Enabled */}
        {aiEnabled && (
            <div className="mt-6 p-6 bg-white rounded-[20px] shadow-sm flex flex-col gap-3 animate-fadeIn border border-gray-100">
            <div className="flex items-center gap-2.5 text-purple-700">
                <Bot size={20} className="shrink-0"/>
                <span className="text-xs font-bold uppercase tracking-wide">Sugerencia IA en Tiempo Real</span>
            </div>
            <p className="text-base text-gray-800 italic leading-relaxed pl-1">
                "Recuerda que para <span className="text-gray-900 not-italic font-bold">{currentTask.title}</span>, el margen de error permitido es +/- 2mm. Asegúrate de limpiar la superficie antes de medir."
            </p>
            </div>
        )}
      </div>

      {/* Botón de Acción Fixed Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-[#FAF5F6]/90 backdrop-blur z-10">
        <button 
          onClick={handleNext}
          disabled={status === 'validating' || status === 'uploading_photo'}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
            status === 'valid' 
            ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700' 
            : status === 'pending_manual'
            ? 'bg-amber-600 text-white shadow-amber-200 hover:bg-amber-700'
            : 'bg-[#803746] text-white shadow-[#803746]/20 hover:bg-[#602935] disabled:opacity-50 disabled:shadow-none'
          }`}
        >
          {status === 'valid' || status === 'pending_manual'
            ? (isLast ? 'Finalizar Todo' : 'Siguiente Paso') 
            : (status === 'validating' || status === 'uploading_photo' 
                ? 'Procesando...' 
                : (aiEnabled ? 'Enviar para Validación' : 'Registrar Dato')
              )
          }
          {(status === 'valid' || status === 'pending_manual') && <ArrowRight size={22} />}
        </button>
      </div>
    </div>
  );
};