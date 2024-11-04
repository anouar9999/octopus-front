'use client'

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProjectGrid = ({ project, param }) => {
  const { id, title, progress, tag, members, assign, des, start_date, end_date } = project;
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.auth.userData);
  const isAdmin = userData?.user?.is_admin || false;

  const [start, setStart] = useState(new Date(start_date));
  const [end, setEnd] = useState(new Date(end_date));
  const [totaldays, setTotaldays] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const handleClick = (projectId) => {
    router.push(`/admin-portal/${param.id}/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/edit-project/${projectId}/`);
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/delete/${projectId}/`);
      if (response.status === 204) {
        toast.error("Project deleted successfully", {
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
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast.error("Failed to delete project");
    }
  };

  const getStatusColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href={isAdmin ? 
            `/admin-portal/${param.id}/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/single-project/${id}` :
            `/portals/${param.categorie}/sub-portal/${param.subcategorie}/cities/all-projects/${param.city}/single-project/${id}`}
            className="flex-1"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
              {title}
            </h2>
          </Link>

          {isAdmin && (
            <Dropdown
              classMenuItems="w-[130px]"
              label={
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Icon icon="heroicons-outline:dots-vertical" className="text-gray-600 dark:text-gray-300" />
                </span>
              }
            >
              <Menu.Item onClick={() => handleClick(id)}>
                <div className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Icon icon="heroicons-outline:pencil-alt" className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={() => deleteProject(id)}>
                <div className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <Icon icon="heroicons-outline:trash" className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </div>
              </Menu.Item>
            </Dropdown>
          )}
        </div>

        {/* Dates and Priority */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Icon icon="heroicons-outline:calendar" className="w-3 h-3 mr-1" />
            {start_date}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <Icon icon="heroicons-outline:calendar" className="w-3 h-3 mr-1" />
            {end_date}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            <Icon icon="heroicons-outline:exclamation" className="w-3 h-3 mr-1" />
            High Priority
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getStatusColor(progress)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <Icon icon="heroicons-outline:clock" className="w-4 h-4 mr-1" />
              {totaldays} days left
            </span>
            <motion.div 
              animate={{ scale: isHovered ? 1.1 : 1 }}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                totaldays <= 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                totaldays <= 7 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
              {totaldays <= 3 ? 'Due Soon' : totaldays <= 7 ? 'Upcoming' : 'On Track'}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectGrid;