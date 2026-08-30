import React from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-primary font-semibold transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-accent-primary text-neutral-white hover:bg-accent-primaryLight active:bg-accent-primaryDark shadow-sm hover:shadow-md',
    secondary:
      'bg-background-tertiary text-text-primary border border-background-tertiary hover:border-accent-primary hover:bg-background-secondary transition-all',
    tertiary: 'text-text-primary hover:text-accent-primary bg-transparent hover:bg-background-tertiary',
    ghost: 'text-text-secondary hover:text-accent-primary bg-transparent',
    success:
      'bg-semantic-success text-neutral-white hover:bg-opacity-90 active:bg-opacity-80 shadow-sm',
    danger: 'bg-semantic-error text-neutral-white hover:bg-opacity-90 active:bg-opacity-80 shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      {...motionPresets.buttonHover}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
