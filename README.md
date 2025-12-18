# Task Flow Coordinator (Operador Field App)

![React](https://img.shields.io/badge/React-v19.0.0--rc-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-v6.2.0-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8.2-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

**Task Flow Coordinator** es una plataforma de orquestación de servicios de campo de alta fidelidad ("Field Service Orchestrator"). Diseñada para cerrar la brecha entre la planificación centralizada y la ejecución operativa, la aplicación proporciona una interfaz dual que permite la gestión de órdenes de trabajo complejas y su ejecución secuencial en campo mediante dispositivos móviles.

El sistema se destaca por su capacidad de **validación contextual**, guiando al operario paso a paso a través de procedimientos técnicos (mediciones, evidencias fotográficas, checklists) mientras mantiene una conexión simulada con sistemas de ingeniería y validación por IA.

---

## Arquitectura y Stack Tecnológico

El proyecto está construido sobre un stack moderno, priorizando el rendimiento y la seguridad de tipos (Type-Safety).

### Núcleo
* **Framework:** [React 19](https://react.dev/) (Release Candidate) - Utilizando las últimas características de concurrencia y renderizado.
* **Build System:** [Vite 6](https://vitejs.dev/) - Para un entorno de desarrollo ultrarrápido y Hot Module Replacement (HMR).
* **Lenguaje:** [TypeScript 5.8](https://www.typescriptlang.org/) - Tipado estricto para garantizar la integridad de los datos (`types.ts`).

### UI & UX
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Diseño "utility-first" con un sistema de diseño personalizado (Colores primarios: `#803746`).
* **Iconografía:** [Lucide React](https://lucide.dev/) - Iconos vectoriales consistentes y ligeros (`ShieldCheck`, `Bot`, `Settings`, etc.).
* **Responsive Design:** Enfoque "Mobile-First" para la vista del operador y "Desktop-Adaptive" para el panel de administración.

### Gestión de Estado
* **React Context API:** Implementado a través de `JobContext.tsx`. Gestiona el ciclo de vida completo de las órdenes de trabajo (`jobs`), permitiendo operaciones CRUD síncronas entre el Dashboard y la App del Operador sin necesidad de un backend externo para demostraciones.

---

## Funcionalidades Detalladas

La aplicación se divide en dos entornos operativos integrados en una misma SPA (Single Page Application):

### 1. App del Operador (Field Interface)
Optimizada para uso táctil en tablets y móviles.
* **Job Selection:** Visualización de tarjetas de trabajo con metadatos críticos (Sitio, Prioridad, Distancia).
* **Job Detail View:**
    * Acceso a notas de supervisión y contexto de IA (`aiContext`).
    * Listado de materiales requeridos pre-validación.
    * Procedimientos de seguridad (EPP).
* **Task Sequence Engine:** Motor de ejecución secuencial que impide avanzar sin completar el paso actual.
    * Soporte para tareas tipo `measure` (Input numérico/texto).
    * Soporte para tareas tipo `photo` (Simulación de captura).
    * Soporte para tareas tipo `checklist` (Selección de opciones).
* **Modo Offline Simulado:** Indicadores de estado de red y sincronización.

### 2. Dashboard del Despachador (Backend Admin)
Interfaz de escritorio para la gestión de flotas y tareas.
* **Gestión de Órdenes (CRUD):**
    * Creación dinámica de trabajos.
    * Asignación de prioridades (`High` vs `Normal`).
* **Constructor de Tareas (Task Builder):** Permite al despachador definir dinámicamente qué debe hacer el operador:
    * *+ Medición:* Pide datos técnicos.
    * *+ Foto:* Solicita evidencia visual.
    * *+ Lista:* Crea puntos de inspección.
* **Inventario de Materiales:** Adición de herramientas y consumibles necesarios para la orden.

---

## Estructura del Proyecto

El código fuente se organiza siguiendo patrones de diseño modular:

```bash
src/
├── components/
│   ├── DispatcherDashboard.tsx # Panel Administrativo (Creación de tareas)
│   ├── JobSelection.tsx        # Vista de lista de trabajos (Operador)
│   ├── JobDetail.tsx           # Vista de detalle y aceptación (Operador)
│   ├── TaskSequence.tsx        # Motor de ejecución de tareas paso a paso
│   ├── JobComplete.tsx         # Pantalla de éxito/finalización
│   ├── InfoModal.tsx           # Modal de ayuda contextual
│   └── ...
├── context/
│   └── JobContext.tsx          # Store global (Estado de trabajos y acciones)
├── types.ts                    # Definiciones de Tipos (Job, Task, ViewState)
├── App.tsx                     # Enrutador principal y Layout responsive
└── main.tsx                    # Punto de entrada de la aplicación
