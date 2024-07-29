"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import { Calendar, Users, MapPin, FileText, Plus } from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";

const CustomOption = ({ data, ...props }) => (
  <components.Option {...props}>
    <div className="flex items-center space-x-3">
      <img
        src={data.image || "/assets/images/avatar/av-1.svg"}
        alt={data.label}
        className="w-8 h-8 rounded-full"
      />
      <span>{data.label}</span>
    </div>
  </components.Option>
);

const AddProject = ({params}) => {
  const [members, setMembers] = useState([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
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
          delay:1500,
        });
        setTimeout(() => {
          router.push(
            `/admin-portal/${params.id}/${params.categorie}/sub-portal/${params.subcategorie}/cities/all-projects/${params.city}/`
          );
        }, 1500);
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("Failed to create project. Please try again.", {
        icon: "❌",
      });
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies/`
        );
        const membersData = response.data.map((member) => ({
          label: member.CompanyName,
          value: member.id,
          image: member.CompanyImage || "/assets/images/avatar/av-1.svg",
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("There was an error fetching the members!", error);
        toast.error("Failed to load clients. Please refresh the page.");
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="w-full mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card
        title="Create New Project"
        className="shadow-2xl bg-white dark:bg-gray-800"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="title"
              >
                <FileText className="w-5 h-5 inline-block mr-2" />
                Project Name
              </label>
              <Textinput
                id="title"
                placeholder="Enter project name"
                register={register("title", {
                  required: "title is required",
                })}
                error={errors.title}
              />
             
            </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              htmlFor="description"
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Project description"
              register={register("description", {
                required: "Description is required",
              })}
              error={errors.description}
              rows={4}
            />
          
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="startDate"
              >
                <Calendar className="w-5 h-5 inline-block mr-2" />
                Start Date
              </label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    className="form-input w-full py-2 px-3 h-11 bg-transparent dark:bg-slate-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-700"
                    options={{
                      dateFormat: "Y-m-d",
                      altInput: true,
                      altFormat: "F j, Y",
                      placeholder: "Select start date",
                    }}
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="endDate"
              >
                <Calendar className="w-5 h-5 inline-block mr-2" />
                End Date
              </label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    className="form-input w-full py-2 px-3 h-11 bg-transparent dark:bg-slate-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-700"
                    options={{
                      dateFormat: "Y-m-d",
                      altInput: true,
                      altFormat: "F j, Y",
                      placeholder: "Select end date",
                    }}
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              htmlFor="location"
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              Location Link
            </label>
            <Textinput
              id="location"
              placeholder="Enter location link"
              register={register("location", {
                required: "location is required",
              })}
              error={errors.location}
            />
          
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProject;
