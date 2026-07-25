'use client';

import React, { useState } from 'react';
import { Settings2, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'checkbox';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface InteractiveFormWidgetProps {
  formData: {
    title: string;
    description?: string;
    fields: FormField[];
    submitLabel?: string;
  };
}

export default function InteractiveFormWidget({ formData }: InteractiveFormWidgetProps) {
  const { title, description, fields, submitLabel = 'Submit to Inso AI Swarm' } = formData;
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, val: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: val }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleCheckboxChange = (fieldId: string, option: string, isChecked: boolean) => {
    const currentList: string[] = formValues[fieldId] || [];
    let newList: string[];
    if (isChecked) {
      newList = [...currentList, option];
    } else {
      newList = currentList.filter((item) => item !== option);
    }
    handleInputChange(fieldId, newList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Field validations
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required) {
        const val = formValues[field.id];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate agent task processing for 1.2 seconds
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10 p-5 shadow-xs my-4 flex flex-col items-center justify-center text-center space-y-3.5 transition-all duration-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="h-6 w-6 animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Configuration Compiled Successfully!</h4>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-500/80 mt-0.5">Parameters synced with active workspace agents.</p>
        </div>

        {/* Display Submitted value audit summary */}
        <div className="w-full bg-white dark:bg-zinc-900/80 border border-zinc-150 dark:border-zinc-800 rounded-xl p-3.5 text-left text-xs space-y-2 max-h-[160px] overflow-y-auto">
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Workspace Compiled Parameters</span>
          {fields.map((field) => {
            const val = formValues[field.id];
            const formattedVal = Array.isArray(val) ? val.join(', ') : String(val ?? 'None');
            return (
              <div key={field.id} className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5 last:border-b-0 last:pb-0">
                <span className="text-zinc-400 dark:text-zinc-500">{field.label}:</span>
                <strong className="text-zinc-800 dark:text-zinc-200">{formattedVal}</strong>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm my-4 flex flex-col">
      {/* Form Header */}
      <div className="flex items-center space-x-2 border-b border-zinc-150 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-800/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
          <Settings2 className="h-4 w-4 text-zinc-650" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
          {description && <p className="text-[10px] text-zinc-400 mt-0.5">{description}</p>}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {fields.map((field) => {
          const hasError = !!errors[field.id];
          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center space-x-1">
                <span>{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* Render based on field type */}
              {field.type === 'text' && (
                <Input
                  type="text"
                  placeholder={field.placeholder || 'Enter value...'}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`h-9 text-xs focus-visible:ring-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 ${
                    hasError ? 'border-red-400 focus-visible:ring-red-400' : ''
                  }`}
                />
              )}

              {field.type === 'select' && (
                <select
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full rounded-lg border h-9 text-xs px-3 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 ${
                    hasError ? 'border-red-400 focus:ring-red-400' : ''
                  }`}
                >
                  <option value="" className="text-zinc-400">
                    -- Select option --
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-0.5">
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        checked={formValues[field.id] === opt}
                        onChange={() => handleInputChange(field.id, opt)}
                        className="h-3.5 w-3.5 border-zinc-300 text-zinc-900 focus:ring-zinc-400 accent-zinc-950 dark:accent-zinc-50"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {field.options?.map((opt) => {
                    const isChecked = (formValues[field.id] || []).includes(opt);
                    return (
                      <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                          className="h-3.5 w-3.5 rounded-sm border-zinc-300 text-zinc-900 focus:ring-zinc-400 accent-zinc-950 dark:accent-zinc-50"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {hasError && (
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors[field.id]}
                </span>
              )}
            </div>
          );
        })}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-colors mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
              <span>Processing parameters...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <Play className="h-3 w-3 fill-current" />
              <span>{submitLabel}</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
