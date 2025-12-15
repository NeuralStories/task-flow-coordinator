import React from 'react';
import { Check } from 'lucide-react';

interface JobCompleteProps {
  onReset: () => void;
}

export const JobComplete: React.FC<JobCompleteProps> = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center h-full animate-fadeIn text-center p-8">
    <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-sm">
      <Check size={56} />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Labor Finalizada!</h2>
    <p className="text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed text-base">
      El informe ha sido generado, validado por IA y enviado a supervisión correctamente.
    </p>
    <button 
      onClick={onReset}
      className="w-full max-w-sm bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 text-lg shadow-xl"
    >
      Volver a Mis Tareas
    </button>
  </div>
);