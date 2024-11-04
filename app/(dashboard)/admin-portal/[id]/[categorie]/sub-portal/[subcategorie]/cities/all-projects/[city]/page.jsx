"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import ProjectGrid from "@/components/partials/app/projects/ProjectGrid";
import ProjectList from "@/components/partials/app/projects/ProjectList";
import { ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import axios from "axios";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const ProjectPostPage = ({ params }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoaded(false);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/?region_name=${params.city}`);
      const projectsData = response.data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        tag: project.tag,
        progress: project.progress,
        start_date: project.start_date,
        end_date: project.end_date,
        assign: project.assign,
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('There was an error fetching the projects:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [params.city]);

  if (!isMounted) return null;

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === "all" || project.tag === selectedFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ToastContainer />
      <Breadcrumbs className="mt-2" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon icon="heroicons-outline:clipboard-list" className="w-8 h-8 text-blue-500" />
                Projects in {params.city}
              </h1>
            </div>

            <button
              onClick={() => router.push(`/admin-portal/${params.id}/${params.categorie}/sub-portal/${params.subcategorie}/cities/all-projects/${params.city}/add-project`)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Icon icon="heroicons-outline:plus" className="w-5 h-5 mr-2" />
              Create New Project
            </button>
          </div>

          {/* Filters and Search */}
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Icon icon="heroicons-outline:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" 
                    ? "bg-blue-50 text-blue-500 dark:bg-blue-900/20"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon icon="heroicons-outline:view-grid" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-500 dark:bg-blue-900/20"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon icon="heroicons-outline:view-list" className="w-5 h-5" />
              </button>
            </div>
          </div> */}
        </div>

        {/* Loading State */}
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="heroicons-outline:document" className="w-16 h-16 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Projects Found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {searchTerm ? "Try adjusting your search terms" : "Start by adding your first project"}
                  </p>
                </div>
              ) : (
                <div className={viewMode === "grid" 
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {viewMode === "grid" ? (
                        <ProjectGrid project={project} param={params} />
                      ) : (
                        <ProjectList project={project} param={params} />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectPostPage;