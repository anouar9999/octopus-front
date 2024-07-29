import React, { useEffect, useState } from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";

const Logo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDark] = useDarkMode();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  const logoSrc = isDark ? "/assets/images/logo.png" : "/assets/images/logo.png";
  const companyLogoSrc =
    userData?.companies?.[0]?.CompanyImage
      ? `${process.env.NEXT_PUBLIC_API_URL}/${userData.companies[0].CompanyImage}`
      : "/assets/images/default-company-logo.png";

  return (
    <div className="flex items-center">
      {/* First logo */}
     

      {/* "X" */}
      {userData?.user?.is_admin ? (
        <div> <a className="flex-shrink-0">
        <img
          src={logoSrc}
          alt="Company Logo"
          width={56} // reduced width
          height={80} // reduced height
          className="object-contain"
        />
      </a></div>
      ) : (
        <>

          {/* Second logo */}
          <a className="flex-shrink-0 w-32">
            <img
              src={companyLogoSrc}
              alt="User Company Logo"
              width={120} // reduced width
              height={120} // reduced height
              className="object-contain"
            />
          </a>
        </>
      )}
    </div>
  );
};

export default Logo;
