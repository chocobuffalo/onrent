import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { blogPages, homepages, listingPages, otherPages } from "@/constants/data/menu";
import { LinkInterface, ListinsMenu, ListinsMenuInterface, Menu } from "@/types/menu";


export default function Nav() {
  const  pathname  = usePathname();
  const isActive = (menus:Menu) => {

    let active = false;

    menus.forEach((elm:ListinsMenu) => {
      if ('links' in elm && Array.isArray((elm as ListinsMenuInterface).links)) {
        ((elm as ListinsMenuInterface).links as LinkInterface[]).forEach((elm2: LinkInterface) => {
          if (elm2.href.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        });
      } else if ('href' in elm) {
        if ((elm as LinkInterface).href.split("/")[1] == pathname.split("/")[1]) {
          active = true;
        }
      }
    });
    return active;
  };
  return (
    <>
      <li
        className={`tf-megamenu dropdown2 ${
          isActive(homepages) ? "current" : ""
        } `}
      >
        <a href="#">Home</a>
        <ul>
          {homepages.map((page, index) =>
            "href" in page ? (
              <li
                key={index}
                className={
                  page.href.split("/")[1] == pathname.split("/")[1]
                    ? "current"
                    : ""
                }
              >
                <Link href={page.href}>{page.text}</Link>
              </li>
            ) : null
          )}
        </ul>
      </li>
      <li
        className={`tfcl-mega-menu dropdown2  ${
          isActive(listingPages) ? "current" : ""
        } `}
      >
        <a href="#">Listing Car</a>
        <ul>
          {listingPages.map((item, index) => (
            <li key={index} className={item.className}>
              <a href="#">{item.title}</a>
              <ul>
                {item.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className={`${link.className || ""} ${
                      link.href.split("/")[1] == pathname.split("/")[1]
                        ? "current"
                        : ""
                    }`}
                  >
                    <Link href={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
              <div className="dropdown2-btn" />
            </li>
          ))}
        </ul>
      </li>
      <li className={`dropdown2  ${isActive(otherPages) ? "current" : ""} `}>
        <a href="#">Page</a>
        <ul>
          {otherPages.map((item, index) => (
            <li
              key={index}
              className={`${item.className || ""}  ${
                item.links ? (isActive(item.links) ? "current" : "") : ""
              } ${
                item.href?.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }`}
            >
              {item.title ? (
                <>
                  <a href="#">{item.title}</a>
                  <ul>
                    {item.links.map((link, linkIndex) => (
                      <li
                        key={linkIndex}
                        className={
                          link.href.split("/")[1] == pathname.split("/")[1]
                            ? "current"
                            : ""
                        }
                      >
                        <Link href={link.href}>{link.text}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="dropdown2-btn" />
                </>
              ) : (
                <Link href={item.href || ''}>{item.text}</Link>
              )}
            </li>
          ))}
        </ul>
      </li>
      <li className={`dropdown2  ${isActive(blogPages) ? "current" : ""} `}>
        <a href="#">Blog</a>
        <ul>
          {blogPages.map((item, index) => (
            <li
              key={index}
              className={
                item.href.split("/")[1] == pathname.split("/")[1]
                  ? "current"
                  : ""
              }
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          ))}
        </ul>
      </li>
      <li className={"contact" == pathname.split("/")[1] ? "current" : ""}>
        <Link href={`/contact`}>Contact</Link>
      </li>
    </>
  );
}
