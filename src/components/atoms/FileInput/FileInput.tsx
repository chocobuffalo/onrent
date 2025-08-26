/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFileConvert } from "@/hooks/component/useFileConvert";
import DocIcon from "../customIcons/docIcon";
import { FaCheck } from "react-icons/fa6";
import { JSX } from "react";

export default function FileInput({
  name,
  label,
  register,
  placeHolder,
  icon,
  classLabel,
  classWrapper,
  classItem
}: {
  classLabel?: string;
  classItem?: string;
  icon?: JSX.Element;
  name: string;
  label: string;
  placeHolder: string;
  register?: any;
  classWrapper?: string;
}) {
  const { convertFileToBase64,base64File } = useFileConvert();
  const iconElement = icon || <DocIcon />;
  const classes = classItem? classItem:'d-flex gap-2 flex items-center form-control w-fit max-w-[200px]';
  const classesWrapper = classWrapper? classWrapper:'form-group';
  const classesLabel = classLabel? classLabel:'form-label';
  return (
    <div className={classesWrapper}>
      <label htmlFor={name} className={classesLabel}>{label}</label>
      <input
        className="d-none"
        hidden
        type="file"
        id={name}
        onChange={(e) => {
          convertFileToBase64(e.target.files?.[0] as File);
        }}

      />
      {/*leer campo file, convierte el archivo en base64  */}
      <div className="flex  gap-3 items-center">
        <input type="hidden" value={base64File} {...register(name)} />
        <button
          className={classes}
          onClick={() => {
            document.getElementById(name)?.click();
          }}
        >
          {iconElement}
          {placeHolder}
        </button>
        {base64File && (<FaCheck color="green" size={30} />)}
      </div>
    </div>
  );
}
