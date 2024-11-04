"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Save,
  ArrowLeft,
  BarChart2,
  Info,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";

const EditProject = ({ params }) => {
  const [project, setProject] = useState({});
  const [range, setRange] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${params.EditId}/`);
        if (response.status === 200) {
          const projectData = response.data;
          setProject(projectData);
          setValue("title", projectData.title);
          setValue("description", projectData.description);
          setValue("location", projectData.location);
          setValue("startDate", new Date(projectData.start_date));
          setValue("endDate", new Date(projectData.end_date));
          setRange(projectData.progress);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details");
      }
    };

    fetchProjectById();
  }, [params.EditId, setValue]);

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
      formData.append("progress", range);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${params.EditId}/`,
        {
          method: "PUT",
          body: formData,
        }
      );
      
      if (response.ok) {
        toast.success("Project updated successfully", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          router.push(`/admin-portal/${params.id}/${params.categorie}/sub-portal/${params.subcategorie}/cities/all-projects/${params.city}/`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          className="max-w-[1800px] mx-auto"
        >
          <Card title="Edit Project" className="shadow-lg bg-white dark:bg-gray-800">
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
                      name="title"
                      placeholder="Project Name"
                      register={register("title", {
                        required: "Project name is required",
                      })}
                      error={errors.title}
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      Description
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Project description"
                      register={register("description")}
                      error={errors.description}
                      rows={5}
                      className="w-full"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      Location Link
                    </label>
                    <Textinput
                      name="location"
                      placeholder="Location Link"
                      register={register("location")}
                      error={errors.location}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Dates */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Start Date
                      </label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <Flatpickr
                            {...field}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            options={{
                              dateFormat: "Y-m-d",
                              altInput: true,
                              altFormat: "F j, Y",
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
                        render={({ field }) => (
                          <Flatpickr
                            {...field}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            options={{
                              dateFormat: "Y-m-d",
                              altInput: true,
                              altFormat: "F j, Y",
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-4">
                    <label className="inline-flex items-center text-base font-medium text-gray-700 dark:text-gray-200">
                      <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
                      Progress
                    </label>
                    <div className="relative pt-4">
                      <input
                        type="range"
                        value={range}
                        min={0}
                        max={100}
                        onChange={(e) => setRange(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="absolute -top-4 right-0  transform -translate-x-1/2 bg-[#0b77b7] text-white px-2 py-1 rounded text-sm">
                        {range}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    flex items-center px-8 py-3 bg-[#0b77b7] text-white rounded-lg
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Project
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

export default EditProject;