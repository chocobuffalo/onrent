"use client";
import { RouteItem } from "@/types/menu";
import Link from "next/link";
import "./headerLinks.scss";
import { useSession } from "next-auth/react";
import useLogout from "@/hooks/frontend/auth/logout/useLogout";

export default function HeaderLinks({
  links,
  isMobile,
  isTopColor,
  onLinkClick, 
}: {
  links: RouteItem[];
  isMobile: boolean;
  isTopColor: boolean;
  onLinkClick?: () => void;  
}) {
  const { data: session, status } = useSession();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

  const isLogin = status === "authenticated";

  const mobileStyle =
    "block px-3 py-2 text-primary hover:text-secondary hover:bg-gray-50 rounded-md transition-colors duration-300";
  const desktopStyle = isTopColor
    ? "desktop text-white hover:text-secondary transition-colors duration-300"
    : "text-gray-100 hover:text-primary transition-colors duration-300";
  
  const logoutMobileStyle = 
    "block px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-300";
  const logoutDesktopStyle = isTopColor
    ? "desktop text-red-300 hover:text-red-500 transition-colors duration-300"
    : "text-red-400 hover:text-red-600 transition-colors duration-300";

  return (
    <>
      {links.map((link: RouteItem) => {
        return link.protected == false || isLogin == link.isLogged ? (
          link.name === 'logout' ? (
            <li key={link.id}>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`${
                  isMobile ? logoutMobileStyle : logoutDesktopStyle
                } ${link.extraClass && link.extraClass} ${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoggingOut ? 'Cerrando...' : link.title}
              </button>
            </li>
          ) : (
            <li key={link.id}>
              <Link
                href={link.slug}
                onClick={onLinkClick} 
                className={`${isMobile ? mobileStyle : desktopStyle} ${
                  link.extraClass && link.extraClass
                }`}
              >
                {link.title}
              </Link>
            </li>
          )
        ) : null;
      })}
    </>
  );
}