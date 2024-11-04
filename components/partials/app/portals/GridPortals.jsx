import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openPortalModal } from "./store";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";

const GridPortals = ({ portal, link, handleDelete, handleUpdate }) => {
  const { id, name, description } = portal;
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = userData?.user?.is_admin;

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  return (
    <article
      key={id}
      className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-md transition hover:shadow-lg hover:border-black-300 sm:p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-10 flex items-center justify-center">
              <Icon 
                icon="heroicons-outline:template"
                className="w-6 h-6 text-blue-500"
              />
            </div>
        {isAdmin && (
          <Dropdown
            classMenuItems="w-40"
            label={
              <span className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <Icon icon="heroicons-outline:dots-vertical" className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            }
          >
            <Menu.Item onClick={() => handleUpdate()}>
              <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                <Icon icon="heroicons-outline:pencil-alt" className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => handleDelete()}>
              <div className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                <Icon icon="heroicons-outline:trash" className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </div>
            </Menu.Item>
          </Dropdown>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        <a href="#" className="hover:text-blue-600 transition-colors duration-200">{name}</a>
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3 sm:text-base">{description}</p>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <Link
          href={link}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <span>Find out More</span>
          <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <Icon 
              icon="heroicons-outline:arrow-right" 
              className="w-4 h-4" 
            />
          </div>
        </Link>
      </div>
    </article>
  );
};

export default GridPortals;
