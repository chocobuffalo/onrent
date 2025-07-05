import Image from "next/image";
import Link from "next/link";

export default function FrontendLogo(){
    return(
       <div className="text-2xl font-bold text-white">
            <Link href="/">
                <Image className="img-responsive" src="/white-logo.svg" alt="Logo" width={150} height={100} />
            </Link>
        </div>
    )
}