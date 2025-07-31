export default function Input({ label, type = "text",name, placeHolder, register, errors }:{
    label: string;
    type: string;
    name: string;
    placeHolder: string;
    register: any;
    errors: any;
}) {

    return(

         <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                {...register(name)}
                type={type}
                className="form-control mb-1"
                placeholder={placeHolder}
            />
            {errors[name] && (
                <span className="text-danger">{errors[name].message}</span>
            )}
        </div>
    )

}