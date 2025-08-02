/* eslint-disable @typescript-eslint/no-explicit-any */
import DocIcon from "../customIcons/docIcon";

export default function FileInput({
  name,
  label,
  register,
  placeHolder,
}: {
  name: string;
  label: string;
  placeHolder: string;
  register: any;
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        className="d-none"
        hidden
        type="file"
        id={name}
        {...register(name)}
      />
      <button
        className="d-flex gap-2 form-control w-fit max-w-[200px]"
        onClick={() => {
          document.getElementById(name)?.click();
        }}
      >
        {placeHolder}
        <DocIcon />
      </button>
    </div>
  );
}
