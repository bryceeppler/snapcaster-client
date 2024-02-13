import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'; // Add more variants as needed
  size?: 'small' | 'medium' | 'large'; // Add more sizes as needed
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = 'focus:outline-none transition ease-in-out duration-300 inline-block rounded-xl';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
