'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { type FormField, type FormFieldType } from '@/shared/domain/entities/FormField';
import { createFormFieldAction } from '../actions/createFormFieldAction';
import { updateFormFieldAction } from '../actions/updateFormFieldAction';
import { deleteFormFieldAction } from '../actions/deleteFormFieldAction';
import { reorderFormFieldsAction } from '../actions/reorderFormFieldsAction';

/** The 7 core system field names that can never be disabled or deleted */
const CORE_FIELD_NAMES = new Set([
  'full_name',
  'email',
  'phone',
  'city',
  'experience_summary',
  'expected_salary',
  'cv_url',
]);

interface AddFieldForm {
  label: string;
  type: FormFieldType;
  required: boolean;
  options: string; // comma-separated for select type
}

const DEFAULT_ADD_FORM: AddFieldForm = {
  label: '',
  type: 'text',
  required: false,
  options: '',
};

export function useFormFieldsManagerViewModel(
  initialFields: FormField[],
  companyId: string,
) {
  const [fields, setFields] = useState<FormField[]>(
    [...initialFields].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddFieldForm>(DEFAULT_ADD_FORM);
  const [addError, setAddError] = useState<string | null>(null);

  const { execute: execCreate, isPending: isCreating } = useAction(createFormFieldAction, {
    onSuccess: ({ data }) => {
      if (data) {
        setFields((prev) =>
          [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder),
        );
        setShowAddForm(false);
        setAddForm(DEFAULT_ADD_FORM);
        setAddError(null);
      }
    },
    onError: () => setAddError('Failed to create field. Please try again.'),
  });

  const { execute: execUpdate } = useAction(updateFormFieldAction);
  const { execute: execDelete } = useAction(deleteFormFieldAction);
  const { execute: execReorder } = useAction(reorderFormFieldsAction);

  function isCore(field: FormField) {
    return CORE_FIELD_NAMES.has(field.fieldName);
  }

  function onToggleEnabled(field: FormField) {
    if (isCore(field)) return;
    const enabled = !field.enabled;
    setFields((prev) =>
      prev.map((f) => (f.id === field.id ? { ...f, enabled } : f)),
    );
    execUpdate({ companyId, fieldId: field.id, enabled });
  }

  function onToggleRequired(field: FormField) {
    if (isCore(field)) return;
    const required = !field.required;
    setFields((prev) =>
      prev.map((f) => (f.id === field.id ? { ...f, required } : f)),
    );
    execUpdate({ companyId, fieldId: field.id, required });
  }

  function onDelete(field: FormField) {
    if (field.isSystem) return;
    setFields((prev) => prev.filter((f) => f.id !== field.id));
    execDelete({ companyId, fieldId: field.id });
  }

  function onMoveUp(index: number) {
    if (index === 0) return;
    const next = [...fields];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const reordered = next.map((f, i) => ({ ...f, sortOrder: i + 1 }));
    setFields(reordered);
    execReorder({
      companyId,
      order: reordered.map((f) => ({ id: f.id, sortOrder: f.sortOrder })),
    });
  }

  function onMoveDown(index: number) {
    if (index === fields.length - 1) return;
    const next = [...fields];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const reordered = next.map((f, i) => ({ ...f, sortOrder: i + 1 }));
    setFields(reordered);
    execReorder({
      companyId,
      order: reordered.map((f) => ({ id: f.id, sortOrder: f.sortOrder })),
    });
  }

  function onAddFieldSubmit() {
    if (!addForm.label.trim()) {
      setAddError('Label is required.');
      return;
    }
    setAddError(null);
    execCreate({
      companyId,
      label: addForm.label.trim(),
      type: addForm.type,
      required: addForm.required,
      options: addForm.type === 'select'
        ? addForm.options.split(',').map((o) => o.trim()).filter(Boolean)
        : [],
    });
  }

  return {
    fields,
    showAddForm,
    addForm,
    addError,
    isCreating,
    isCore,
    onToggleEnabled,
    onToggleRequired,
    onDelete,
    onMoveUp,
    onMoveDown,
    onShowAddForm: () => setShowAddForm(true),
    onCancelAddForm: () => { setShowAddForm(false); setAddForm(DEFAULT_ADD_FORM); setAddError(null); },
    onAddFormChange: (patch: Partial<AddFieldForm>) => setAddForm((prev) => ({ ...prev, ...patch })),
    onAddFieldSubmit,
  };
}
