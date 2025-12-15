import React, { useState } from 'react';
import { Plus, Trash2, Save, X, LayoutDashboard, Truck, MapPin, Edit3, Bot, ArrowLeft } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { Job, Task } from '../types';

export const DispatcherDashboard: React.FC<{ onSwitchToApp: () => void }> = ({ onSwitchToApp }) => {
  const { jobs, addJob, updateJob, deleteJob } = useJobs(); // aiEnabled removed from here
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'idle'>('idle');
  
  // Estado del formulario
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({
    site: '',
    location: '',
    date: new Date().toLocaleDateString('es-ES'),
    priority: 'normal',
    description: '',
    supervisorNote: '',
    aiContext: 'Análisis pendiente de generación...',
    materials: [],
    procedure: ['Llegada al sitio', 'Ejecución', 'Cierre'],
    tasks: []
  });

  const [tempMaterial, setTempMaterial] = useState('');
  const [tempProcedure, setTempProcedure] = useState('');

  // Resetear form
  const resetForm = () => {
      setCurrentJob({
        site: '',
        location: '',
        date: new Date().toLocaleDateString('es-ES'),
        priority: 'normal',
        description: '',
        supervisorNote: '',
        aiContext: 'Análisis pendiente...',
        materials: [],
        procedure: ['Llegada al sitio', 'Ejecución', 'Cierre'],
        tasks: []
      });
      setTempMaterial('');
      setTempProcedure('');
  };

  const handleCreateNew = () => {
      resetForm();
      setFormMode('create');
  };

  const handleEdit = (job: Job) => {
      setCurrentJob({ ...job });
      setFormMode('edit');
  };

  // Añadir Material
  const addMaterial = () => {
    if (tempMaterial.trim()) {
      setCurrentJob({ ...currentJob, materials: [...(currentJob.materials || []), tempMaterial] });
      setTempMaterial('');
    }
  };

  // Añadir Procedimiento
  const addProcedureStep = () => {
    if (tempProcedure.trim()) {
        setCurrentJob({ ...currentJob, procedure: [...(currentJob.procedure || []), tempProcedure] });
        setTempProcedure('');
    }
  }

  // Añadir Tarea Genérica
  const addTask = (type: 'measure' | 'photo' | 'checklist' | 'multi_measure') => {
    const taskId = `t${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let taskTitle = '';
    
    switch(type) {
        case 'measure': taskTitle = 'Medición Simple'; break;
        case 'multi_measure': taskTitle = 'Set 8 Medidas'; break;
        case 'photo': taskTitle = 'Evidencia'; break;
        case 'checklist': taskTitle = 'Inspección'; break;
    }

    const newTask: Task = {
      id: taskId,
      title: taskTitle,
      type,
      desc: 'Detalle técnico de la tarea...',
      options: type === 'checklist' ? ['Opción 1', 'Opción 2'] : undefined
    };
    setCurrentJob({ ...currentJob, tasks: [...(currentJob.tasks || []), newTask] });
  };

  const handleSave = () => {
    if (!currentJob.site || !currentJob.location) return alert('Faltan datos básicos (Sitio y Ubicación)');
    
    if (formMode === 'create') {
        const jobToSave: Job = {
            ...currentJob,
            id: Date.now(),
            materials: currentJob.materials || [],
            tasks: currentJob.tasks || [],
            procedure: currentJob.procedure || [],
        } as Job;
        addJob(jobToSave);
    } else if (formMode === 'edit' && currentJob.id) {
        updateJob(currentJob as Job);
    }

    setFormMode('idle');
    resetForm();
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if(confirm('¿Estás seguro de eliminar esta orden?')) {
          deleteJob(id);
          if (formMode === 'edit' && currentJob.id === id) {
              setFormMode('idle');
              resetForm();
          }
      }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
      {/* Navbar Backend - Responsive */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex flex-col md:flex-row justify-between items-center shadow-sm shrink-0 gap-3 md:gap-0 z-20">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
               <LayoutDashboard size={22}/>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-800 flex flex-col sm:flex-row sm:items-center leading-tight">
                Control de Ordenes
                <span className="sm:ml-2 text-[10px] font-medium text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full w-fit mt-1 sm:mt-0">ADMIN</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button 
              onClick={onSwitchToApp}
              className="bg-gray-900 hover:bg-black text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-gray-200 whitespace-nowrap"
            >
              <Truck size={16}/>
              <span className="hidden sm:inline">App Operador</span>
              <span className="sm:hidden">App</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex relative">
        
        {/* Sidebar Lista de Órdenes */}
        <div className={`
            flex-col h-full bg-white border-r border-gray-200 transition-all 
            w-full md:w-1/3 
            ${formMode !== 'idle' ? 'hidden md:flex' : 'flex'}
        `}>
          <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="font-bold text-gray-700">Órdenes ({jobs.length})</h2>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1 text-sm font-bold"
            >
              <Plus size={16}/> <span className="hidden xs:inline">Nueva</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {jobs.map(job => (
              <div 
                key={job.id} 
                onClick={() => handleEdit(job)}
                className={`p-4 rounded-xl border cursor-pointer transition-all group relative ${
                    currentJob.id === job.id && formMode === 'edit'
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 truncate pr-2 text-sm md:text-base">{job.site}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${job.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-600'}`}>
                    {job.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><MapPin size={10}/> <span className="truncate">{job.location}</span></p>
                <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-medium">{job.tasks.length} Tareas</span>
                    <button 
                        onClick={(e) => handleDelete(e, job.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No hay órdenes creadas.
                </div>
            )}
          </div>
        </div>

        {/* Panel Principal: Formulario */}
        <div className={`
            bg-[#FAFAFA] h-full flex-col relative 
            w-full md:w-2/3
            ${formMode === 'idle' ? 'hidden md:flex' : 'flex'}
        `}>
          {formMode !== 'idle' ? (
            <>
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-32 md:pb-28">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-8 animate-fadeIn">
                  
                  {/* Form Header */}
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setFormMode('idle')} 
                            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-800"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {formMode === 'create' ? <Plus className="text-blue-500" size={20}/> : <Edit3 className="text-orange-500" size={20}/>}
                            <span className="truncate">{formMode === 'create' ? 'Nueva Orden' : `Editando #${currentJob.id}`}</span>
                        </h2>
                    </div>
                    <button onClick={() => setFormMode('idle')} className="hidden md:block text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><X size={20}/></button>
                  </div>

                  <div className="space-y-6">
                    {/* Datos Básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente / Sitio</label>
                        <input 
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          placeholder="Ej: Nave Industrial B"
                          value={currentJob.site}
                          onChange={e => setCurrentJob({...currentJob, site: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ubicación</label>
                        <input 
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          placeholder="Dirección completa"
                          value={currentJob.location}
                          onChange={e => setCurrentJob({...currentJob, location: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridad</label>
                            <select 
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                                value={currentJob.priority}
                                onChange={e => setCurrentJob({...currentJob, priority: e.target.value as 'high' | 'normal'})}
                            >
                                <option value="normal">Normal</option>
                                <option value="high">Alta Prioridad</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                            <input 
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                                value={currentJob.date}
                                onChange={e => setCurrentJob({...currentJob, date: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Descripciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción del Trabajo</label>
                            <textarea 
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg h-32 text-sm"
                                placeholder="Detalles técnicos..."
                                value={currentJob.description}
                                onChange={e => setCurrentJob({...currentJob, description: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nota Supervisor (Contexto)</label>
                            <textarea 
                                className="w-full p-3 bg-blue-50 border border-blue-100 rounded-lg h-32 text-sm text-blue-900"
                                placeholder="Advertencias o notas especiales..."
                                value={currentJob.supervisorNote}
                                onChange={e => setCurrentJob({...currentJob, supervisorNote: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* AI Context Edit */}
                    <div>
                        <label className="block text-xs font-bold text-purple-600 uppercase mb-1">Simulación Contexto IA</label>
                        <textarea 
                                className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg h-20 text-sm text-purple-900"
                                placeholder="Información que proveería la IA..."
                                value={currentJob.aiContext}
                                onChange={e => setCurrentJob({...currentJob, aiContext: e.target.value})}
                            />
                    </div>

                    {/* Materiales */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Materiales Requeridos</label>
                        <div className="flex gap-2 mb-3">
                            <input 
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                placeholder="Ej: Taladro..."
                                value={tempMaterial}
                                onChange={e => setTempMaterial(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addMaterial()}
                            />
                            <button onClick={addMaterial} className="bg-gray-800 text-white px-4 rounded-lg font-bold text-xs uppercase tracking-wide">Añadir</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentJob.materials?.map((m, i) => (
                                <span key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-2 shadow-sm">
                                    {m} <button onClick={() => setCurrentJob({...currentJob, materials: currentJob.materials?.filter((_, idx) => idx !== i)})} className="hover:text-red-500"><X size={14}/></button>
                                </span>
                            ))}
                            {(!currentJob.materials || currentJob.materials.length === 0) && <span className="text-gray-400 text-xs italic">Sin materiales asignados</span>}
                        </div>
                    </div>

                    {/* Procedimiento */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pasos de Protocolo</label>
                        <div className="flex gap-2 mb-3">
                            <input 
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white"
                                placeholder="Ej: Verificar válvulas..."
                                value={tempProcedure}
                                onChange={e => setTempProcedure(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addProcedureStep()}
                            />
                            <button onClick={addProcedureStep} className="bg-gray-800 text-white px-4 rounded-lg font-bold text-xs uppercase tracking-wide">Añadir</button>
                        </div>
                        <ul className="space-y-2">
                            {currentJob.procedure?.map((step, i) => (
                                <li key={i} className="bg-white p-2 rounded-lg border border-gray-100 text-sm flex justify-between items-center group">
                                    <span className="flex gap-2">
                                        <span className="font-bold text-gray-300">{i+1}.</span> {step}
                                    </span>
                                    <button onClick={() => setCurrentJob({...currentJob, procedure: currentJob.procedure?.filter((_, idx) => idx !== i)})} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tareas */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Tareas Operativas ({currentJob.tasks?.length})</label>
                            <div className="flex gap-2 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
                                <button onClick={() => addTask('measure')} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 font-bold border border-purple-200">+ Medición</button>
                                <button onClick={() => addTask('multi_measure')} className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-md hover:bg-orange-200 font-bold border border-orange-200">+ 8 Medidas</button>
                                <button onClick={() => addTask('photo')} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 font-bold border border-blue-200">+ Foto</button>
                                <button onClick={() => addTask('checklist')} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 font-bold border border-green-200">+ Lista</button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {currentJob.tasks?.map((task, i) => (
                                <div key={i} className="bg-white p-4 border border-gray-200 rounded-xl flex gap-3 shadow-sm relative group">
                                    <div className={`w-1 self-stretch rounded-full ${
                                        task.type === 'measure' ? 'bg-purple-400' :
                                        task.type === 'multi_measure' ? 'bg-orange-400' :
                                        task.type === 'photo' ? 'bg-blue-400' : 'bg-green-400'
                                    }`}></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50 px-2 rounded-md">{task.type}</span>
                                        </div>
                                        <input 
                                            value={task.title} 
                                            placeholder="Título Tarea"
                                            onChange={(e) => {
                                                const updatedTasks = [...(currentJob.tasks || [])];
                                                updatedTasks[i].title = e.target.value;
                                                setCurrentJob({...currentJob, tasks: updatedTasks});
                                            }}
                                            className="font-bold text-gray-800 border-b border-transparent focus:border-blue-300 focus:bg-blue-50 p-1 w-full outline-none transition-colors"
                                        />
                                        <input 
                                            value={task.desc} 
                                            placeholder="Descripción técnica..."
                                            onChange={(e) => {
                                                const updatedTasks = [...(currentJob.tasks || [])];
                                                updatedTasks[i].desc = e.target.value;
                                                setCurrentJob({...currentJob, tasks: updatedTasks});
                                            }}
                                            className="text-xs text-gray-500 border-b border-transparent focus:border-blue-300 focus:bg-blue-50 p-1 w-full outline-none transition-colors"
                                        />
                                        {/* Opciones Checkbox */}
                                        {task.type === 'checklist' && (
                                            <div className="mt-2 pl-2 border-l-2 border-gray-100">
                                                <p className="text-[10px] text-gray-400 font-bold mb-1">OPCIONES (Separa con comas):</p>
                                                <input 
                                                    value={task.options?.join(', ')} 
                                                    onChange={(e) => {
                                                        const updatedTasks = [...(currentJob.tasks || [])];
                                                        updatedTasks[i].options = e.target.value.split(',').map(s => s.trim());
                                                        setCurrentJob({...currentJob, tasks: updatedTasks});
                                                    }}
                                                    className="text-xs w-full bg-gray-50 p-1 rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setCurrentJob({...currentJob, tasks: currentJob.tasks?.filter((_, idx) => idx !== i)})} 
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-2"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            ))}
                            {currentJob.tasks?.length === 0 && <p className="text-center text-gray-400 text-sm py-4 italic border-2 border-dashed border-gray-100 rounded-xl">No hay tareas definidas. Usa los botones de arriba para añadir.</p>}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer for Button */}
              <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] z-20 flex justify-center">
                 <div className="w-full max-w-3xl">
                    <button 
                        onClick={handleSave}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                            formMode === 'create' 
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                        }`}
                    >
                        <Save size={20}/>
                        {formMode === 'create' ? 'Publicar Orden' : 'Guardar Cambios'}
                    </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-fadeIn p-6">
               <div className="w-24 h-24 bg-white border border-gray-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                   <Edit3 size={40} className="text-gray-300"/>
               </div>
               <h3 className="text-xl font-bold text-gray-600 mb-2">Control de Gestión</h3>
               <p className="text-sm max-w-xs text-center leading-relaxed text-gray-400">
                   Selecciona una orden de la lista para editarla o crea una nueva tarea para el operador.
               </p>
               <button 
                  onClick={handleCreateNew}
                  className="mt-6 bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 font-bold text-sm shadow-sm hover:shadow-md transition-all"
               >
                   Crear Orden
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};