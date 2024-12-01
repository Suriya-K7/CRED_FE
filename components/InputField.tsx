import { TextField } from "@mui/material";

type InputFieldProps = {
  label: string; // Label for the TextField
  name: string; // Name attribute to bind with Formik or other form state handlers
  value?: string; // Current value of the input
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // onChange handler
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; // onBlur handler
  error?: boolean; // Indicates if the field has an error
  helperText?: string | boolean; // Text to display when there's an error or additional information
  type?: string; // Input type, e.g., "text", "email", "number"
  disabled?: boolean; // to disable untill form filled on above section
};

export default function InputField({
  label,
  name,
  value = "",
  onChange,
  onBlur,
  error = false,
  helperText,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="w-full relative">
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        type={type}
        fullWidth
      />
      {helperText && error && (
        <p className="text-[10px] text-red-500 mt-1 absolute">{helperText}</p>
      )}
    </div>
  );
}
