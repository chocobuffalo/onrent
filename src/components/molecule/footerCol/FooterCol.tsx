import FooterLink from "@/components/atoms/footerLink/footerLink";
import { RouteItem } from "@/types/menu";

export function FooterCol({ title,routes }: { title: string,routes:RouteItem[] }) {
    return (
        <div className="col-span-1">
            <h2 className="text-lg font-bold">
                {title}
            </h2>
            <ul className="footer-links">
                {
                    routes.map(route=><FooterLink key={route.id} route={route}/>)
                }
            </ul>
        </div>
    )
}