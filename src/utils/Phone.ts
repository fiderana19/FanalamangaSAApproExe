import React from 'react';

const CONTROL_KEYS = [
  'Backspace',
  'Tab',
  'Enter',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
];

export const handlePhoneKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  if (e.ctrlKey || e.metaKey || CONTROL_KEYS.includes(e.key)) {
    return;
  }
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizePhone = (value: string) => value.replace(/\D/g, '');

export const formatPhone = (value?: string | null) => {
  const digits = sanitizePhone(value ?? '');
  if (!digits) {
    return '';
  }
  const groups = digits.replace(/^(\d{2})(\d{2})(\d{2})(\d{3})$/, '$1 $2 $3 $4');
  return `+261 ${groups}`;
};