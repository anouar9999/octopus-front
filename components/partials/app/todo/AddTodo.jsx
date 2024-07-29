import React, { useState } from "react";
import Select, { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { openAddModal, fetchTodos } from "./store";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

const FormValidationSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    assign: yup.mixed().required("Assignee is required"),
    tags: yup.mixed().required("Tag is required"),
  })
  .required();

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

const AddTodo = () => {
  const { addModal, projectId } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category.label);
    formData.append("project_id", projectId);

    try {
      // Send a POST request to create a new task
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/tasks/`,
        formData
      );
      console.log("Task created:", response.data);
      // Optionally, you can redirect or show a success message here
      dispatch(openAddModal({ open: false, id: projectId }));
      toast.success("Task create successfully", {
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
    window.location.reload()
      }, 1500);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      toast.error("somethig Wrong", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      throw error;
    }
  };
  return (
    <div>
      <Modal
        title="Add Task"
        labelclassName="btn-outline-dark"
        activeModal={addModal}
        onClose={() =>  dispatch(openAddModal({ open: false, id: projectId }))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="title"
            label="title"
            type="text"
            placeholder="Enter title"
            register={register("title", {
              required: "Project name is required",
            })}
            error={errors.title}
          />

          <div className={errors.tags ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
            priority        
                </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}
          </div>
          <div className="pt-12">

          </div>
          <div className="pt-12">

</div>

          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTodo;
