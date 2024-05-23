'use client'

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import ProgressBar from "@/components/ui/ProgressBar";
import { removeProject, updateProject } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/constant/data";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ProjectGrid = ({ project }) => {
  const { name, progress, status, members, assignee, des, startDate, endDate } =
    project;
  const dispatch = useDispatch();

  const [start, setStart] = useState(new Date(startDate));
  const [end, setEnd] = useState(new Date(endDate));
  const [totaldays, setTotaldays] = useState(0);

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const router = useRouter();
  // handleClick to view project single page
  const handleClick = (project) => {
    router.push(`/analytics/edit-project`);
  };

  return (
    <div class="mb-6 rounded-lg bg-white p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img
          class="mr-2 h-5 w-5 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="profile"
        />
        <div>
          <p class="text-base text-xs font-semibold text-gray-600 ">
            Alex Stanton
          </p>
          <span class="block text-xs  text-gray-500 ">{name}</span>
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
            {/* <Menu.Item onClick={() => handleClick(project)}>
              <div
                className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                 w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                   capitalize rtl:space-x-reverse"
              >
                <span className="text-base">
                  <Icon icon="heroicons:eye" />
                </span>
                <span className="font-sans">View</span>
              </div>
            </Menu.Item> */}
        
              <div>
                <Menu.Item onClick={() => handleClick()}>
                  <div
                    className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                 w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                   capitalize rtl:space-x-reverse"
                  >
                    <span className="text-base">
                      <Icon icon="heroicons-outline:pencil-alt" />
                    </span>
                    <span className="font-sans">Edit</span>
                  </div>
                </Menu.Item>
                <Menu.Item
                  onClick={() => dispatch(removeProject(project.id))}
                >
                  <div
                    className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                 w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                   capitalize rtl:space-x-reverse"
                  >
                    <span className="text-base">
                      <Icon icon="heroicons-outline:trash" />
                    </span>
                    <span className="font-sans">Delete</span>
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
        <Link href={"/project"}>
          <h6 className="   text-gray-900">
          Création d'une plateforme collaborative{" "}
          </h6>
        </Link>
        <div className="flex space-x-4 rtl:space-x-reverse pt-4">
{/* start date */}
<div>
  <span className="block date-label ">Start date</span>
  <span className="inline-flex items-center rounded-md bg-blue-50  px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          21 Sept 2024
        </span>
</div>
{/* end date */}

<div>
  <span className="block date-label   ">End date</span>
  <span className="inline-flex items-center rounded-md bg-red-100  px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
          2 july 2024
        </span>
</div>
<div>
  <span className="block date-label   "> Status</span>
  <span className="inline-flex items-center rounded-md bg-red-100  px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
         High Proprity
        </span>
</div>
</div>

       

      </div>
     
    </div>
    <h6 class="text-xs   mt-3 text-gray-700 ">Progress</h6>

    <div className="w-full bg-gray-200 mt-1 rounded-full dark:bg-gray-700">
      <div
        className="bg-green-600  text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={{ width: "45%" }}
      >
        {" "}
        45%
      </div>
    </div>

    <span className="inline-flex items-center font-semibold mt-2 space-x-1 text-xs float-right mt-3 text-danger-600   text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
      <span>
        {" "}
        <Icon icon="heroicons-outline:clock" />
      </span>
      <span className="font-semibold">{totaldays}</span>
      <span className="text-xs float-right   text-danger-600">days left</span>
    </span>
  </div>
  );
};

export default ProjectGrid;
