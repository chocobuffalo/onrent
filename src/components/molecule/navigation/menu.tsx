import * as React from "react";
import { Link } from "react-router-dom";

import { Icons } from "../ui/Icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { router } from "../../router";

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Icons.bars className="w-4 h-4 mr-2 fill-black dark:fill-white " />{" "}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="shadow-lg gap-3rounded bg-popover text-popover-foreground">
            <ul className="grid w-[300px] ">
              {router.map((item) => {
                return (
                  <ListItem className="w-full" key={item.path}>
                    <Link
                      className="block w-full p-3 text-center transition-colors border-b transition-duration-300 border-b-slate-200 dark:border-b-slate-700 dark:hover:bg-slate-600 hover:bg-accent hover:text-accent-foreground"
                      to={item.path}
                    >
                      {item.name}
                    </Link>
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  className: string;
}) => {
  return <li {...props}>{children}</li>;
};
