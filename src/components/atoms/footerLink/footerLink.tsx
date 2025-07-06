import { RouteItem } from "@/types/menu";

export default function FooterLink({ route }: { route: RouteItem }) {
    const target = route.target ? "_blank":"_self";
    const rel = route.target ? "noreferrer noopener":"_self";
    return (
        <li className="mb-3">
            <a href={route.slug} target={target} rel={rel} className={``}>
                {route.title}
            </a>
        </li>
    )
}