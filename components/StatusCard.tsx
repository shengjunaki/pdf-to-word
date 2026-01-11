import React from 'react';
import { Loader2, CheckCircle, XCircle, FileText, RefreshCw } from 'lucide-react';
import { AppStatus } from '../types';

interface StatusCardProps {
  status: AppStatus;
  progress: number;
  fileName: string | null;
  errorMessage: string | null;
  onReset: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  status, 
  progress, 
  fileName, 
  errorMessage,
  onReset 
}) => {
  if (status === AppStatus.IDLE) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start space-x-4">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          {status === AppStatus.PROCESSING && (
            <div className="p-3 bg-blue-50 rounded-full">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
          {status === AppStatus.SUCCESS && (
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          )}
          {status === AppStatus.ERROR && (
            <div className="p-3 bg-red-50 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-slate-900">
            {status === AppStatus.PROCESSING && 'Converting Document...'}
            {status === AppStatus.SUCCESS && 'Conversion Complete!'}
            {status === AppStatus.ERROR && 'Conversion Failed'}
          </h4>
          
          <p className="text-sm text-slate-500 mt-1 truncate">
            {fileName || 'Unknown File'}
          </p>

          {/* Progress Bar (Only during processing) */}
          {status === AppStatus.PROCESSING && (
            <div className="mt-4 space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-right">{progress}%</p>
            </div>
          )}

          {/* Success Actions */}
          {status === AppStatus.SUCCESS && (
            <div className="mt-4">
              <p className="text-sm text-slate-600">
                Your Word document should begin downloading automatically.
              </p>
              <button 
                onClick={onReset}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert Another File
              </button>
            </div>
          )}

          {/* Error Message */}
          {status === AppStatus.ERROR && (
            <div className="mt-4">
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {errorMessage || 'An unexpected error occurred.'}
              </p>
              <button 
                onClick={onReset}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};