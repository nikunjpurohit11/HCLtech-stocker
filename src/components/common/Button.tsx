import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6798ff]';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#6798ff] text-white hover:bg-[#5287f7] shadow-sm shadow-[#6798ff]/20 active:translate-y-px',
    secondary:
      'bg-[#1e1e1e] text-[#ffffff] border border-[#313131] hover:border-[#454545] hover:bg-[#252525] active:translate-y-px',
    danger:
      'bg-[#f43f5e] text-white hover:bg-[#e11d48] shadow-sm shadow-[#f43f5e]/20 active:translate-y-px',
    ghost:
      'bg-transparent text-[#a7a7a7] hover:text-white hover:bg-[#1e1e1e]',
    pill:
      'bg-white text-black hover:bg-neutral-200 rounded-full font-medium px-5 py-2 text-sm shadow-md',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
