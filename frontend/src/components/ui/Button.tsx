import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClass = "brutal-border brutal-shadow";
  const colors = {
    primary: "var(--primary-color)",
    secondary: "var(--secondary-color)",
    accent: "var(--accent-color)",
    danger: "#E53935"
  };

  const style = {
    backgroundColor: colors[variant],
    padding: '12px 24px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    color: '#000',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  return (
    <button 
      className={`${baseClass} ${className}`} 
      style={style} 
      {...props}
    >
      {children}
    </button>
  );
};
