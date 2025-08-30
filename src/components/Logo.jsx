import React from 'react';
import { CreditCard } from 'lucide-react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: {
      container: 'flex items-center space-x-2',
      icon: 'w-8 h-8',
      iconBg: 'bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-xl',
      text: 'text-xl font-bold'
    },
    medium: {
      container: 'flex items-center space-x-3',
      icon: 'w-10 h-10',
      iconBg: 'bg-gradient-to-r from-blue-600 to-purple-600 w-14 h-14 rounded-2xl',
      text: 'text-2xl font-bold'
    },
    large: {
      container: 'flex items-center space-x-4',
      icon: 'w-12 h-12',
      iconBg: 'bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-3xl',
      text: 'text-4xl font-bold'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`${classes.container} ${className}`}>
      <div className={`${classes.iconBg} flex items-center justify-center shadow-lg`}>
        <CreditCard className={`${classes.icon} text-white`} />
      </div>
      <div>
        <h1 className={`${classes.text} text-gray-900`}>
          SubTracker
        </h1>
        {size === 'large' && (
          <p className="text-gray-600 text-sm font-medium">Smart Subscription Management</p>
        )}
      </div>
    </div>
  );
};

export default Logo;