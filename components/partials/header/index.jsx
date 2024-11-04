import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import SwitchDark from "./Tools/SwitchDark";
import HorizentalMenu from "./Tools/HorizentalMenu";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useNavbarType from "@/hooks/useNavbarType";
import useMenulayout from "@/hooks/useMenulayout";
import useSkin from "@/hooks/useSkin";
import useRtl from "@/hooks/useRtl";
import useMobileMenu from "@/hooks/useMobileMenu";
import Logo from "./Tools/Logo";
import SearchModal from "./Tools/SearchModal";
import Profile from "./Tools/Profile";

const Header = ({ className = "custom-class" }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [collapsed, setMenuCollapsed] = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const { width, breakpoints } = useWidth();
  const [navbarType] = useNavbarType();
  const [menuType] = useMenulayout();
  const [skin] = useSkin();
  const [isRtl] = useRtl();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navbarClass = () => {
    switch (navbarType) {
      case "floating":
        return "mt-4 mx-4 rounded-xl shadow-lg";
      case "sticky":
        return "sticky top-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
      default:
        return "sticky top-0";
    }
  };

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  if (!isMounted) return null;

  return (
    <header className={`${className} `}>
      <div 
        className={`
          bg-black
          ${skin === "bordered" ? "border-b border-slate-700" : ""}
          transition-all duration-150
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex h-20 items-center justify-between px-4 md:px-6">
            {/* Left Section */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {menuType === "vertical" && (
                <>
                  {collapsed && width >= breakpoints.xl && (
                    <Button
                      onClick={() => setMenuCollapsed(!collapsed)}
                      className="hover:bg-slate-800 p-2 rounded-lg"
                    >
                      <Icon 
                        icon={isRtl ? "akar-icons:arrow-left" : "akar-icons:arrow-right"}
                        className="text-xl text-white"
                      />
                    </Button>
                  )}
                  {width < breakpoints.xl && <Logo />}
                </>
              )}

              {menuType === "horizontal" && (
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Logo />
                  {width <= breakpoints.xl && (
                    <Button
                      onClick={handleOpenMobileMenu}
                      className="hover:bg-slate-800 p-2 rounded-lg"
                    >
                      <Icon 
                        icon="heroicons-outline:menu-alt-3"
                        className="text-2xl text-white" 
                      />
                    </Button>
                  )}
                </div>
              )}

           
            </div>

            {/* Center Section - Horizontal Menu */}
            {menuType === "horizontal" && 
             width >= breakpoints.xl && 
             userData?.user?.is_admin === true && (
              <div className="flex-1 flex items-center justify-center">
                <HorizentalMenu />
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
             
              
              {width >= breakpoints.md && (
                <Profile />
              )}

              {width <= breakpoints.md && (
                <Button
                  onClick={handleOpenMobileMenu}
                  className="hover:bg-slate-800 p-2 rounded-lg"
                >
                  <Icon 
                    icon="heroicons-outline:menu-alt-3"
                    className="text-2xl text-white" 
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

     
    </header>
  );
};

export default Header;