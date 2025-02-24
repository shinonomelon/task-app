import { Input } from '@/components/ui/input';

type FormInputProps = {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
  error?: string;
};

export const FormInput = ({
  id,
  name,
  type = 'text',
  placeholder,
  defaultValue,
  required,
  minLength,
  maxLength,
  autoFocus,
  className,
  error
}: FormInputProps) => {
  return (
    <Input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className={className}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  );
};
