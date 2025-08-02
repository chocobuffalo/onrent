"use client";
import { RouteItem } from "@/types/menu";
import Link from "next/link";
import "./headerLinks.scss";
// import { auth } from "@/auth";
import { useUIAppSelector } from "@/libs/redux/hooks";

export default function HeaderLinks({
  links,
  isMobile,
  isTopColor,
}: {
  links: RouteItem[];
  isMobile: boolean;
  isTopColor: boolean;
}) {
  // check is login

  const useSelelector = useUIAppSelector;
  const isLogin = useSelelector((state) => state.auth.isLogin);
  const mobileStyle =
    "block px-3 py-2 text-primary hover:text-secondary hover:bg-gray-50 rounded-md transition-colors duration-300";
  const desktopStyle = isTopColor
    ? "desktop text-white hover:text-secondary transition-colors duration-300"
    : "text-gray-100 hover:text-primary transition-colors duration-300";
  return (
    <>
      {links.map((link: RouteItem) => {
        return link.protected == false || isLogin == link.isLogged ? (
          <li key={link.id}>
            <Link
              href={link.slug}
              className={`${isMobile ? mobileStyle : desktopStyle} ${
                link.extraClass && link.extraClass
              }`}
            >
              {link.title}
            </Link>
          </li>
        ) : null;
      })}
    </>
  );
}
