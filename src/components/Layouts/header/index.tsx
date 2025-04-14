"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { NAV_DATA } from "../sidebar/data";
import { NAV_DATA_2 } from "../sidebar/traderData";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function HeaderDashboard() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const [isOpen, setIsOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState<any>();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    const role = Cookies.get('role');
    if(role === "trader"){
      // setHeaderTitle(NAV_DATA_2);
    }
    else{
      setHeaderTitle(NAV_DATA);
    }
  }, [pathname]);

  return (  
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-3.5 shadow-sm dark:border-stroke-dark/50 md:px-6 2xl:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95"
        >
          {/* Hamburger Icon - shows when menu is closed */}
          <div className={`space-y-1.5 transition-all ${isMenuOpen ? 'hidden' : 'block'}`}>
            <span className="block w-5 h-0.5 bg-dark dark:bg-white rounded-full transition-transform"></span>
            <span className="block w-5 h-0.5 bg-dark dark:bg-white rounded-full transition-transform"></span>
            <span className="block w-5 h-0.5 bg-dark dark:bg-white rounded-full transition-transform"></span>
          </div>
          {/* Close Icon - shows when menu is open */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'}`}>
            <span className="block w-5 h-0.5 bg-dark dark:bg-white rounded-full rotate-45 translate-y-1.5 transition-transform"></span>
            <span className="block w-5 h-0.5 bg-dark dark:bg-white rounded-full -rotate-45 -translate-y-1.5 transition-transform"></span>
          </div>
        </button>

        <div className="flex flex-row items-center gap-4 justify-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold relative group">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              Freedom Tracker
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
          </h3>
        </div>
      </div>

      <div className="hidden md:flex flex-row items-center justify-center gap-1 lg:gap-4">
        {
          headerTitle?.map((items: any) => (
            items.items.map((item: any) => (
              <Link 
                href={item.url} 
                key={item.title}
                className={`
                  px-3.5 py-2 
                  text-sm lg:text-base 
                  font-medium
                  rounded-lg
                  transition-all duration-200
                  hover:bg-gray-50/80 dark:hover:bg-gray-800/80
                  active:scale-[0.98]
                  ${pathname === item.url 
                    ? 'text-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-lg opacity-80">{item.icon}</span>}
                  <span>{item.title}</span>
                </div>
              </Link>
            ))
          ))
        }
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div 
          className={`
            md:hidden 
            fixed top-[52px] left-0 right-0 
            bg-white/95 dark:bg-gray-900/95 
            backdrop-blur-md
            border-t border-gray-100/50 dark:border-gray-800/50
            shadow-lg 
            transition-all duration-300 ease-in-out
            z-50
            ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          <div className="flex flex-col items-center gap-1 py-3 px-4">
            {
              headerTitle?.map((items: any) => (
                items.items.map((item: any) => (
                  <Link 
                    href={item.url} 
                    key={item.title}
                    className={`
                      w-full 
                      px-4 py-3 
                      text-sm font-medium
                      rounded-lg
                      transition-all duration-200
                      hover:bg-gray-50/80 dark:hover:bg-gray-800/80
                      active:scale-[0.98]
                      ${pathname === item.url 
                        ? 'text-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {item.icon && <span className="text-lg opacity-80">{item.icon}</span>}
                      <span>{item.title}</span>
                    </div>
                  </Link>
                ))
              ))
            }
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-right gap-2 min-[300px]:gap-4">
        <ThemeToggleSwitch />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
