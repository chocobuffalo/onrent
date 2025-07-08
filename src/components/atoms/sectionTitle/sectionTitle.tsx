export default function SectionTitle({title,extraClass}:{title:string,extraClass?:string}){
    const classes = extraClass ? ` ${extraClass}` : '';
    return(
        <h2 className={`text-3xl font-bold pb-8 ${classes}`}>{title}</h2>
    )
}