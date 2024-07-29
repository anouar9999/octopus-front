"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import ProjectGrid from "@/components/partials/app/projects/ProjectGrid";
import ProjectList from "@/components/partials/app/projects/ProjectList";
import { ToastContainer } from "react-toastify";
import './page.css'
import { useRouter } from 'next/navigation'
import axios from "axios";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const ProjectPostPage = ({ params }) => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter()
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchProjects = async () => {
    try {
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
      setIsLoaded(true);
    } catch (error) {
      console.error('There was an error fetching the projects:', error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [params.city]);

  if (!isMounted) {
    return null; // Avoid rendering during hydration
  }

  return (
    <div>
      <ToastContainer />
      
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="text-3xl font-bold text-gray-800 mb-4">
          Projets récents
        </h4>
      </div>
      <Breadcrumbs />

      {!isLoaded && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {isLoaded && filler === "grid" && (
        <div className="grid sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
          <a
              onClick={() => router.push(`/admin-portal/${params.id}/${params.categorie}/sub-portal/${params.subcategorie}/cities/all-projects/${params.city}/add-project`)}
              className="grid mb-6 rounded-lg bg-white p-6 place-items-center rounded-xl border border-blue-gray-50 bg-white px-3 py-2 transition-all hover:scale-105 hover:border-blue-gray-100 hover:bg-blue-gray-50 hover:bg-opacity-25 cursor-pointer"
            >
              <span className="my-6 grid h-24 w-24 place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                  ></path>
                </svg>
              </span>
              <h5 className="text-sm capitalize font-semibold text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
                Ajouter un projet
              </h5>
            </a>
          {projects.map((project, projectIndex) => (
            <ProjectGrid project={project} key={projectIndex} param={params} />
          ))}
        </div>
      )}

      {isLoaded && filler === "list" && (
        <ProjectList projects={projects} />
      )}
    </div>
  );
};

export default ProjectPostPage;