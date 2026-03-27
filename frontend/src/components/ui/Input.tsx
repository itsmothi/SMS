import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && <label style={{ fontWeight: 800, textTransform: 'uppercase' }}>{label}</label>}
      <input 
        className={`brutal-border brutal-shadow ${className}`}
        style={{
          padding: '12px 16px',
          outline: 'none',
          backgroundColor: '#FFF',
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{error}</span>}
    </div>
  );
};
