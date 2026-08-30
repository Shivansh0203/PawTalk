import React from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '../../styles/motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  animated?: boolean;
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  animated = true,
}: CardProps) => {
  const baseStyles =
    'bg-background-tertiary border border-background-secondary rounded-lg p-6 backdrop-blur-sm transition-all duration-200';

  const hoverStyles = hoverable ? 'hover:border-accent-primary hover:shadow-md' : '';

  const component = (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>{children}</div>
  );

  return animated ? (
    <motion.div {...motionPresets.fadeIn}>{component}</motion.div>
  ) : (
    component
  );
};
