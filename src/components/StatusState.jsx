import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export const LoadingState = ({ label = 'Loading...' }) => (
  <div className="p-8 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold">
    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    {label}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="p-6 sm:p-8 bg-red-50 border border-red-100 shadow-sm rounded-2xl text-center sm:text-left">
    <div className="flex items-center gap-2 justify-center sm:justify-start text-red-600 font-bold mb-1">
      <FaExclamationTriangle /> Error
    </div>
    <p className="text-sm text-red-500 font-medium">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-3 text-xs font-bold text-red-600 underline">
        Try again
      </button>
    )}
  </div>
);
