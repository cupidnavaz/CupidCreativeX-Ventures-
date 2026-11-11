import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  onClick,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200 hover:border-slate-300 text-slate-800',
    primary: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-900',
    danger: 'bg-red-50 border-red-200 hover:border-red-300 text-red-900',
  };

  const iconStyles = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-indigo-100 text-indigo-600',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${variantStyles[variant]}`}
    >
      <div className={`p-3 rounded-lg flex-shrink-0 transition-transform group-hover:scale-105 ${iconStyles[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base tracking-tight truncate">{title}</h3>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-slate-700 shadow-2xs">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
  );
};