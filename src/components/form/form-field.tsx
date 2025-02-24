import { Label } from '@/components/ui/label';

type FormFieldProps = {
  label: string;
  name: string;
  error?: string[];
  required?: boolean;
  children: React.ReactNode;
  description?: string;
};

export const FormField = ({
  label,
  name,
  error,
  required,
  children,
  description
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={name} className="text-sm font-bold">
          {label}
          {required && (
            <span
              className="ml-0.5 inline-flex -translate-y-1 text-red-400"
              aria-label="必須"
            >
              *
            </span>
          )}
        </Label>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p
          className="text-sm text-red-400"
          role="alert"
          aria-live="assertive"
          id={`${name}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
