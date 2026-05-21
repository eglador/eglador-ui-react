"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type FormMessageStatus = "error" | "warning" | "success" | "info";

interface FormFieldContextValue {
  name: string;
  id: string;
  descriptionId: string;
  messageId: string;
  error?: string;
  invalid: boolean;
  disabled: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function useFormField(): FormFieldContextValue {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error("useFormField must be used inside a <FormField>.");
  }
  return ctx;
}

function useOptionalFormField(): FormFieldContextValue | null {
  return React.useContext(FormFieldContext);
}

const STATUS_COLOR: Record<FormMessageStatus, string> = {
  error: "text-red-600",
  warning: "text-amber-600",
  success: "text-emerald-600",
  info: "text-blue-600",
};

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, children, ...rest },
  ref,
) {
  return (
    <form
      ref={ref}
      data-slot="form"
      className={cn("flex flex-col gap-4", className)}
      {...rest}
    >
      {children}
    </form>
  );
});
Form.displayName = "Form";

export interface FormFieldProps {
  name: string;
  error?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function FormField({
  name,
  error,
  disabled = false,
  children,
}: FormFieldProps) {
  const reactId = React.useId();
  const id = `${reactId}-${name}`;
  const descriptionId = `${id}-description`;
  const messageId = `${id}-message`;

  const value = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      id,
      descriptionId,
      messageId,
      error,
      invalid: !!error,
      disabled,
    }),
    [name, id, descriptionId, messageId, error, disabled],
  );

  return (
    <FormFieldContext.Provider value={value}>
      {children}
    </FormFieldContext.Provider>
  );
}
FormField.displayName = "FormField";

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  function FormItem({ className, ...rest }, ref) {
    const field = useOptionalFormField();
    return (
      <div
        ref={ref}
        data-slot="form-item"
        data-invalid={field?.invalid || undefined}
        data-disabled={field?.disabled || undefined}
        className={cn("flex min-w-0 flex-col gap-1.5", className)}
        {...rest}
      />
    );
  },
);
FormItem.displayName = "FormItem";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel({ required, className, children, ...rest }, ref) {
    const field = useFormField();
    return (
      <label
        ref={ref}
        htmlFor={field.id}
        data-slot="form-label"
        data-invalid={field.invalid || undefined}
        className={cn(
          "text-sm font-medium text-zinc-700 data-[invalid]:text-red-600 select-none",
          field.disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        {children}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>
    );
  },
);
FormLabel.displayName = "FormLabel";

export interface FormControlProps {
  children: React.ReactElement;
}

type ChildPropsForClone = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
};

export function FormControl({ children }: FormControlProps) {
  const field = useFormField();
  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >;
  const childProps = (child.props || {}) as Record<string, unknown>;

  const existingDescribedBy = childProps["aria-describedby"] as
    | string
    | undefined;

  const describedByParts = [
    existingDescribedBy,
    field.descriptionId,
    field.invalid ? field.messageId : null,
  ].filter(Boolean) as string[];

  const next: ChildPropsForClone = {
    id: field.id,
    "aria-describedby": describedByParts.length
      ? describedByParts.join(" ")
      : undefined,
    "aria-invalid": field.invalid || undefined,
  };

  if (field.disabled && childProps.disabled === undefined) {
    next.disabled = true;
  }

  return React.cloneElement(child, next);
}
FormControl.displayName = "FormControl";

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(function FormDescription({ className, id, ...rest }, ref) {
  const field = useOptionalFormField();
  return (
    <p
      ref={ref}
      id={id ?? field?.descriptionId}
      data-slot="form-description"
      className={cn("text-xs text-zinc-500", className)}
      {...rest}
    />
  );
});
FormDescription.displayName = "FormDescription";

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  status?: FormMessageStatus;
}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(function FormMessage(
  { status = "error", className, children, id, ...rest },
  ref,
) {
  const field = useOptionalFormField();
  const body = children ?? field?.error;
  if (body == null || body === "") return null;
  return (
    <p
      ref={ref}
      id={id ?? field?.messageId}
      data-slot="form-message"
      data-status={status}
      role={status === "error" ? "alert" : undefined}
      className={cn(
        "text-xs font-medium",
        STATUS_COLOR[status],
        className,
      )}
      {...rest}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export interface FormFieldSetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  invalid?: boolean;
}

export const FormFieldSet = React.forwardRef<
  HTMLFieldSetElement,
  FormFieldSetProps
>(function FormFieldSet(
  { invalid, disabled, className, ...rest },
  ref,
) {
  return (
    <fieldset
      ref={ref}
      data-slot="form-fieldset"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...rest}
    />
  );
});
FormFieldSet.displayName = "FormFieldSet";

export interface FormLegendProps
  extends React.HTMLAttributes<HTMLLegendElement> {}

export const FormLegend = React.forwardRef<HTMLLegendElement, FormLegendProps>(
  function FormLegend({ className, ...rest }, ref) {
    return (
      <legend
        ref={ref}
        data-slot="form-legend"
        className={cn(
          "text-sm font-medium text-zinc-700 select-none",
          className,
        )}
        {...rest}
      />
    );
  },
);
FormLegend.displayName = "FormLegend";

export interface FormFieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const FormFieldGroup = React.forwardRef<
  HTMLDivElement,
  FormFieldGroupProps
>(function FormFieldGroup({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="form-field-group"
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...rest}
    />
  );
});
FormFieldGroup.displayName = "FormFieldGroup";
