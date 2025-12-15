import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = Math.min(100, (current / total) * 100);
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
      <div 
        className="h-full bg-[#803746] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(128,55,70,0.4)]"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};