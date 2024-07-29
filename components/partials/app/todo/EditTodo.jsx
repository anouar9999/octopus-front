import React, { useState, useEffect } from "react";
import Select from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { closeEditModal } from "./store";
import Icon from "@/components/ui/Icon";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

const FormValidationSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    category: yup.mixed().required("Category is required"),
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

const options = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "update", label: "Update" },
];

const EditTodoModal = ({ id }) => {
  const { editModal, editItem, taskId } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
    defaultValues: editItem // Set default values
  });

  useEffect(() => {
    reset(editItem);
  }, [editItem]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/`, {
        title: data.title,
        category: data.category.value,
        project_id: id,
      });
      console.log('Task updated:', response.data);
      dispatch(closeEditModal(false));
      toast.info("Edit Successfully", {
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
      }, 1500);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  return (
    <Modal
      title="Edit Task"
      activeModal={editModal}
      onClose={() => dispatch(closeEditModal(false))}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={`fromGroup ${errors.title ? "has-error" : ""}`}>
          <div className="relative">
            <Textinput
              type="text"
              label="Title"
              register={register("title", {
                required: "Project name is required",
              })}
              className="form-control py-2"
            />
            {errors.title && (
              <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
                <span className="text-danger-500">
                  <Icon icon="heroicons-outline:information-circle" />
                </span>
              </div>
            )}
          </div>
          {errors.title && (
            <div className="mt-2 text-danger-500 block text-sm">
              {errors.title.message}
            </div>
          )}
        </div>

        <div className={`fromGroup ${errors.category ? "has-error" : ""}`}>
          <label className="form-label" htmlFor="category-select">
            Select Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={options}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                value={field.value ? options.find(option => option.value === field.value) : null}
                onChange={(selectedOption) => field.onChange(selectedOption)}
                className="react-select"
                classNamePrefix="select"
                id="category-select"
              />
            )}
          />
          {errors.category && (
            <div className="mt-2 text-danger-500 block text-sm">
              {errors.category.message}
            </div>
          )}
        </div>

        <div className="ltr:text-right rtl:text-left">
          <button className="btn btn-dark text-center">Update</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTodoModal;