import React, { useState, useEffect } from "react";
import { topMenu } from "@/constant/data";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { useSelector } from "react-redux";

const HorizontalMenu = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const isAdmin = userData?.user?.is_admin ?? false;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  const isMenuItemVisible = (item) => {
    if (item.title === "admin Management") {
      
      return userData?.user?.is_superuser === true;
    }
    return true; // Show all other menu items
  };

  const renderMenuItem = (item, index) => {
    if (!isMenuItemVisible(item)) return null;

    return (
      <li
        key={index}
        className="relative group"
        onMouseEnter={() => handleDropdownToggle(index)}
        onMouseLeave={() => handleDropdownToggle(null)}
      >
        {!item.child && !item.megamenu ? (
          <Link href={item.link} className="flex items-center px-4 py-2 text-sm font-medium text-[#0B77B7] hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 ease-in-out">
            <Icon icon={item.icon} className="w-5 h-5 mr-2" />
            <span>{item.title}</span>
          </Link>
        ) : (
          <>
            <button
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 ease-in-out"
              onClick={() => handleDropdownToggle(index)}
            >
              <Icon icon={item.icon} className="w-5 h-5 mr-2" />
              <span>{item.title}</span>
              <Icon icon="heroicons-outline:chevron-down" className="w-4 h-4 ml-1" />
            </button>

            {item.child && activeDropdown === index && (
              <ul className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none">
                {item.child.map((childItem, childIndex) => (
                  <li key={childIndex}>
                    <Link href={childItem.childlink} className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
                      <Icon icon={childItem.childicon} className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                      {childItem.childtitle}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {item.megamenu && activeDropdown === index && (
              <div className="absolute left-0 mt-2 w-screen max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                  {item.megamenu.map((megaItem, megaIndex) => (
                    <div key={megaIndex} className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{megaItem.megamenutitle}</h3>
                      <ul className="space-y-2">
                        {megaItem.singleMegamenu.map((singleItem, singleIndex) => (
                          <li key={singleIndex}>
                            <Link href={singleItem.m_childlink} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 ease-in-out">
                              {singleItem.m_childtitle}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </li>
    );
  };

  return (
    <nav className=" dark:bg-gray-800 ">
      <ul className="flex items-center justify-center space-x-1 py-2">
        {topMenu.map((item, index) => renderMenuItem(item, index))}
      </ul>
    </nav>
  );
};

export default HorizontalMenu;