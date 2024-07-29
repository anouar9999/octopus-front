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
        <span className="inline-block rounded-full bg-blue-600 p-2 sm:p-3 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        </span>
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

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          href={link}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          Find out more
          <span className="ml-1 transition-transform duration-200 transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
};

export default GridPortals;