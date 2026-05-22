import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: string;
}

export const ToggleSwitch = ({ checked, onChange, label, color }: ToggleSwitchProps) => {
  return (
    <label className="toggle-switch-container">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        style={{ display: 'none' }}
      />
      <div 
        className={`toggle-switch ${checked ? 'checked' : ''}`}
        style={{ '--toggle-color': color || '#3b82f6' } as React.CSSProperties}
      >
        <div className="toggle-switch-thumb" />
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};
