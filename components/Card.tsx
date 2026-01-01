import React from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, className = '', children }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;