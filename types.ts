
export interface ConflictCloudSolution {
  id: string; // Unique ID for each solution, e.g., timestamp or UUID
  text: string;
  isAiSuggested?: boolean; // Optional flag to indicate if AI suggested it
}

export interface ConflictCloud {
  id: string;
  title: string;
  objective: string;    // A
  requirementB: string; // B
  requirementC: string; // C
  desireD: string;      // D
  desireDPrime: string; // D'
  solutions: ConflictCloudSolution[];
  isSolved: boolean;
}

export interface EditableTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  readOnly?: boolean; // Added readOnly prop
}

export interface CloudNodeProps {
  nodeId: keyof Pick<ConflictCloud, 'objective' | 'requirementB' | 'requirementC' | 'desireD' | 'desireDPrime'>;
  cloudIdPrefix: string; // To make textarea IDs unique across clouds
  label: string;
  symbol: string; // A, B, C, D, D'
  value: string;
  onValueChange: (newValue: string) => void;
  placeholder: string;
  nodeColorClasses?: string; // Tailwind classes for background and border - NOW OPTIONAL
  textColorClasses?: string; // Tailwind classes for text color - now optional
  readOnly?: boolean; // Added readOnly prop
}

export enum NodeKey {
  OBJECTIVE = 'objective',
  REQUIREMENT_B = 'requirementB',
  REQUIREMENT_C = 'requirementC',
  DESIRE_D = 'desireD',
  DESIRE_D_PRIME = 'desireDPrime',
}