'use client'

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const ProjectGrid = ({ project ,param}) => {
  const { id ,title, progress, tag, members, assign, des, start_date, end_date } =
    project;
  const dispatch = useDispatch();
  const reload = useRouter();
  const userData = useSelector((state) => state.auth.userData);

  const [start, setStart] = useState(new Date(start_date));
  const [end, setEnd] = useState(new Date(end_date));
  const [totaldays, setTotaldays] = useState(3);
  const isAdmin = userData?.user?.is_admin || false;

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const router = useRouter();
  // handleClick to view project single page
  const handleClick = (projectId) => {
    router.push(`/admin-portal/${param.id}/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/edit-project/${projectId}/`);
  };
  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete/${projectId}/`);
      if (response.status === 204) {
        console.log('Project deleted successfully');
        toast.error("Project deleted  successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
       setTimeout(() => {
        window.location.reload();
       }, 1600);
      } else {
        console.error('Error deleting project:', response.data);
        // Handle the error according to your application's requirements
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Handle the error according to your application's requirements
    }
  };

  return (
    <div class="mb-6 rounded-lg bg-white p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div>
            <Link href={isAdmin ? 
              `/admin-portal/${param.id}/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/single-project/${id}`:
              `/portals/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/single-project/${id}`}>
              <h6 className="leading-tight text-gray-900">
                {title}{""}
              </h6>
            </Link>
            <span class="block text-xs text-gray-500"></span>
          </div>
        </div>
        {isAdmin && (
          <div>
            <Dropdown
              classMenuItems=" w-[130px]"
              label={
                <span className=" font-sans text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div>
                <div>
                  <Menu.Item onClick={() => handleClick(id)}>
                    <div
                      className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                 w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                   capitalize rtl:space-x-reverse"
                    >
                      <span className="text-base">
                        <Icon icon="heroicons-outline:pencil-alt" />
                      </span>
                      <span>Edit</span>
                    </div>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>deleteProject(id)}
                  >
                    <div
                      className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                 w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                   capitalize rtl:space-x-reverse"
                    >
                      <span className="text-base">
                        <Icon icon="heroicons-outline:trash" />
                      </span>
                      <span>Delete</span>
                    </div>
                  </Menu.Item>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
      </div>

      <div className="flex space-x-4 rtl:space-x-reverse mt-3 ">
        <div class="card__body mt-2">
          <div className="flex flex-wrap gap-3 mb-2">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1">
              <Icon icon="heroicons-outline:calendar" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{start_date}</span>
            </div>
            <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 rounded-full px-3 py-1">
              <Icon icon="heroicons-outline:calendar" className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">{end_date}</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900 rounded-full px-3 py-1">
              <Icon icon="heroicons-outline:exclamation" className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">High Priority</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-end items-center  text-sm font-medium text-gray-500 dark:text-gray-400">
        <Icon icon="heroicons-outline:clock" className="w-4 h-4 mr-1" />
        <span>{totaldays} days left</span>
      </div>
    </div>
  );
};

export default ProjectGrid;