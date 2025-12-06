
import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", textClassName = "text-emerald-950 dark:text-white", iconClassName = "w-10 h-10" }) => {
  return (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-tight font-heading ${className}`}>
      {/* 
          REPLACE THE SRC URL BELOW WITH YOUR OWN LOGO URL LATER.
          Current placeholder: A gold square with "Logo" text.
      */}
      <img 
        src="https://placehold.co/200x200/F59E0B/ffffff.png?text=Logo" 
        alt="Logo" 
        className={`${iconClassName} object-contain rounded-lg`}
      />
      <span className={textClassName}>Nexu</span>
    </div>
  );
};
