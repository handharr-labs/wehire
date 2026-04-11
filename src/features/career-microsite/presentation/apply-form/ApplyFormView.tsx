'use client';

import { type Company } from '@/shared/domain/entities/Company';
import { type Job } from '@/shared/domain/entities/Job';
import { type FormField } from '@/shared/domain/entities/FormField';
import { type ApplyFormViewModel } from './useApplyFormViewModel';
import { SYSTEM_FIELD_FORM_KEY } from './buildApplicationFormSchema';

interface Props {
  company: Company;
  job: Job;
  formFields: FormField[];
  vm: ApplyFormViewModel;
}

const INPUT_CLASS =
  'w-full border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]';

export function ApplyFormView({ company, job, formFields, vm }: Props) {
  const { isSubmitting, error, fieldErrors, handleSubmit, handleCvFileChange } = vm;

  const enabledFields = formFields
    .filter((f) => f.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmit(new FormData(e.currentTarget));
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Apply for {job.title}</h1>
        <p className="text-sm text-zinc-500 mb-8">{company.name}</p>

        <form onSubmit={onSubmit} noValidate className="bg-white rounded-lg border border-zinc-200 p-8 space-y-5">
          {enabledFields.map((field) => (
            <FormFieldInput
              key={field.id}
              field={field}
              fieldErrors={fieldErrors}
              onCvFileChange={handleCvFileChange}
            />
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--brand-primary)] text-white py-3 rounded-lg text-sm font-medium hover:bg-[var(--brand-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </main>
  );
}

interface FieldInputProps {
  field: FormField;
  fieldErrors: Record<string, string> | null;
  onCvFileChange(): void;
}

function FormFieldInput({ field, fieldErrors, onCvFileChange }: FieldInputProps) {
  // System fields use their camelCase form key; custom fields use fieldName directly
  const inputName = field.isSystem
    ? (SYSTEM_FIELD_FORM_KEY[field.fieldName] ?? field.fieldName)
    : field.fieldName;

  const errorKey = inputName;
  const fieldError = fieldErrors?.[errorKey];
  const requiredMark = field.required ? ' *' : '';

  // CV file is a special system field
  if (field.fieldName === 'cv_url') {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor="cvFile">
          CV / Resume{requiredMark}
        </label>
        <input
          id="cvFile"
          name="cvFile"
          type="file"
          required={field.required}
          accept=".pdf,.doc,.docx"
          onChange={onCvFileChange}
          className="w-full text-sm text-zinc-600"
        />
        {fieldError && <p className="text-red-600 text-sm mt-1">{fieldError}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor={inputName}>
          {field.label}{requiredMark}
        </label>
        <textarea
          id={inputName}
          name={inputName}
          required={field.required}
          rows={4}
          className={INPUT_CLASS}
        />
        {fieldError && <p className="text-red-600 text-sm mt-1">{fieldError}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor={inputName}>
          {field.label}{requiredMark}
        </label>
        <select
          id={inputName}
          name={inputName}
          required={field.required}
          className={INPUT_CLASS}
        >
          {!field.required && <option value="">— Select —</option>}
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {fieldError && <p className="text-red-600 text-sm mt-1">{fieldError}</p>}
      </div>
    );
  }

  // All other types (text, email, tel, url, number, date, file)
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1" htmlFor={inputName}>
        {field.label}{requiredMark}
      </label>
      <input
        id={inputName}
        name={inputName}
        type={field.type}
        required={field.required}
        {...(field.type === 'number' ? { min: 0 } : {})}
        className={INPUT_CLASS}
      />
      {fieldError && <p className="text-red-600 text-sm mt-1">{fieldError}</p>}
    </div>
  );
}
