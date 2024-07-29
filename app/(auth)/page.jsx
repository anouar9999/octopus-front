"use client";
import Link from "next/link";
import LoginForm from "@/components/partials/auth/login-form";
import Social from "@/components/partials/auth/social";
import useDarkMode from "@/hooks/useDarkMode";
import '../globals.css'
// image import

const Login = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <Link href="/">
                <img
                  src={
                    isDark
                      ? "/assets/images/logo.png"
                      : "/assets/images/logo.png"
                  }
                  alt=""
                  className="mb-10 w-14"
                />
              </Link>
              <h4 >
                Unlock your Project{" "}
                <span className="text-slate-800 dark:text-slate-400 font-bold ">
                  Performance
                </span>
              </h4>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
              <img
                src="/assets/images/auth/ils1.svg"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? "/assets/images/logo.png"
                          : "/assets/images/logo.png"
                      }
                      alt=""
                      className="mx-auto w-20"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="">Log in</h4>
                  <div className="text-slate-500 text-base">
                  Log in to your account to start using Genius CRM
                  </div>
                </div>
                <LoginForm />
                
                
            
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
