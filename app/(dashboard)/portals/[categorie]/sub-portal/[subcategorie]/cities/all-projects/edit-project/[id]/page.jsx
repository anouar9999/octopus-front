"use client";
import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { updateProject, toggleEditModal } from "../../../../../store";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import FormGroup from "@/components/ui/FormGroup";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { Slider } from "@nextui-org/slider";
import "./page.css";
import DropZone from "@/components/partials/froms/DropZone";
import axios from "axios";
import Button from "@/components/ui/Button";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

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

const colors = [
  "foreground",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
];

const OptionComponent = ({ data, ...props }) => {
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

const EditProject = ({ params: { id } }) => {
  const { editModal, editItem } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState({});
  const [range, setRange] = useState(0);

  const FormValidationSchema = yup
    .object({
      title: yup.string().required("Title is required"),
      assign: yup.mixed().required("Assignee is required"),
    
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}/`);
        if (response.status === 200) {
          const projectData = response.data;
          setProject(projectData);
          setValue("title", projectData.title);
          setValue("description", projectData.description);
          setValue("lang", projectData.lang);
          setValue("lat", projectData.lat);

          setValue("startDate", new Date(projectData.start_date));
          setValue("endDate", new Date(projectData.end_date));
          setValue("assign", {
            value: projectData.assign,
            label: projectData.assign,
          });
          setRange(projectData.progress);
        } else {
          throw new Error(`Failed to fetch project with ID ${id}`);
        }
      } catch (error) {
        console.error("An error occurred while fetching project:", error);
      }
    };

    fetchProjectById();
  }, [id, setValue]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/`);
        const membersData = response.data.map((member) => ({
          value: member.CompanyName,
          label: member.CompanyName,
        }));
        setMembers(membersData);
      } catch (error) {
        console.error("There was an error fetching the members!", error);
      }
    };

    fetchMembers();
  }, []);
  const onSubmit = async (data) => {
    try {
      // Convert dates to local time zone
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
      formData.append("tag", data.tag);
      formData.append("start_date", startDateString);
      formData.append("end_date", endDateString);
      formData.append("assign", data.assign.label);
      formData.append("progress", range);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${id}/`,
        {
          method: "PUT",
          body: formData,
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        toast.info("Project updated successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/all-projects");
        console.log("Project updated successfully:", responseData);
      } else {
        const errorData = await response.json();
        console.error("Error updating project:", errorData);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };
  

  return (
    <div className="m-5">
      <Card title="Edit Project">
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
                    placeholder="yyyy, dd M"
                    className="form-control py-2"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    options={{
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
            <FormGroup label="End Date" id="end-date-picker" error={errors.endDate}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    placeholder="yyyy, dd M"
                    value={field.value}
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
                    value={members.find(option => option.value === field.value?.value) || null}
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

          <div className="mt-5">
            <label
              htmlFor="progress"
              className="flex-0 mr-6 mt-5 md:w-[100px] w-[60px] font-semibold break-words"
            >
              Progress
            </label>
            <input
              className="range"
              type="range"
              value={range}
              min={0}
              max={100}
              onChange={(e) => setRange(e.target.value)}
              onMouseMove={(e) => setRange(e.target.value)}
            />
            <span id="rangeValue">{range}%</span>
          </div>

          <div className="ltr:text-center rtl:text-center">
            <Button type="submit" className="btn btn-dark mt-4">
              Update Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProject;
