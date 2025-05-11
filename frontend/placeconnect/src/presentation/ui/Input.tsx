import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ icon, label, containerClassName = '', ...props }) => (
  <div className={containerClassName}>
    {label && (
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
    )}
    <div className="mt-1 flex relative border-2 rounded-md border-neutral-600 focus-within:border-teal-400 transition-all">
      {icon && (
        <label htmlFor={props.id || props.name} className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </label>
      )}
      <input
        {...props}
        className={`border-none outline-none text-black ${props.className || ''}`.trim()}
      />
    </div>
  </div>
);

export default Input;
