export interface Task {
  id: string;
  title: string;
  type: 'measure' | 'checklist' | 'photo' | 'multi_measure';
  desc: string;
  requiredParams?: string[];
  options?: string[];
}

export interface Job {
  id: number;
  site: string;
  location: string;
  date: string;
  priority: 'high' | 'normal';
  description: string;
  supervisorNote: string;
  aiContext: string;
  materials: string[];
  procedure: string[];
  tasks: Task[];
}

export type ViewState = 'selection' | 'detail' | 'sequence' | 'completed';

export const THEME = {
  primary: '#803746',
  primaryLight: '#8037461a',
  bg: '#FAF5F6',
  white: '#ffffff',
  success: '#10B981',
  warning: '#F59E0B'
};

export const MY_JOBS_MOCK: Job[] = [
  {
      id: 101,
      site: 'Almacén Central',
      location: 'Polígono Ind. Sur, Nave 4',
      date: '14/12/2025',
      priority: 'high',
      description: 'Levantamiento técnico para nuevas estanterías industriales. Se requiere precisión milimétrica en los huecos de la zona de carga.',
      supervisorNote: 'Ojo con las tuberías traseras en la pared norte, no aparecen en los planos antiguos.',
      aiContext: 'Historial: Zona con desnivel de suelo del 2%. Calibrar distanciómetro.',
      materials: ['Distanciómetro Láser', 'Cinta Métrica 50m', 'Nivel Digital', 'Tablet con Planos'],
      procedure: [
          'Verificar EPP (Casco, Botas).',
          'Delimitar zona de trabajo con conos.',
          'Realizar mediciones en sentido horario.',
          'Sincronizar datos antes de salir.'
      ],
      tasks: [
          { id: 't1', title: 'Medición Hueco A', type: 'measure', desc: 'Primer hueco desde columna izq.', requiredParams: ['width', 'height', 'depth'] },
          { id: 't2', title: 'Inspección Zócalo', type: 'checklist', desc: 'Verificar estado del hormigón.', options: ['Intacto', 'Fisurado', 'Húmedo'] },
          { id: 't3', title: 'Foto Panorámica', type: 'photo', desc: 'Vista general del área despejada.' }
      ]
  },
  {
      id: 102,
      site: 'Oficinas Torre Norte',
      location: 'Av. Reforma 123, Piso 5',
      date: '14/12/2025',
      priority: 'normal',
      description: 'Revisión de mamparas divisorias para mantenimiento.',
      supervisorNote: 'Acceso por montacargas B. Solicitar llave en recepción.',
      aiContext: 'Material: Vidrio templado. Precaución en manejo.',
      materials: ['Kit de Herrajes Mampara', 'Ventosas para Vidrio', 'Destornillador Eléctrico', 'Limpiacristales'],
      procedure: [
          'Registrarse en recepción.',
          'Inspección visual de herrajes.',
          'Reportar roturas inmediatamente.'
      ],
      tasks: [
          { id: 't1', title: 'Revisión Herrajes', type: 'checklist', desc: 'Estado de las bisagras.', options: ['Ajustadas', 'Sueltas', 'Oxidadas'] },
          { id: 't2', title: 'Foto Daños', type: 'photo', desc: 'Foto detalle si hay roturas.' }
      ]
  }
];