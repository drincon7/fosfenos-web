// lib/hooks/useForm.ts
import { useState, useCallback, useMemo } from 'react';

// Tipos para validación
export type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T[keyof T], formData: T) => string | null;
  message?: string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

// Estado del formulario
interface FormState<T> {
  data: T;
  errors: FormErrors<T>;
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Opciones del hook
interface UseFormOptions<T> {
  initialData: T;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (data: T) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validationRules = {},
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>) => {
  const [state, setState] = useState<FormState<T>>({
    data: { ...initialData },
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
    isDirty: false,
  });

  // Función para validar un campo específico
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T], formData: T): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Validación requerido
      if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return rules.message || `${String(name)} es requerido`;
      }

      // Si está vacío y no es requerido, no validar más
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }

      // Validación de longitud mínima
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        return rules.message || `${String(name)} debe tener al menos ${rules.minLength} caracteres`;
      }

      // Validación de longitud máxima
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        return rules.message || `${String(name)} no puede tener más de ${rules.maxLength} caracteres`;
      }

      // Validación de patrón
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        return rules.message || `${String(name)} tiene un formato inválido`;
      }

      // Validación personalizada
      if (rules.custom) {
        return rules.custom(value, formData);
      }

      return null;
    },
    [validationRules]
  );

  // Función para validar todo el formulario
  const validateForm = useCallback(
    (formData: T): FormErrors<T> => {
      const errors: FormErrors<T> = {};

      Object.keys(validationRules).forEach((fieldName) => {
        const name = fieldName as keyof T;
        const error = validateField(name, formData[name], formData);
        if (error) {
          errors[name] = error;
        }
      });

      return errors;
    },
    [validationRules, validateField]
  );

  // Verificar si el formulario es válido
  const isFormValid = useMemo(() => {
    return Object.keys(state.errors).length === 0;
  }, [state.errors]);

  // Verificar si el formulario está sucio (ha cambiado)
  const isFormDirty = useMemo(() => {
    return JSON.stringify(state.data) !== JSON.stringify(initialData);
  }, [state.data, initialData]);

  // Actualizar un campo
  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setState((prev) => {
        const newData = { ...prev.data, [name]: value };
        const newErrors = { ...prev.errors };

        // Validar si está habilitado
        if (validateOnChange) {
          const fieldError = validateField(name, value, newData);
          if (fieldError) {
            newErrors[name] = fieldError;
          } else {
            delete newErrors[name];
          }
        }

        return {
          ...prev,
          data: newData,
          errors: newErrors,
          isDirty: true,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateField, validateOnChange]
  );

  // Marcar un campo como tocado
  const setFieldTouched = useCallback(
    (name: keyof T, touched = true) => {
      setState((prev) => {
        const newTouched = { ...prev.touched, [name]: touched };
        const newErrors = { ...prev.errors };

        // Validar si está habilitado y el campo fue tocado
        if (validateOnBlur && touched) {
          const fieldError = validateField(name, prev.data[name], prev.data);
          if (fieldError) {
            newErrors[name] = fieldError;
          } else {
            delete newErrors[name];
          }
        }

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        };
      });
    },
    [validateField, validateOnBlur]
  );

  // Establecer errores manualmente
  const setFieldError = useCallback((name: keyof T, error: string | null) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }

      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  }, []);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  // Resetear formulario
  const reset = useCallback(
    (newData?: Partial<T>) => {
      const resetData = newData ? { ...initialData, ...newData } : { ...initialData };
      setState({
        data: resetData,
        errors: {},
        touched: {},
        isValid: true,
        isSubmitting: false,
        isDirty: false,
      });
    },
    [initialData]
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        // Validar todo el formulario
        const errors = validateForm(state.data);
        
        if (Object.keys(errors).length > 0) {
          setState((prev) => ({
            ...prev,
            errors,
            isValid: false,
            isSubmitting: false,
          }));
          return false;
        }

        // Llamar a la función onSubmit si existe
        if (onSubmit) {
          await onSubmit(state.data);
        }

        setState((prev) => ({ ...prev, isSubmitting: false }));
        return true;
      } catch (error) {
        setState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [state.data, validateForm, onSubmit]
  );

  // Helpers para campos específicos
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: state.data[name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFieldValue(name, e.target.value as T[keyof T]);
      },
      onBlur: () => setFieldTouched(name, true),
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.data, state.errors, state.touched, setFieldValue, setFieldTouched]
  );

  const getCheckboxProps = useCallback(
    (name: keyof T) => ({
      checked: Boolean(state.data[name]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(name, e.target.checked as T[keyof T]);
      },
      onBlur: () => setFieldTouched(name, true),
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.data, state.errors, state.touched, setFieldValue, setFieldTouched]
  );

  const getFileProps = useCallback(
    (name: keyof T) => ({
      onChange: (file: File | null) => {
        setFieldValue(name, file as T[keyof T]);
      },
      onBlur: () => setFieldTouched(name, true),
      error: state.touched[name] ? state.errors[name] : undefined,
    }),
    [state.errors, state.touched, setFieldValue, setFieldTouched]
  );

  return {
    // Estado
    data: state.data,
    errors: state.errors,
    touched: state.touched,
    isValid: isFormValid,
    isDirty: isFormDirty,
    isSubmitting: state.isSubmitting,

    // Métodos de control
    setFieldValue,
    setFieldTouched,
    setFieldError,
    clearErrors,
    reset,
    handleSubmit,

    // Helpers para props
    getFieldProps,
    getCheckboxProps,
    getFileProps,

    // Helpers de validación
    validateField,
    validateForm,
  };
};