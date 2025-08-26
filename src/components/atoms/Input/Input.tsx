/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Input({
  label,
  type = "text",
  name,
  placeHolder,
  inputClass,
  labelClass,
  value,
  containerClass,
  required,
  register,
  errors,
}: {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  inputClass?: string;
  containerClass?: string;
  labelClass?: string;
  placeHolder: string;
  register: any;
  value?: string;
  errors: any;
}) {
  

  return (
    <div className={`form-group ${containerClass}`}>
      <label className={labelClass} htmlFor={name}>{label} {required ? <span className="text-red-500">*</span> : ""}</label>
      <input
        {...register(name)}
        type={type}
        className={`form-control mb-1 ${inputClass}`}
        placeholder={placeHolder}
      />
      {errors[name] && (
        <span className="text-danger text-red-500">{errors[name].message}</span>
      )}
    </div>
  );
}
