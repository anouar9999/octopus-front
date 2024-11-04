import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useSelector } from "react-redux";

const Breadcrumbs = () => {
  const location = usePathname();
  const router = useRouter();
  const locationParts = location.split("/").filter((part) => part);
  const clickableItems = ["portals", "sub-portal", "cities"];
  const [isHide, setIsHide] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = userData?.user?.is_admin;
      setIsAdmin(adminStatus);
      if (!adminStatus && location.startsWith("/admin")) {
        router.push("/unauthorized");
      }
    };
    checkAdminStatus();
    setIsHide(false);
  }, [location, router, userData]);

  if (isHide || isAdmin === null) {
    return null;
  }

  const isItemClickable = (part, index) => {
    const adminPortalIndex = locationParts.indexOf("admin-portal");
    const allProjectsIndex = locationParts.indexOf("all-projects");
    return (
      clickableItems.includes(part) ||
      (adminPortalIndex !== -1 && index === adminPortalIndex + 1) ||
      (allProjectsIndex !== -1 && index === allProjectsIndex + 1)
    );
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (isAdmin) {
      router.push("/clients");
    } else {
      router.push("/portals");
    }
  };

  return (
    <nav className="rounded-lg p-2 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <a
            href="#"
            onClick={handleHomeClick}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
          >
            <Home className="w-5 h-5 mr-1" />
            <span className="sr-only">Home</span>
          </a>
        </li>
        {locationParts.map((part, index) => {
          const isLast = index === locationParts.length - 1;
          const href = `/${locationParts.slice(0, index + 1).join("/")}`;
          const isClickable = isItemClickable(part, index);
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {isClickable ? (
                <Link
                  href={href}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 capitalize font-medium"
                >
                  {part.replace(/-/g, " ")}
                </Link>
              ) : (
                <span
                  className={`capitalize font-medium ${
                    isLast ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {part.replace(/-/g, " ")}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
