// components/admin/FormField.tsx
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  description?: string;
}

export const FormField = ({ label, error, required, children, description }: FormFieldProps) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {description && (
      <p className="text-xs text-gray-500">{description}</p>
    )}
    {children}
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

// Componente de Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = ({ error, className = '', ...props }: InputProps) => (
  <input
    className={`
      block w-full rounded-md border-gray-300 shadow-sm 
      focus:border-purple-500 focus:ring-purple-500 sm:text-sm
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
      ${className}
    `}
    {...props}
  />
);

// Componente de TextArea
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = ({ error, className = '', ...props }: TextAreaProps) => (
  <textarea
    className={`
      block w-full rounded-md border-gray-300 shadow-sm 
      focus:border-purple-500 focus:ring-purple-500 sm:text-sm
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
      ${className}
    `}
    {...props}
  />
);

// Componente de Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export const Select = ({ error, options, className = '', ...props }: SelectProps) => (
  <select
    className={`
      block w-full rounded-md border-gray-300 shadow-sm 
      focus:border-purple-500 focus:ring-purple-500 sm:text-sm
      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
      ${className}
    `}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Componente de Switch/Toggle
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch = ({ checked, onChange, label, description }: SwitchProps) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col">
      {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
      {description && <span className="text-sm text-gray-500">{description}</span>}
    </div>
    <button
      type="button"
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${checked ? 'bg-purple-600' : 'bg-gray-200'}
      `}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  </div>
);
