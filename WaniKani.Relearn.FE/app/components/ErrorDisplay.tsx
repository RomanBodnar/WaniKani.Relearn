import React from "react";

interface ErrorDisplayProps {
  title: string;
  description?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 shadow-lg shadow-slate-200/50 dark:shadow-none text-center max-w-2xl mx-auto my-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p role="alert" className="text-xl text-slate-900 dark:text-white font-bold mb-3">
        {title}
      </p>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

