export type FilterType =
  | 'text'
  | 'number-interval'
  | 'date-interval'
  | 'date-range'
  | 'select'
  | 'multi-select'
  | 'folder-select';

export interface FilterConfig {
  type?: FilterType;
  label?: string;
  key?: string;
  filterKey?:string;
  column:string;
  value?: string | string[] | { min: string; max: string };
  onChange?: (key: string, value: string | string[] | { min: string; max: string }) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  readOnly?: boolean;  
  disabled?: boolean;   
  visible?: boolean; 
  rangePlaceholders?: [string, string]; 
  filterTitle?:string;
}
