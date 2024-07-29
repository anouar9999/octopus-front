"use client";

import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { useSelector, useDispatch } from "react-redux";
// import { toggleAddModal, pushProject } from "../../../../store";
import "../../../globals.css";

import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import FormGroup from "@/components/ui/FormGroup";
import DropZone from "@/components/partials/froms/DropZone";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const assigneeOptions = [
  {
    value: "mahedi",
    label: "Mahedi Amin",
    image: "/assets/images/avatar/av-1.svg",
  },
  {
    value: "sovo",
    label: "Sovo Haldar",
    image: "/assets/images/avatar/av-2.svg",
  },
  {
    value: "rakibul",
    label: "Rakibul Islam",
    image: "/assets/images/avatar/av-3.svg",
  },
  {
    value: "pritom",
    label: "Pritom Miha",
    image: "/assets/images/avatar/av-4.svg",
  },
];
const options = [
  {
    value: "team",
    label: "team",
  },
  {
    value: "low",
    label: "low",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "high",
    label: "high",
  },
  {
    value: "update",
    label: "update",
  },
];

const OptionComponent = ({ data, ...props }) => {
  //const Icon = data.icon;

  return (
    <components.Option {...props}>
      <span className="flex items-center space-x-4">
        <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const AddProject = () => {
  const [members, setMembers] = useState([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Function to handle selected files from DropZone
  const handleSelectedFiles = (files) => {
    setSelectedFiles(files);
    // Update the value of the file input in the form
    setValue("files", files);
  };

  const onSubmit = async (data) => {
    console.log(data.assign.value);
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Get time zone offset in minutes
      const timeZoneOffset = startDate.getTimezoneOffset();

      // Adjust dates to compensate for time zone offset
      startDate.setMinutes(startDate.getMinutes() - timeZoneOffset);
      endDate.setMinutes(endDate.getMinutes() - timeZoneOffset);

      // Format dates as YYYY-MM-DD strings
      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("lang", data.lang);
      formData.append("lat", data.lat);
      formData.append("start_date", startDateString);
      formData.append("end_date", endDateString);
      formData.append("assign", data.assign.label);
      formData.append("company", data.assign.value);
      // Check if company_id is null and log a message
      if (data.assign.value === null) {
        console.log("company_id is null. Not appending to FormData.");
      } else {
        formData.append("company_id", data.assign.value);
      }

      data.files.forEach((file) => {
        formData.append("files", file);
      });
      console.log(formData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/create/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Project created successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // router.push("/all-projects");
        console.log("Project created successfully:", responseData);
      } else {
        const errorData = await response.json();
        console.error("Error creating project:", errorData);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
};

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/`); // Adjust the URL as per your API endpoint

        const membersData = response.data.map(
          (member) => (
            console.log(member),
            {
              label: member.CompanyName,
              value: member.id
            }
          )
        );
        setMembers(membersData);
      } catch (error) {
        console.error("There was an error fetching the members!", error);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div>
      <ToastContainer />
      <Card title="Create new Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <Textinput
              name="title"
              label="Project Name"
              placeholder="Project Name"
              register={register("title", {
                required: "Project name is required",
              })}
              error={errors.title}
            />
            <Textarea
              label="Description"
              placeholder="Description"
              register={register("description", {
                required: "Description is required",
              })}
              error={errors.description}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <FormGroup
              label="Start Date"
              id="start-date-picker"
              error={errors.startDate}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    placeholder="yyyy, dd M"
                    onChange={(date) => field.onChange(date)}
                    options={{
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label="End Date"
              id="end-date-picker"
              error={errors.endDate}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    placeholder="yyyy, dd M"
                    onChange={(date) => field.onChange(date)}
                    options={{
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <div className={errors.assign ? "has-error" : ""}>
              <label className="form-label" htmlFor="assign-select">
                Sélection du Client
              </label>
              <Controller
                name="assign"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={members}
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                    className="react-select"
                    classNamePrefix="select"
                    id="assign-select"
                  />
                )}
              />
              {errors.assign && (
                <div className="mt-2 text-danger-500 text-sm">
                  {errors.assign.message || errors.assign.label.message}
                </div>
              )}
            </div>

            <div className={errors.lat || errors.lang ? "has-error" : ""}>
  <div className="flex">
    <div className="w-1/2 mr-4">
      <Textinput
        name="lat"
        label="Latitude"
        placeholder="Enter latitude"
        register={register("lat", { required: "Latitude is required" })}
        error={errors.lat}
      />
      {errors.lat && (
        <div className="mt-2 text-danger-500 text-sm">
          {errors.lat.message}
        </div>
      )}
    </div>
    <div className="w-1/2">
      <Textinput
        name="lang"
        label="Longitude"
        placeholder="Enter longitude"
        register={register("lang", { required: "Longitude is required" })}
        error={errors.lng}
      />
      {errors.lng && (
        <div className="mt-2 text-danger-500 text-sm">
          {errors.lng.message}
        </div>
      )}
    </div>
  </div>
</div>


          </div>

          <div className="xl:col-span-2 col-span-1">
            <label className="form-label" htmlFor="dropzone">
              Documents associés
            </label>
            <DropZone onSelectFiles={handleSelectedFiles} />
          </div>

          <div className="ltr:text-center rtl:text-center">
            <button type="submit" className="btn btn-dark mt-4">
              Create Project
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProject;
