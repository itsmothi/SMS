import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  bgColor?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', bgColor = '#FFFFFF', style = {} }) => {
  return (
    <div 
      className={`brutal-border brutal-shadow ${className}`} 
      style={{ backgroundColor: bgColor, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', ...style }}
    >
      {title && <h2 style={{ borderBottom: '3px solid #000', paddingBottom: '12px', marginBottom: '8px' }}>{title}</h2>}
      <div>
        {children}
      </div>
    </div>
  );
};
