import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = 'px-4 py-2 font-semibold rounded';
  const variantStyle = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-500 text-white hover:bg-gray-600';

  return (
    <button className={clsx(baseStyle, variantStyle, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
