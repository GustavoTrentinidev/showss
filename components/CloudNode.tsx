
import React from 'react';
import type { CloudNodeProps } from '../types';
import EditableTextarea from './EditableTextarea';

const CloudNode: React.FC<CloudNodeProps> = ({
  nodeId,
  cloudIdPrefix,
  label,
  symbol,
  value,
  onValueChange,
  placeholder,
  // nodeColorClasses and textColorClasses are no longer used for AWS-like styling
  readOnly = false,
}) => {
  // Consistent styling for all nodes, similar to AWS cards/sections
  const baseNodeClasses = "p-3 rounded-md border border-slate-200 bg-white w-full";
  const finalNodeClasses = `${baseNodeClasses} ${readOnly ? 'opacity-70' : ''}`;

  return (
    <div className={finalNodeClasses}>
      <h3 className={`text-xs font-semibold text-slate-700 mb-1`}>
        {label} <span className="font-normal text-slate-500">({symbol})</span>
      </h3>
      <EditableTextarea
        id={`${cloudIdPrefix}-${nodeId}`}
        value={value}
        onChange={onValueChange}
        placeholder={placeholder}
        rows={2} // Consistent row count
        className="mt-0.5" // Small top margin for alignment
        textareaClassName={`block w-full p-1.5 border border-slate-300 rounded-md focus:ring-1 sm:text-sm resize-none min-h-[50px] placeholder-slate-400 ${readOnly ? 'bg-slate-50' : 'bg-white hover:border-slate-400 focus:border-sky-500 focus:ring-sky-500'}`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CloudNode;