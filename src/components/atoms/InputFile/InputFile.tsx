// components/atoms/InputFile/InputFile.tsx (EJEMPLO)
interface InputFileProps {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
  }
  
  const InputFile = ({ label, onChange, disabled }: InputFileProps) => (
    <div className="mb-3">
      <label htmlFor="videoFile" className="form-label">{label}</label>
      <input 
        type="file" 
        className="form-control" 
        id="videoFile"
        accept="video/*" 
        onChange={onChange} 
        disabled={disabled} 
      />
    </div>
  );
  export default InputFile;