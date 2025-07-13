import Image from "next/image";


export default function DashboardLogo({color}:{color:'white'|'dark'}){
  const noColor = color ? color : 'white' 
  const colorClass = noColor === 'white' ? 'text-white' : 'text-dark';
    return(
      <div className="db-content db-logo pad-30">
        <a href={`/`} className="d-flex gap-2" title="OnRentX">
          <Image
            className="site-logo"
            alt="autodecar"
            src="/favicon.png"
            width={40}
            height={40}
          />
          <h2 className={colorClass}>OnRentX</h2>
        </a>
      </div>
    )
}