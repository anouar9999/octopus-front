import React from "react";
import { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { openPortalModal } from "./store";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const FormValidationSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    assign: yup.mixed().required("Assignee is required"),
    tags: yup.mixed().required("Tag is required"),
  })
  .required();



const AddPortal = ({companyID}) => {
  const { openModal, projectId } = useSelector((state) => state.portals);

  const dispatch = useDispatch();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("company_id", companyID);
  
    try {
      const response = await axios.post(
       `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyID}/categories/`,
        formData
      );
      console.log("Portal created:", response.data);
      dispatch(openPortalModal({ open: false }));
      toast.success("Portal created successfully", {
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
        // Optionally reload the page or fetch updated data
        window.location.reload();
      }, 1500);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong", {
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
        title="Add Portal"
        labelclassName="btn-outline-dark"
        activeModal={openModal}
        onClose={() =>  dispatch(openPortalModal({ open: false }))}
      
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Textinput
            name="name"
            label="Portal Name"
            type="text"
            placeholder="Enter Portal Name "
            register={register("name", {
              required: "Portal name is required",
            })}
            error={errors.name}
          />

          <Textarea
            label="Description"
            cols={20}
            row={5}
            placeholder="Description"
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
          />
         

          <div className="flex justify-end">
            <button className=" w-full btn btn-dark ">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddPortal;
