// GlassPanel.tsx
import React from 'react';

type GlassPanelProps = {
  children: React.ReactNode;
  color: 'dark' | 'light';
  tailwindProps?: string;
};

const GlassPanel: React.FC<GlassPanelProps> = ({ children, color, tailwindProps }) => {
  return (
    // <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-xl p-4 shadow-md">
      <div className={`${color === 'dark' ? 'backdrop-brightness-75' : 'backdrop-brightness-125'} backdrop-blur-md rounded-md p-4 shadow-md 
      ${tailwindProps ? tailwindProps : ''}
      `}>
      {children}
    </div>
  );
};

export default GlassPanel;
