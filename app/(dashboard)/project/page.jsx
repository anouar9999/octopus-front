"use client";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

import { Menu, Tab, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import TodoPage from "../(app)/todo/page";
import BasicMap from "@/components/partials/map/basic-map";
import "./styles.css";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import ImageModal from "../../../components/partials/ImageModal";
import Comments from "@/components/partials/comments";
import Gallery from "@/components/partials/gallery";
import Button from "@/components/ui/Button";
import { isAdmin } from "@/constant/data";
import Link from "next/link";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const buttons = [
  {
    title: "Reparage",
    icon: "heroicons-outline:home",
  },
  {
    title: "Maquette",
    icon: "heroicons-outline:user",
  },
  {
    title: "Realisation et suivie",
    icon: "heroicons-outline:chat-alt-2",
  },
  {
    title: "Commentaire",
    icon: "heroicons-outline:cog",
  },
];

const ProjectPage = () => {
  return (
    <div>
      {/* <HomeBredCurbs title="Project Detail" /> */}
      <div className="relative bg-gradient-to-r from-slate-900 to-cyan-900 h-40 rounded-lg overflow-hidden shadow-lg transform transition duration-500 scale-105">
  <div className="absolute bottom-3 left-5 text-white pb-6 pl-4 z-10">
    <div className="flex items-center">
      <h4 className="text-5xl md:text-3xl font-bold sans-serif text-white">
        Analog and Digital Modulation
      </h4>
      <div className="ml-6">
        <div className="w-48 bg-gray-200 mt-1 rounded-full dark:bg-gray-700">
          <div
            className="bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: "30%" }}
          >
            {" "}
          </div>
        </div>
      </div>
      <span className="text-sm ml-4 text-gray-400">
        <span className="font-bold text-white">82 % </span> completed activity
      </span>
    </div>
    <div className="flex space-x-4 rtl:space-x-reverse pt-4">
      {/* start date */}
      <div>
        {/* <span className="block date-label ">Start date</span> */}
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Starts In : {"\t"}{" "}
          <span className="text-black font-semibold pl-1">
            {" "}
            2 July 2024{" "}
          </span>
        </span>
      </div>
      {/* end date */}
      <div>
        {/* <span className="block date-label   ">End date</span> */}
        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
          Ends In : {"\t"}{" "}
          <span className="text-black font-semibold pl-1">
            {" "}
            2 July 2024{" "}
          </span>
        </span>
      </div>
      <div>
        {/* <span className="block date-label  text-white "> status</span> */}
        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
          Status : {"\t"}{" "}
          <span className="text-black font-semibold pl-1">
            {" "}
            High Priority
          </span>
        </span>
      </div>
    </div>
  </div>
  <span className="text-sm ml-4 text-gray-400 absolute bottom-5 right-12">
    Associate with {" "}<Link href={'/profile'} className="font-bold text-white">Nom de la société</Link>
  </span>
</div>


    
      <div >
     
        <Card>
          
     <div className="my-4 mb-11 ">
     <span className="font-semibold text-lg	text-black inline-flex my-2">Description </span>
          <br />
          <span
            className="text-sm   text-gray-700 my-4  "
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.Illum nulla
            rem distinctio laudantium aut impedit fuga incidunt nihil officiis
            ad eum dolorum reprehenderit quo, eius perferendis culpa rerum est
            modi!
          </span>
     </div>
          <Tab.Group>
            <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse ">
              {buttons.map((item, i) => (
                <Tab as={Fragment} key={i}>
                  {({ selected }) => (
                    <button
                      className={` inline-flex items-start text-sm  	 mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[2px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${
                selected
                  ? "text-primary-500 before:w-full  font-semibold "
                  : "text-slate-500 before:w-0 dark:text-slate-300 font-semibold"
              }
              `}
                    >
                      <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                        <Icon icon={item.icon} />
                      </span>
                      {item.title}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <BasicMap />
              </Tab.Panel>
              <Tab.Panel>
                <Gallery />
              </Tab.Panel>
              <Tab.Panel>
                <TodoPage />
              </Tab.Panel>
              <Tab.Panel>
                <Comments />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </div>
  );
};

export default ProjectPage;
