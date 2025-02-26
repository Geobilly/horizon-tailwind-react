/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes
      .filter((route) => !route.hideInSidebar) // Filter out routes with hideInSidebar: true
      .map((route, index) => {
        if (
          route.layout === "/admin" ||
          route.layout === "/auth" ||
          route.layout === "/rtl"
        ) {
          return (
            <Link key={index} to={route.layout + "/" + route.path}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index}
                >
                  <span
                    className={`${
                      activeRoute(route.path)
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
  className={`leading-1 ml-4 flex ${
    activeRoute(route.path)
      ? "font-bold text-gray-900 dark:text-white"
      : "font-medium text-gray-600 dark:text-white"
  }`}
>
  {route.name}
</p>

                </li>
                {activeRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
            </Link>
          );
        }
        return null; // Ensure no undefined values are returned
      });
  };

  // BRAND
  return <>{createLinks(routes)}</>; // Wrap in a fragment
}

export default SidebarLinks;
