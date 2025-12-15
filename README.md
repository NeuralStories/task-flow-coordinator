# Operador Field App - Task Flow Coordinator

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![License](https://img.shields.io/badge/license-Private-red)

**Operador Field App** es una solución integral para la gestión de servicios de campo y coordinación de tareas técnicas. El sistema permite a los despachadores crear órdenes de trabajo detalladas y a los operadores de campo ejecutar secuencias de tareas (mediciones, checklists, evidencias fotográficas) desde una interfaz móvil optimizada.

## 🚀 Características Principales

La aplicación se divide en dos interfaces conectadas:

### 📱 App del Operador (Mobile Interface)
Diseñada para tablets y móviles, centrada en la usabilidad en campo.
* **Modo Online/Offline:** Indicadores de estado de conectividad.
* **Gestión de Trabajos:** Visualización clara de órdenes asignadas, prioridades y ubicaciones.
* **Secuencia de Tareas:** Flujo paso a paso para guiar al técnico (Medición, Evidencia, Checklists).
* **Detalles Técnicos:** Acceso a manuales de procedimiento, listado de materiales y notas de supervisión.
* **Contexto Inteligente:** Visualización de alertas y contextos generados por el sistema (ej. advertencias de seguridad).

### 🖥️ Panel del Despachador (Backend Admin)
Interfaz de administración para la gestión de flotas y tareas.
* **Gestión de Órdenes:** Creación, edición y eliminación de trabajos (`CRUD`).
* **Asignación de Recursos:** Definición de materiales necesarios y herramientas.
* **Diseñador de Tareas:** Creación dinámica de tipos de tareas (Medición, Foto, Checklist) dentro de una orden.
* **Monitoreo:** Vista rápida de órdenes activas y su prioridad.

## 🛠️ Stack Tecnológico

El proyecto está construido utilizando las últimas tecnologías del ecosistema React:

* **Core:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Inferido por las clases de utilidad).
* **Iconos:** [Lucide React](https://lucide.dev/)
* **Estado:** React Context API (`JobProvider`).

## 📋 Requisitos Previos

* [Node.js](https://nodejs.org/) (v18 o superior recomendado)
* [npm](https://www.npmjs.com/)

## 🔧 Instalación y Despliegue

Sigue estos pasos para levantar el entorno de desarrollo local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd NeuralStories-task-flow-coordinator
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible típicamente en `http://localhost:5173`.

4.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```text
src/
├── components/
│   ├── DispatcherDashboard.tsx  # Panel de administración/backend
│   ├── JobDetail.tsx            # Vista de detalle para el operador
│   ├── JobSelection.tsx         # Lista de trabajos para el operador
│   ├── TaskSequence.tsx         # Ejecución paso a paso de tareas
│   ├── JobComplete.tsx          # Pantalla de finalización
│   └── ...
├── context/
│   └── JobContext.tsx           # Manejo del estado global de trabajos
├── types.ts                     # Definiciones de interfaces (Job, Task) y Mock Data
├── App.tsx                      # Enrutador principal y Layout
└── main.tsx                     # Punto de entrada
