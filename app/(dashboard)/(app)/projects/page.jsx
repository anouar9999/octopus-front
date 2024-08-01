"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import ProjectGrid from "@/components/partials/app/projects/ProjectGrid";
import ProjectList from "@/components/partials/app/projects/ProjectList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { toggleAddModal } from "@/components/partials/app/projects/store";
import AddProject from "@/components/partials/app/projects/AddProject";
import { ToastContainer } from "react-toastify";
import EditProject from "@/components/partials/app/projects/EditProject";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children; 
  }
}

const ProjectPostPage = () => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(true);

  const { projects = [] } = useSelector((state) => state.project) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [filler]);

  const renderProjects = () => {
    if (isLoaded) {
      return filler === "grid" ? (
        <GridLoading count={projects?.length ?? 0} />
      ) : (
        <TableLoading count={projects?.length ?? 0} />
      );
    }

    if (filler === "grid") {
      return (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {projects.map((project, projectIndex) => (
            <ProjectGrid project={project} key={projectIndex} />
          ))}
        </div>
      );
    }

    // Uncomment this when ProjectList is ready to use
    // if (filler === "list") {
    //   return (
    //     <div>
    //       <ProjectList projects={projects} />
    //     </div>
    //   );
    // }

    return null;
  };

  return (
    <ErrorBoundary>
      <div>
        <ToastContainer />
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
            Project
          </h4>
          <div
            className={`${
              width < (breakpoints?.md ?? Infinity) ? "space-x-rb" : ""
            } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
          >
            <Button
              icon="heroicons:list-bullet"
              text="List view"
              disabled={isLoaded}
              className={`${
                filler === "list"
                  ? "bg-slate-900 dark:bg-slate-700  text-white"
                  : " bg-white dark:bg-slate-800 dark:text-slate-300"
              }   h-min text-sm font-normal`}
              iconClass=" text-lg"
              onClick={() => setfiller("list")}
            />
            <Button
              icon="heroicons-outline:view-grid"
              text="Grid view"
              disabled={isLoaded}
              className={`${
                filler === "grid"
                  ? "bg-slate-900 dark:bg-slate-700 text-white"
                  : " bg-white dark:bg-slate-800 dark:text-slate-300"
              }   h-min text-sm font-normal`}
              iconClass=" text-lg"
              onClick={() => setfiller("grid")}
            />
            <Button
              icon="heroicons-outline:filter"
              text="On going"
              className="bg-white dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-900 hover:text-white btn-md  h-min text-sm font-normal"
              iconClass=" text-lg"
            />
            <Button
              icon="heroicons-outline:plus"
              text="Add Project"
              className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
              iconClass=" text-lg"
              onClick={() => dispatch(toggleAddModal(true))}
            />
          </div>
        </div>
        {renderProjects()}
        <AddProject />
        <EditProject />
      </div>
    </ErrorBoundary>
  );
};

export default ProjectPostPage;