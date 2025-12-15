import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, MY_JOBS_MOCK } from '../types';

interface JobContextType {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: number) => void;
  aiEnabled: boolean;
  toggleAI: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar con LocalStorage o con los datos Mock por defecto
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem('field_app_jobs');
    return savedJobs ? JSON.parse(savedJobs) : MY_JOBS_MOCK;
  });

  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('field_app_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const updateJob = (updatedJob: Job) => {
    setJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const deleteJob = (id: number) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const toggleAI = () => {
    setAiEnabled(prev => !prev);
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, aiEnabled, toggleAI }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};