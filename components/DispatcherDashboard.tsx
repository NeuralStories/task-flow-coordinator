import React, { useState } from 'react';
import { Plus, Trash2, Save, X, LayoutDashboard, Truck, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { Job, Task } from '../types';

export const DispatcherDashboard: React.FC<{ onSwitchToApp: () => void }> = ({ onSwitchToApp }) => {
  const { jobs, addJob, deleteJob } = useJobs();
  const [isCreating, setIsCreating] = useState(false);

  // Estado del formulario
  const [newJob, setNewJob] = useState<Partial<Job>>({
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
  
  // Añadir Material
  const addMaterial = () => {
    if (tempMaterial.trim() && newJob.materials) {
      setNewJob({ ...newJob, materials: [...newJob.materials, tempMaterial] });
      setTempMaterial('');
    }
  };

  // Añadir Tarea Genérica
  const addTask = (type: 'measure' | 'photo' | 'checklist') => {
    const taskId = `t${Date.now()}`;
    const taskTitle = type === 'measure' ? 'Medición' : type === 'photo' ? 'Evidencia' : 'Inspección';
    const newTask: Task = {
      id: taskId,
      title: taskTitle,
      type,
      desc: 'Detalle técnico de la tarea...',
      options: type === 'checklist' ? ['Opción 1', 'Opción 2'] : undefined
    };
    setNewJob({ ...newJob, tasks: [...(newJob.tasks || []), newTask] });
  };

  const handleSave = () => {
    if (!newJob.site || !newJob.location) return alert('Faltan datos básicos');
    
    const jobToSave: Job = {
      ...newJob,
      id: Date.now(),
      materials: newJob.materials || [],
      tasks: newJob.tasks || [],
      procedure: newJob.procedure || [],
    } as Job;

    addJob(jobToSave);
    setIsCreating(false);
    // Reset form
    setNewJob({
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
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans">
      {/* Navbar Backend */}
      <div className="bg-[#1a1f2c] text-white p-4 flex justify-between items-center shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={24} className="text-blue-400"/>
          <h1 className="text-lg font-bold tracking-wide">Central de Despacho <span className="text-xs opacity-50 font-normal border border-gray-600 px-2 py-0.5 rounded ml-2">ADMIN</span></h1>
        </div>
        <button 
          onClick={onSwitchToApp}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Truck size={16}/>
          Ir a App Operador
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar Lista de Órdenes */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Órdenes Activas ({jobs.length})</h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={20}/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all group relative">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800">{job.site}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${job.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {job.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><MapPin size={10}/> {job.location}</p>
                <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400">{job.tasks.length} Tareas</span>
                    <button 
                        onClick={() => deleteJob(job.id)}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Principal: Creación */}
        <div className="w-2/3 bg-gray-50 h-full overflow-y-auto p-8">
          {isCreating ? (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Nueva Orden de Trabajo</h2>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="space-y-6">
                {/* Datos Básicos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente / Sitio</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Ej: Nave Industrial B"
                      value={newJob.site}
                      onChange={e => setNewJob({...newJob, site: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ubicación</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Dirección completa"
                      value={newJob.location}
                      onChange={e => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridad</label>
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            value={newJob.priority}
                            onChange={e => setNewJob({...newJob, priority: e.target.value as 'high' | 'normal'})}
                        >
                            <option value="normal">Normal</option>
                            <option value="high">Alta Prioridad</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                        <input 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            value={newJob.date}
                            onChange={e => setNewJob({...newJob, date: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción del Trabajo</label>
                    <textarea 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-24"
                        placeholder="Detalles técnicos..."
                        value={newJob.description}
                        onChange={e => setNewJob({...newJob, description: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nota Supervisor (Contexto)</label>
                    <textarea 
                        className="w-full p-3 bg-blue-50 border border-blue-100 rounded-lg h-20 text-blue-900"
                        placeholder="Advertencias o notas especiales..."
                        value={newJob.supervisorNote}
                        onChange={e => setNewJob({...newJob, supervisorNote: e.target.value})}
                    />
                </div>

                {/* Materiales */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Materiales Requeridos</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                            placeholder="Ej: Taladro, Cable UTP..."
                            value={tempMaterial}
                            onChange={e => setTempMaterial(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addMaterial()}
                        />
                        <button onClick={addMaterial} className="bg-gray-800 text-white px-4 rounded-lg font-bold text-sm">Añadir</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {newJob.materials?.map((m, i) => (
                            <span key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-2">
                                {m} <button onClick={() => setNewJob({...newJob, materials: newJob.materials?.filter((_, idx) => idx !== i)})}><X size={14}/></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tareas */}
                <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Tareas Operativas ({newJob.tasks?.length})</label>
                        <div className="flex gap-2">
                            <button onClick={() => addTask('measure')} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 font-bold">+ Medición</button>
                            <button onClick={() => addTask('photo')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-bold">+ Foto</button>
                            <button onClick={() => addTask('checklist')} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-bold">+ Lista</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {newJob.tasks?.map((task, i) => (
                            <div key={i} className="bg-white p-3 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm">
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-gray-400 block">{task.type}</span>
                                    <input 
                                        value={task.title} 
                                        onChange={(e) => {
                                            const updatedTasks = [...(newJob.tasks || [])];
                                            updatedTasks[i].title = e.target.value;
                                            setNewJob({...newJob, tasks: updatedTasks});
                                        }}
                                        className="font-bold text-gray-800 border-none p-0 focus:ring-0 w-full"
                                    />
                                    <input 
                                        value={task.desc} 
                                        onChange={(e) => {
                                            const updatedTasks = [...(newJob.tasks || [])];
                                            updatedTasks[i].desc = e.target.value;
                                            setNewJob({...newJob, tasks: updatedTasks});
                                        }}
                                        className="text-xs text-gray-500 border-none p-0 focus:ring-0 w-full"
                                    />
                                </div>
                                <button onClick={() => setNewJob({...newJob, tasks: newJob.tasks?.filter((_, idx) => idx !== i)})} className="text-red-400"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        {newJob.tasks?.length === 0 && <p className="text-center text-gray-400 text-sm py-4 italic">No hay tareas definidas</p>}
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={handleSave}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                    >
                        <Save size={20}/>
                        Publicar Orden al Operador
                    </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                   <LayoutDashboard size={40} className="text-gray-400"/>
               </div>
               <h3 className="text-xl font-bold text-gray-500">Selecciona o crea una orden</h3>
               <p className="text-sm">Usa el botón "+" en la barra lateral</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};