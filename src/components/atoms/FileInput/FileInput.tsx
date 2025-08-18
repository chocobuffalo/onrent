/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFileConvert } from "@/hooks/component/useFileConvert";
import DocIcon from "../customIcons/docIcon";
import { FaCheck } from "react-icons/fa6";

export default function FileInput({
  name,
  label,
  register,
  placeHolder,
}: {
  name: string;
  label: string;
  placeHolder: string;
  register?: any;
}) {
  const { convertFileToBase64,base64File } = useFileConvert();
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
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
      <div className="flex gap-3 items-center">
        <input type="hidden" value={base64File} {...register(name)} />
        <button
          className="d-flex gap-2 form-control w-fit max-w-[200px]"
          onClick={() => {
            document.getElementById(name)?.click();
          }}
        >
          {placeHolder}
          <DocIcon />
        </button>
        {base64File && (<FaCheck color="green" size={30} />)}
      </div>
    </div>
  );
}
