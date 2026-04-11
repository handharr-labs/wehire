'use client';

import { type FormField } from '@/shared/domain/entities/FormField';
import { useFormFieldsManagerViewModel } from './useFormFieldsManagerViewModel';

const FIELD_TYPE_OPTIONS = [
  { value: 'text',     label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email',    label: 'Email' },
  { value: 'tel',      label: 'Phone' },
  { value: 'url',      label: 'URL' },
  { value: 'number',   label: 'Number' },
  { value: 'date',     label: 'Date' },
  { value: 'select',   label: 'Select (dropdown)' },
] as const;

const TYPE_BADGE: Record<string, string> = {
  text:     'bg-gray-100 text-gray-600',
  textarea: 'bg-blue-50 text-blue-600',
  email:    'bg-purple-50 text-purple-600',
  tel:      'bg-yellow-50 text-yellow-700',
  url:      'bg-indigo-50 text-indigo-600',
  number:   'bg-green-50 text-green-700',
  date:     'bg-pink-50 text-pink-600',
  select:   'bg-orange-50 text-orange-600',
  file:     'bg-red-50 text-red-600',
};

interface Props {
  initialFields: FormField[];
  companyId: string;
}

export function FormFieldsManagerView({ initialFields, companyId }: Props) {
  const vm = useFormFieldsManagerViewModel(initialFields, companyId);

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Application Form Fields</h1>
          <p className="text-sm text-gray-500 mb-6">
            Customize the fields shown on your applicant form. Core fields (
            <span className="inline-flex items-center gap-1"><LockIcon />locked</span>) cannot be
            removed.
          </p>

          <div className="space-y-2 mb-6">
            {vm.fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field}
                index={index}
                total={vm.fields.length}
                isCore={vm.isCore(field)}
                onToggleEnabled={() => vm.onToggleEnabled(field)}
                onToggleRequired={() => vm.onToggleRequired(field)}
                onDelete={() => vm.onDelete(field)}
                onMoveUp={() => vm.onMoveUp(index)}
                onMoveDown={() => vm.onMoveDown(index)}
              />
            ))}
          </div>

          {vm.showAddForm ? (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <p className="text-sm font-medium text-blue-900">New Field</p>

              {vm.addError && (
                <p className="text-sm text-red-600">{vm.addError}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Label *</label>
                  <input
                    type="text"
                    value={vm.addForm.label}
                    onChange={(e) => vm.onAddFormChange({ label: e.target.value })}
                    placeholder="e.g. Years of Experience"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={vm.addForm.type}
                    onChange={(e) => vm.onAddFormChange({ type: e.target.value as typeof vm.addForm.type })}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FIELD_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {vm.addForm.type === 'select' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Options <span className="text-gray-400">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={vm.addForm.options}
                    onChange={(e) => vm.onAddFormChange({ options: e.target.value })}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="addRequired"
                  checked={vm.addForm.required}
                  onChange={(e) => vm.onAddFormChange({ required: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="addRequired" className="text-sm text-gray-700">Required</label>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={vm.onAddFieldSubmit}
                  disabled={vm.isCreating}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded px-4 py-2 transition-colors"
                >
                  {vm.isCreating ? 'Adding…' : 'Add Field'}
                </button>
                <button
                  onClick={vm.onCancelAddForm}
                  className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium rounded px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={vm.onShowAddForm}
              className="cursor-pointer w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg py-3 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              + Add custom field
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FieldRowProps {
  field: FormField;
  index: number;
  total: number;
  isCore: boolean;
  onToggleEnabled(): void;
  onToggleRequired(): void;
  onDelete(): void;
  onMoveUp(): void;
  onMoveDown(): void;
}

function FieldRow({
  field,
  index,
  total,
  isCore,
  onToggleEnabled,
  onToggleRequired,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FieldRowProps) {
  const badgeClass = TYPE_BADGE[field.type] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${field.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
      {/* Reorder arrows */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="cursor-pointer text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed leading-none"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="cursor-pointer text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed leading-none"
          title="Move down"
        >
          ▼
        </button>
      </div>

      {/* Label */}
      <span className="flex-1 font-medium text-gray-800 min-w-0 truncate">{field.label}</span>

      {/* Type badge */}
      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${badgeClass}`}>
        {field.type}
      </span>

      {/* Required badge */}
      {field.required && (
        <span className="shrink-0 text-xs text-red-500 font-medium">required</span>
      )}

      {/* Lock icon for core system fields */}
      {isCore ? (
        <span className="shrink-0 text-gray-400" title="Core system field — cannot be modified">
          <LockIcon />
        </span>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle required (optional system + custom) */}
          <button
            onClick={onToggleRequired}
            className={`cursor-pointer text-xs px-2 py-0.5 rounded border transition-colors ${
              field.required
                ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
            }`}
            title={field.required ? 'Make optional' : 'Make required'}
          >
            {field.required ? 'req' : 'opt'}
          </button>

          {/* Toggle enabled (optional system + custom) */}
          <button
            onClick={onToggleEnabled}
            className={`cursor-pointer text-xs px-2 py-0.5 rounded border transition-colors ${
              field.enabled
                ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-50'
            }`}
            title={field.enabled ? 'Disable field' : 'Enable field'}
          >
            {field.enabled ? 'on' : 'off'}
          </button>

          {/* Delete (custom only) */}
          {!field.isSystem && (
            <button
              onClick={onDelete}
              className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
              title="Delete field"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5 inline"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
