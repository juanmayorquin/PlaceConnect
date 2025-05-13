interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'contrast' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  const baseClasses = 'btn rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-300 focus:outline-none',
    secondary: 'bg-transparent border-2 border-teal-500 text-teal-500 hover:bg-black/10 focus:ring-2 focus:ring-teal-500 focus:outline-none',
    contrast: 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;