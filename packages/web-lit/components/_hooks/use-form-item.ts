import { LitElement } from 'lit';
import { ContextConsumer } from '@lit/context';
import { FormItemContext, formItemInjectionContext } from '../form/context';
import { Size } from '../_utils/constant';

export const useFormItem = (context: LitElement, {
  size,
  disabled,
  error,
  uninject,
}: {
  size?: Size | undefined;
  disabled?: boolean;
  error?: boolean;
  // private
  uninject?: boolean;
} = {}) => {
  const formItemCtx = !uninject
    ? new ContextConsumer(context, { context: formItemInjectionContext, subscribe: true, }).value ?? ({} as FormItemContext)
    : ({} as FormItemContext);

  const mergedSize =  size ?? formItemCtx!.size;

  const mergedDisabled = disabled || formItemCtx!.disabled;

  const mergedError = error || formItemCtx!.error;

  const feedback = formItemCtx!.feedback;
  const eventHandlers = formItemCtx!.eventHandlers;

  return {
    formItemCtx,
    mergedSize,
    mergedDisabled,
    mergedError,
    feedback,
    eventHandlers,
  };
};