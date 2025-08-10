"use client";

interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  "aria-describedby"?: string;
}

export default function InputField({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  required = false,
  rows,
  "aria-describedby": ariaDescribedBy,
}: InputFieldProps) {
  const Component = type === "textarea" ? "textarea" : "input";

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
      >
        {label}
        {required && (
          <span className="text-slate-500 dark:text-slate-400 ml-1">
            (required)
          </span>
        )}
      </label>
      <Component
        id={id}
        name={name}
        type={type !== "textarea" ? type : undefined}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onChange(e.target.value)}
        className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl 
                   bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-slate-500 dark:placeholder-slate-400
                   transition-colors duration-200"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={type === "textarea" ? rows : undefined}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  );
}
