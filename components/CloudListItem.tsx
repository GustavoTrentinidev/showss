
import React from 'react';
import type { ConflictCloud } from '../types';

// --- Ícones SVG ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);


const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
</svg>
);

const DocumentIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5m-4.5 3h4.5m-4.5 3h4.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
);
// --- Fim dos Ícones SVG ---

interface CloudListItemProps {
  cloud: ConflictCloud;
  isSelected: boolean;
  onSelect: () => void;
}

const CloudListItem: React.FC<CloudListItemProps> = ({
  cloud,
  isSelected,
  onSelect,
}) => {

  const headerBaseClasses = "flex items-center justify-between px-3 py-2.5 w-full text-left rounded-md transition-colors duration-150 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1";
  
  let headerStateClasses = "";
  let itemContainerClasses = "transition-shadow duration-150 ease-in-out rounded-md border";

  if (isSelected) {
    headerStateClasses = "bg-sky-50 text-sky-700 hover:bg-sky-100 border-b border-sky-200 rounded-b-none";
    itemContainerClasses += " border-sky-300 shadow-md bg-white";
  } else if (cloud.isSolved) {
    headerStateClasses = "bg-emerald-50 text-emerald-600 hover:bg-emerald-100";
    itemContainerClasses += " border-emerald-200 hover:border-emerald-300 hover:shadow-sm";
  } else {
    headerStateClasses = "bg-white text-slate-700 hover:bg-slate-50";
    itemContainerClasses += " border-slate-200 hover:border-slate-300 hover:shadow-sm";
  }
  

  return (
    <li className={itemContainerClasses}>
      <div
        className={`${headerBaseClasses} ${headerStateClasses}`}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect();}}
        aria-current={isSelected}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-grow min-w-0">
          {cloud.isSolved ? (
            <CheckCircleIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-sky-600' : 'text-emerald-500'}`} />
          ) : (
             <DocumentIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
          )}
          <span className={`font-medium truncate text-xs ${isSelected ? 'text-sky-700' : (cloud.isSolved ? 'text-emerald-700' : 'text-slate-700')}`} title={cloud.title}>
            {cloud.title || 'Nuvem Sem Título'}
          </span>
        </div>
        <div className="flex items-center flex-shrink-0 pl-2">
            {isSelected ? <ChevronDownIcon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-500' }`} /> : <ChevronRightIcon className={`w-4 h-4 ${cloud.isSolved ? 'text-emerald-500' : 'text-slate-500'}`} />}
        </div>
      </div>
    </li>
  );
};

export default CloudListItem;
