"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import ProjectGrid from "@/components/partials/app/projects/ProjectGrid";
import ProjectList from "@/components/partials/app/projects/ProjectList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { ToastContainer } from "react-toastify";
import './page.css'
import { useRouter } from 'next/navigation'
import axios from "axios";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const ProjectPostPage = ({ params }) => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter()
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

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
    } catch (error) {
      console.error('There was an error fetching the projects:', error);
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

      {isLoaded && filler === "grid" && (
        <GridLoading count={projects?.length} />
      )}
      {isLoaded && filler === "list" && (
        <TableLoading count={projects?.length} />
      )}

      {filler === "grid" && !isLoaded && (
        <div className="grid sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 ">
         
          {projects.map((project, projectIndex) => (
            <ProjectGrid project={project} key={projectIndex} param={params} />
          ))}
        </div>
      )}
      {filler === "list" && !isLoaded && (
        <div>
          <ProjectList projects={projects} />
        </div>
      )}
    </div>
  );
};

export default ProjectPostPage;