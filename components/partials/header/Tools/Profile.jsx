import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/components/partials/auth/store";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { isAdmin } from "@/constant/data";
import {userData } from '@/components/partials/auth/store';

const AvatarLetter = ({ username }) => {
  const firstLetter = username?.charAt(0)?.toUpperCase() || '';

  return (
    <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
      <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full bg-[#074e78] text-white flex items-center justify-center">
        <span className="text-sm font-medium">{firstLetter}</span>
      </div>
    </div>
  );
};

const ProfileLabel = () => {
  const [isMounted, setIsMounted] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
        <AvatarLetter username={userData?.user?.username} />

        </div>
      </div>
      <div className="flex-none text-[#0B77B7]  text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis  whitespace-nowrap w-[85px] block">
          {userData?.user?.username || "No name available"}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down" />
        </span>
      </div>
    </div>
  );
};



const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const ProfileMenu = [
    // {
    //   label: "Profile",
    //   icon: "heroicons-outline:user",

    //   action: () => {
    //     router.push("/profile");
    //   },
    // },
    // {
    //   label: "Chat",
    //   icon: "heroicons-outline:chat",
    //   action: () => {
    //     router.push("/chat");
    //   },
    // },
    // {
    //   label: "Email",
    //   icon: "heroicons-outline:mail",
    //   action: () => {
    //     router.push("email");
    //   },
    // },
    // {
    //   label: "Todo",
    //   icon: "heroicons-outline:clipboard-check",
    //   action: () => {
    //     router.push("/todo");
    //   },
    // },
    // {
    //   label: "Settings",
    //   icon: "heroicons-outline:cog",
    //   action: () => {
    //     router.push("/settings");
    //   },
    // },
    // {
    //   label: "Price",
    //   icon: "heroicons-outline:credit-card",
    //   action: () => {
    //     router.push("/pricing");
    //   },
    // },
    // {
    //   label: "Faq",
    //   icon: "heroicons-outline:information-circle",
    //   action: () => {
    //     router.push("/faq");
    //   },
    // },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
     dispatch(handleLogout());
     router.push('/login');
      },
    },
  ];

  return (
    <Dropdown label={ProfileLabel()} classMenuItems="w-[180px] top-[58px]">
      
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
                } block     ${item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
                }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm text-[#0B77B7]">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
