import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  // semi dark option
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div className={isSemiDark ? "dark" : ""}>
    <div
      className={`sidebar-wrapper bg-white dark:bg-slate-800 ${
        collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
      }
      ${menuHover ? "sidebar-hovered" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
      onMouseEnter={() => {
        setMenuHover(true);
      }}
      onMouseLeave={() => {
        setMenuHover(false);
      }}
    >
      <SidebarLogo menuHover={menuHover} />
      <div
        className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
          scroll ? " opacity-100" : " opacity-0"
        }`}
      ></div>
  
      <SimpleBar
        className="sidebar-menu px-4 h-[calc(100%-80px)]"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <Navmenu menus={menuItems} />
  
        {/* Pinned Projects Section */}
        {!collapsed && (
          <div className="bg-slate-900 mb-16 mt-4 p-4 relative text-center rounded-2xl text-white">
            <h2 className="text-lg font-semibold mb-2">Pinned Projects</h2>
            {/* Replace with your list of pinned projects */}
            <ul>
              <li className="mb-2">
                <a href="#" className="text-white hover:underline">
                  Project 1
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white hover:underline">
                  Project 2
                </a>
              </li>
              {/* Add more pinned projects as needed */}
            </ul>
          </div>
        )}
  
        <div className="bg-slate-900 mb-16 mt-24 p-4 relative text-center rounded-2xl text-white">
          <img
            src="/assets/images/svg/rabit.svg"
            alt=""
            className="mx-auto relative -mt-[73px]"
          />
          <div className="max-w-[160px] mx-auto mt-6">
            <div className="widget-title">Unlimited Access</div>
            <div className="text-xs font-light">
              Upgrade your system to business plan
            </div>
          </div>
          <div className="mt-6">
            <button className="btn bg-white hover:bg-opacity-80 text-slate-900 btn-sm w-full block">
              Upgrade
            </button>
          </div>
        </div>
      </SimpleBar>
    </div>
  </div>
  
  );
};

export default Sidebar;
