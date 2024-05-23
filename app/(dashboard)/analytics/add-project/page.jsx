"use client";

import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { useSelector, useDispatch } from "react-redux";
// import { toggleAddModal, pushProject } from "../../../../store";
import "../../../globals.css";

import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import FormGroup from "@/components/ui/FormGroup";
import DropZone from "@/components/partials/froms/DropZone";
import axios from "axios";




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
  const { openProjectModal } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [picker, setPicker] = useState(new Date());
  const [members, setMembers] = useState([]);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Function to handle selected files from DropZone
  const handleSelectedFiles = (files) => {
    setSelectedFiles(files);
    // Update the value of the file input in the form
    setValue("files", files);
  };
 

  const onSubmit = async (data) => {
    console.log(data);
    try {
        const startDateString = new Date(data.startDate).toISOString().split('T')[0];
        const endDateString = new Date(data.endDate).toISOString().split('T')[0];

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('tag', data.tag);
        formData.append('start_date', startDateString);
        formData.append('end_date', endDateString);
        formData.append('assign', data.assign.label);

        data.files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch('http://127.0.0.1:8000/api/projects/create/', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Project created successfully:', responseData);
        } else {
            const errorData = await response.json();
            console.error('Error creating project:', errorData);
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};


  
  

  
  
  
  
  
  

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/members/'); // Adjust the URL as per your API endpoint
      
        const membersData = assigneeOptions.map(member => (
          console.log(member),
          {
         
          label: member.MemberFullName,
        }));
        setMembers(membersData);
      } catch (error) {
        console.error('There was an error fetching the members!', error);
      }
    };
    fetchMembers();
  }, []);



  return (
    <div>
      <Card title="Create new Project">
      {/* onSubmit={handleSubmit(onSubmit)} */}
        <form  className="space-y-2">
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
                  options={assigneeOptions}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
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

            <div className={errors.tag ? "has-error" : ""}>
              <Textinput
                name="tag"
                label="Localisation"
                placeholder="Enter GPS coordinates or address"
                register={register("tag", { required: "Location is required" })}
                error={errors.tag}
              />
              {errors.tag && (
                <div className="mt-2 text-danger-500 text-sm">
                  {errors.tag.message || errors.tag.label.message}
                </div>
              )}
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
