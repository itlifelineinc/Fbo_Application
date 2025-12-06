
import React from 'react';

interface LogoProps {
  className?: string; // Container dimensions for the icon (e.g. w-10 h-10)
  textClassName?: string; // Classes for the text (e.g. text-xl)
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  textClassName = "text-2xl font-bold text-emerald-950 dark:text-white", 
  showText = true 
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Gradient Icon */}
      <div className={`${className} bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-lg flex items-center justify-center text-white font-heading font-bold select-none`}>
        <span style={{ fontSize: '120%' }}>N</span>
      </div>
      
      {/* App Name */}
      {showText && (
        <span className={`${textClassName} font-heading tracking-tight`}>
          Nexu
        </span>
      )}
    </div>
  );
};
