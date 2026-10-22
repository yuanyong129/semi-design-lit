import { FieldRule } from './interface';

export interface ValidateResult {
  status: 'success' | 'error' | 'warning';
  message: string;
}

export interface ValidateOptions {
  label?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=+#]*)?$/i;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

export function isEmptyValue(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}

function defaultMessage(rule: FieldRule, label: string): string {
  if (rule.message) return rule.message;
  if (rule.required) return `${label}不能为空`;
  if (rule.type === 'email') return `${label}不是合法的邮箱地址`;
  if (rule.type === 'url') return `${label}不是合法的链接`;
  if (rule.type === 'ip') return `${label}不是合法的 IP 地址`;
  if (rule.minLength !== undefined) return `${label}长度不能少于 ${rule.minLength}`;
  if (rule.maxLength !== undefined) return `${label}长度不能超过 ${rule.maxLength}`;
  if (rule.length !== undefined) return `${label}长度必须为 ${rule.length}`;
  if (rule.min !== undefined) return `${label}不能小于 ${rule.min}`;
  if (rule.max !== undefined) return `${label}不能大于 ${rule.max}`;
  if (rule.match) return `${label}格式不正确`;
  return `${label}格式不正确`;
}

function validateSingleRule(
  value: unknown,
  rule: FieldRule,
  label: string
): string | undefined {
  if (rule.required && isEmptyValue(value)) {
    return defaultMessage(rule, label);
  }

  if (isEmptyValue(value)) return undefined;

  if (rule.type) {
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') return defaultMessage(rule, label);
        break;
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) return defaultMessage(rule, label);
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return defaultMessage(rule, label);
        break;
      case 'array':
        if (!Array.isArray(value)) return defaultMessage(rule, label);
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) return defaultMessage(rule, label);
        break;
      case 'email':
        if (typeof value !== 'string' || !EMAIL_RE.test(value)) return defaultMessage(rule, label);
        break;
      case 'url':
        if (typeof value !== 'string' || !URL_RE.test(value)) return defaultMessage(rule, label);
        break;
      case 'ip':
        if (typeof value !== 'string' || !IP_RE.test(value)) return defaultMessage(rule, label);
        break;
    }
  }

  if (typeof value === 'string') {
    if (rule.length !== undefined && value.length !== rule.length) {
      return defaultMessage(rule, label);
    }
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return defaultMessage(rule, label);
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return defaultMessage(rule, label);
    }
    if (rule.match && !rule.match.test(value)) {
      return defaultMessage(rule, label);
    }
  }

  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) return defaultMessage(rule, label);
    if (rule.max !== undefined && value > rule.max) return defaultMessage(rule, label);
  }

  if (Array.isArray(value) && rule.includes) {
    if (!value.every((item) => rule.includes!.includes(item))) {
      return defaultMessage(rule, label);
    }
  }

  return undefined;
}

async function runCustomValidator(
  value: unknown,
  rule: FieldRule,
  label: string
): Promise<string | undefined> {
  const validator = rule.validator;
  if (!validator) return undefined;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (error?: string) => {
      if (settled) return;
      settled = true;
      resolve(error || undefined);
    };

    try {
      const result = validator(value, finish) as unknown;
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        (result as Promise<unknown>).then(
          () => finish(),
          (error) => finish(error instanceof Error ? error.message : String(error))
        );
      } else if (typeof result === 'string') {
        finish(result);
      } else if (result === true) {
        finish();
      } else if (result === false) {
        finish(defaultMessage(rule, label));
      } else if (result !== undefined) {
        finish();
      }
    } catch (error) {
      finish(error instanceof Error ? error.message : String(error));
    }
  });
}

/** Validate a value against a Semi-style rule list. */
export async function validateValue(
  value: unknown,
  rules: FieldRule | FieldRule[] | undefined,
  options: ValidateOptions = {}
): Promise<ValidateResult | undefined> {
  if (!rules) return undefined;

  const label = options.label || '该字段';
  const list = Array.isArray(rules) ? rules : [rules];

  for (const rule of list) {
    const error = validateSingleRule(value, rule, label);
    if (error) return { status: 'error', message: error };

    const customError = await runCustomValidator(value, rule, label);
    if (customError) return { status: 'error', message: customError };
  }

  return undefined;
}
