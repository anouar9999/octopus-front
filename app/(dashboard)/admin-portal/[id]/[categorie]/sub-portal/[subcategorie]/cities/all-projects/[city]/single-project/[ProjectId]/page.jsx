"use client";

import { Fragment, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TodoPage from "@/app/(dashboard)/(app)/todo/page";
import BasicMap from "@/components/partials/map/basic-map";
import Comments from "@/components/partials/comments";
import Gallery from "@/components/partials/gallery";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// import "../../../globals.css";

const buttons = [
  { title: "Reperage", icon: "heroicons-outline:camera", stage: "reperage" },
  { title: "Maquette", icon: "heroicons-outline:cube", stage: "maquette" },
  {
    title: "Dessins Technique",
    icon: "heroicons-outline:pencil-alt",
    stage: "dessins_technique",
  },
  {
    title: "Simulation",
    icon: "heroicons-outline:chart-bar",
    stage: "simulation",
  },
  { title: "Realisation", icon: "heroicons-outline:cog", stage: "realisation" },
  { title: "Suivie", icon: "heroicons-outline:chart-pie" },
  { title: "Commentaire", icon: "heroicons-outline:chat-alt-2" },
];

const ProjectPage = ({ params: { ProjectId } }) => {
  const [project, setProject] = useState({});
  const [enabledTabs, setEnabledTabs] = useState([0, 5, 6]);

  useEffect(() => {
    console.log(ProjectId)
    const fetchProjectAndStages = async () => {
      try {
        const projectResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${ProjectId}/`
        );
        const stagesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${ProjectId}/stages/`
        );

        if (projectResponse.status === 200 && stagesResponse.status === 200) {
          setProject(projectResponse.data);

          // Determine which tabs should be enabled based on stages completion
          const enabledTabsFromStages = stagesResponse.data
            .filter((stage) => stage.completed)
            .map((stage) =>
              buttons.findIndex((button) => button.stage === stage.stage)
            )
            .filter((index) => index !== -1);

          setEnabledTabs([0, ...enabledTabsFromStages, 5, 6]);
        } else {
          throw new Error(
            `Failed to fetch project or stages with ID ${ProjectId}`
          );
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching project and stages:",
          error
        );
      }
    };

    fetchProjectAndStages();
  }, [ProjectId]);

  const enableNextTab = async (currentIndex) => {
    if (currentIndex < buttons.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStage = buttons[nextIndex].stage;

      try {
        // Update the stage completion status in the backend
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${ProjectId}/stages/${nextStage}/`,
          {
            completed: true,
          }
        );

        // If the update is successful, update the local state
        setEnabledTabs((prev) => [...prev, nextIndex]);
      } catch (error) {
        console.error("Error updating stage completion:", error);
        // Handle the error (e.g., show a notification to the user)
      }
    }
  };

  return (
    <div className=" min-h-screen py-2 ">
      <ToastContainer />
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto ">
        <div className="bg-gradient-to-r from-slate-900 to-cyan-900 rounded-xl shadow-2xl mb-8 overflow-hidden">
          <div className="p-8 text-white">
            <h1 className="text-4xl text-white font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex items-center mb-4">
              <div className="w-64 bg-gray-200 rounded-full mr-4">
                <div
                  className="bg-green-500 text-xs font-medium text-green-100 text-center p-1 leading-none rounded-full"
                  style={{ width: `${project.progress}%` }}
                >
                  {project.progress}% Complete
                </div>
              </div>
              <span className="text-sm text-gray-300">
                <span className="font-bold">{project.progress}%</span> completed
                activity
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">
                Starts:{" "}
                <span className="font-semibold">{project.start_date}</span>
              </span>
              <span className="px-3 py-1 bg-red-500 rounded-full text-sm">
                Ends: <span className="font-semibold">{project.end_date}</span>
              </span>
              <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm">
                Status: <span className="font-semibold">High Priority</span>
              </span>
            </div>
          </div>
          <div className="bg-gray-800 p-4 text-right">
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                <Icon
                  icon="heroicons-outline:location-marker"
                  className="w-6 h-6 mr-2 text-green-500"
                />
                Localisation
              </h2>
              <div className="h-60 rounded-2xl overflow-hidden shadow-inner">
              <BasicMap 
              // 
  link={`${project.location}`}
  zoom={15}
  popupContent={
    <div>
      <p>Your location is here !</p>
    </div>
  }
/>
              </div>
            </div>
          </Card>

          <Card className="col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>{" "}
                Description
              </h2>
              {/* Add a timeline component here */}
              <div className="space-y-4">{project.description}</div>
            </div>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
  <div className="p-4 sm:p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Project Details
    </h2>
    <Tab.Group>
      <Tab.List className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 lg:space-x-1 rounded-xl bg-blue-900/20 p-2 lg:p-1">
        {buttons.map((item, i) => (
          <Tab
            key={i}
            disabled={!enabledTabs.includes(i)}
            className={({ selected }) =>
              `w-full rounded-lg py-2 px-1 text-xs sm:text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200
              ${
                selected
                  ? "bg-white shadow"
                  : enabledTabs.includes(i)
                  ? "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  : "text-gray-400 cursor-not-allowed"
              }`
            }
          >
            <div className="flex flex-col items-center justify-center h-full">
              <Icon icon={item.icon} className="w-5 h-5 mb-1" />
              {i === 5 || i === 6 ? (
                <span>{item.title}</span>
              ) : (
                <>
                  <span style={{fontSize:"12px"}} className="lg:text-sm">Etape {i + 1} :</span>
                  <span className="text-sm	text-emerald-950		 font-semibold text-black mt-1 line-clamp-1 lg:line-clamp-none">{item.title}</span>
                </>
              )}
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-6">
        {buttons.map((item, index) => {
           const isEnabled = enabledTabs.includes(index);
           const isLastTab = index === buttons.length - 1;
           const canEnableNext = isEnabled && !isLastTab && index <= 4;
          return (
            <Tab.Panel key={index} className="rounded-xl">
              <div className="flex flex-col min-h-[300px]">
                <div className="flex-grow">
                  {index <= 4 && (
                    <Gallery
                      projectId={ProjectId}
                      StageName={item.stage}
                    />
                  )}
                  {index === 5 && <TodoPage id={ProjectId} />}
                  {index === 6 && <Comments projectId={ProjectId} />}
                <div className="flex justify-end mt-4">
                  {canEnableNext && (
                    <button
                      onClick={() => enableNextTab(index)}
                      className="group relative px-6 py-3 font-bold text-white rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      <span className="relative flex items-center">
                        Enable Next Stage
                        <svg 
                          className="w-5 h-5 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
                </div>
              </div>
            </Tab.Panel>
            
          );
          
        })}
      </Tab.Panels>
    </Tab.Group>
   
  </div>
</Card>
      </div>
    </div>
  );
};

export default ProjectPage;
