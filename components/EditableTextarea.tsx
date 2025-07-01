
import React from 'react';
import type { EditableTextareaProps } from '../types';

const EditableTextarea: React.FC<EditableTextareaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  label,
  rows = 2, // Default to 2 rows for more compact AWS feel
  className = '',
  labelClassName = 'block text-xs font-medium text-slate-600 mb-0.5', 
  textareaClassName = 'block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 sm:text-sm resize-none min-h-[38px]', // Standardized padding and min-height
  readOnly = false,
}) => {
  const readOnlyClasses = readOnly 
    ? 'bg-slate-100 cursor-not-allowed focus:ring-0 focus:border-slate-300 text-slate-500' 
    : 'bg-white hover:border-slate-400 focus:ring-sky-500 focus:border-sky-500';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        placeholder={readOnly ? "" : placeholder} // No placeholder text when resolved for cleaner look
        rows={rows}
        className={`${textareaClassName} ${readOnlyClasses} transition-colors duration-150`}
        readOnly={readOnly}
        aria-readonly={readOnly}
      />
    </div>
  );
};

export default EditableTextarea;