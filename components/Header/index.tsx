"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownTogglers, setDropdownTogglers] = useState<{ [key: number]: boolean }>({});
  const [stickyMenu, setStickyMenu] = useState(false);

  const pathUrl = usePathname();

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  // Toggle dropdown for specific menu item
  const toggleDropdown = (id: number) => {
    setDropdownTogglers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full ${
        stickyMenu
          ? "bg-[rgb(87,58,114)] py-4 shadow-sm transition duration-100 dark:bg-[rgb(87,58,114)]"
          : "bg-[rgb(87,58,114)] py-4 dark:bg-[rgb(87,58,114)]"
      }`}
    >
      <div className="relative mx-auto max-w-7xl items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="logo"
                width={120}
                height={100}
                className="h-full w-auto"
                priority
              />
            </div>
          </Link>

          {/* Hamburger Toggle BTN */}
          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-6 w-6 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-0 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full delay-300" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "delay-400 w-full" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full delay-500" : "w-0"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-white delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0 delay-0" : "h-full"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-white duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0 delay-200" : "h-0.5"
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        {/* Nav Menu Start */}
        <div
          className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "visible mt-4 h-auto max-h-[400px] rounded-md bg-black p-6 shadow-lg dark:bg-black xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav className="flex-grow">
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-center xl:gap-8">
              {menuData.map((menuItem, key) => (
                <li key={key} className={menuItem.submenu ? "group relative" : ""}>
                {menuItem.submenu ? (
                  <div className="group relative">
                    <div className="flex cursor-pointer items-center justify-between gap-1 text-white group-hover:text-purple-300 dark:text-white dark:group-hover:text-purple-300">
                      {menuItem.title}
                      <span>
                        <svg
                          className="h-3 w-3 cursor-pointer fill-white group-hover:fill-purple-300"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                      </span>
                    </div>
                    <ul
                      className="invisible absolute left-0 top-full z-50 mt-2 w-48 rounded-md bg-white py-2 shadow-lg opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 dark:bg-gray-800"
                    >
                      {menuItem.submenu.map((item, key) => (
                        <li key={key} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Link 
                            href={item.path || "#"} 
                            className="block text-gray-800 hover:text-purple-500 dark:text-white dark:hover:text-purple-300"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    </div>
                  ) : (
                    <Link
                      href={`${menuItem.path}`}
                      className={
                        pathUrl === menuItem.path
                          ? "text-amber-400 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-500"
                          : "text-white hover:text-amber-400 dark:text-white dark:hover:text-amber-400"
                      }
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-7 flex items-center gap-4 xl:mt-0">
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;