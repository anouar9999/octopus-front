"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import { 
  Calendar, 
  Users, 
  MapPin, 
  FileText, 
  Plus,
  ArrowLeft,
  Clock,
  Calendar as CalendarIcon,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";

const AddProject = ({params}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      const timeZoneOffset = startDate.getTimezoneOffset();
      startDate.setMinutes(startDate.getMinutes() - timeZoneOffset);
      endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);

      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("start_date", startDateString);
      formData.append("end_date", endDateString);
      formData.append("company", params.id);

      if (params.city !== null) {
        formData.append("region_name", params.city);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/new/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Project created successfully", {
          icon: "🎉",
          delay: 1500,
        });
        setTimeout(() => {
          router.push(
            `/admin-portal/${params.id}/${params.categorie}/sub-portal/${params.subcategorie}/cities/all-projects/${params.city}/`
          );
        }, 1500);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("Failed to create project. Please try again.", {
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full px-4 py-6">
        {/* Header Section */}
        <div className="max-w-[1800px] mx-auto mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1800px] mx-auto"
        >
          <Card title="Create New Project" className="shadow-lg bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <FileText className="w-5 h-5 mr-2 text-blue-500" />
                      Project Name
                    </label>
                    <Textinput
                      id="title"
                      placeholder="Enter an inspiring project name"
                      register={register("title", {
                        required: "Project name is required",
                      })}
                      error={errors.title}
                      className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your project"
                      register={register("description", {
                        required: "Description is required",
                      })}
                      error={errors.description}
                      rows={8}
                      className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Dates Section */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                        <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Start Date
                      </label>
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <Flatpickr
                            {...field}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            options={{
                              dateFormat: "Y-m-d",
                              altInput: true,
                              altFormat: "F j, Y",
                              placeholder: "Select start date",
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                        <Clock className="w-5 h-5 mr-2 text-blue-500" />
                        End Date
                      </label>
                      <Controller
                        name="endDate"
                        control={control}
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <Flatpickr
                            {...field}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            options={{
                              dateFormat: "Y-m-d",
                              altInput: true,
                              altFormat: "F j, Y",
                              placeholder: "Select end date",
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      Location Link
                    </label>
                    <Textinput
                      id="location"
                      placeholder="Enter the project location link"
                      register={register("location", {
                        required: "Location is required",
                      })}
                      error={errors.location}
                      className="w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg
                    transform transition-all duration-200
                    ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105'}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProject;