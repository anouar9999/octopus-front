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

const ProjectPage = ({ params: { projectId } }) => {
  const [project, setProject] = useState({});
  const [enabledTabs, setEnabledTabs] = useState([0, 5, 6]);

  useEffect(() => {
    console.log(projectId)
    const fetchProjectAndStages = async () => {
      try {
        const projectResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/`
        );
        const stagesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/`
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
            `Failed to fetch project or stages with ID ${projectId}`
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
  }, [projectId]);

  const enableNextTab = async (currentIndex) => {
    if (currentIndex < buttons.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStage = buttons[nextIndex].stage;

      try {
        // Update the stage completion status in the backend
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${nextStage}/`,
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
    <div className=" min-h-screen py-2 px-4 ">
      <ToastContainer />
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="grid lg:grid-cols-3 gap-6 p-6">
    {/* Project Info - Left Column */}
    <div className="lg:col-span-2">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Active</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
            <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800">
              <span className="font-semibold text-blue-700 dark:text-blue-300">{project.progress}%</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                project.progress >= 80 
                  ? 'bg-green-500' 
                  : project.progress >= 40 
                    ? 'bg-blue-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Project Meta */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <Icon icon="heroicons-outline:calendar" className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Start Date</div>
                <div className="font-medium text-gray-900 dark:text-white">{project.start_date}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-800 flex items-center justify-center">
                <Icon icon="heroicons-outline:clock" className="w-5 h-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">End Date</div>
                <div className="font-medium text-gray-900 dark:text-white">{project.end_date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
              <Icon icon="heroicons-outline:document-text" className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.description}</p>
        </div>
      </div>
    </div>

    {/* Map - Right Column */}
    <div className="lg:col-span-1">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <Icon icon="heroicons-outline:location-marker" className="w-5 h-5 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
        </div>
        <div className="rounded-xl overflow-hidden h-[calc(100%-4rem)]">
        <BasicMap 
              
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
    </div>
  </div>

        <div className=" dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
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
                  <span className="text-xs lg:text-sm">Etape {i + 1}</span>
                  <span className="text-xs mt-1 line-clamp-1 lg:line-clamp-none">{item.title}</span>
                </>
              )}
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-6">
        {buttons.map((item, index) => {
          return (
            <Tab.Panel key={index} className="rounded-xl">
              <div className="flex flex-col min-h-[300px]">
                <div className="flex-grow">
                  {index <= 4 && (
                    <Gallery
                      projectId={projectId}
                      StageName={item.stage}
                    />
                  )}
                  {index === 5 && <TodoPage id={projectId} />}
                  {index === 6 && <Comments projectId={projectId} />}
                </div>
              </div>
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  </div>
</div>
      </div>
    </div>
  );
};

export default ProjectPage;
