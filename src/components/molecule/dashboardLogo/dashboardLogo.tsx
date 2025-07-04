import Image from "next/image";
import Link from "next/link";

export default function DashboardLogo(){
    return(
        <div className="db-content db-logo pad-30">
                  <Link href={`/dashboard`} className="d-flex gap-2" title="OnRentX">
                    <Image
                      className="site-logo"
                      alt="autodecar"
                      src="/favicon.png"
                      width={40}
                      height={40}
                    />
                    <h2 className="text-white">OnRentX</h2>
                  </Link>
                </div>
    )
}