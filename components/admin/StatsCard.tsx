// components/admin/StatsCard.tsx
import React from 'react';
import { Card } from './Card';

interface TrendData {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  trend?: TrendData;
  loading?: boolean;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100'
  },
  green: {
    bg: 'bg-green-500',
    lightBg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100'
  },
  purple: {
    bg: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100'
  },
  yellow: {
    bg: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    text: 'text-yellow-600',
    iconBg: 'bg-yellow-100'
  },
  red: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-50',
    text: 'text-red-600',
    iconBg: 'bg-red-100'
  },
  gray: {
    bg: 'bg-gray-500',
    lightBg: 'bg-gray-50',
    text: 'text-gray-600',
    iconBg: 'bg-gray-100'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  color = 'blue',
  trend,
  loading = false
}) => {
  const colorScheme = colorVariants[color];

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-lg p-3 ${colorScheme.iconBg}`}>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-lg p-3 ${colorScheme.iconBg}`}>
          <div className={colorScheme.text}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              {trend && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="sr-only">
                    {trend.isPositive ? 'Increased' : 'Decreased'} by
                  </span>
                  {Math.abs(trend.value)}%
                </div>
              )}
            </dd>
            {description && (
              <dd className="text-sm text-gray-500 mt-1">
                {description}
              </dd>
            )}
          </dl>
        </div>
      </div>
    </Card>
  );
};