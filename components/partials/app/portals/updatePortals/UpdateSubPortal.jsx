import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { editPortalModel, editSubCategorieModel } from "../store";

const FormValidationSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    assign: yup.mixed().required("Assignee is required"),
    tags: yup.mixed().required("Tag is required"),
  })
  .required();

const UpdateSubPortal = () => {
  const { editSubCategorie, categoryId } = useSelector(
    (state) => state.portals
  );
  const dispatch = useDispatch();
  const [portals, setPortals] = useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${categoryId}/update/`,
        formData
      );
      console.log("SubPortal updated:", response.data);
      dispatch(editSubCategorieModel({ open: false }));

      toast.success("Sub-Portal updated successfully", {
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

  useEffect(() => {
  if (categoryId) {
    const fetchPortals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${categoryId}/`
        );
        console.log("-------------");
        console.log(response.data);
        console.log("-------------");
        setPortals(response.data);
        reset(response.data); // Reset form fields with fetched data
        return response.data;
      } catch (error) {
        console.error("Error fetching portals:", error);
        throw error;
      }
    };
    fetchPortals();
  }

  }, [categoryId, reset]);

  return (
    <div>
      <Modal
        title="edit Sub-Portal"
        labelclassName="btn-outline-dark"
        activeModal={editSubCategorie}
        onClose={() => dispatch(editSubCategorieModel({ open: false }))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="name"
            label="Sub-Portal Name"
            type="text"
            defaultValue={portals.name}
            placeholder="Enter Sub-Portal Name "
            register={register("name", {
              required: "Sub-Portal name is required",
            })}
            error={errors.name}
          />

          <Textarea
            label="Description"
            defaultValue={portals.description}
            placeholder="Description"
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
          />

          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-end">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateSubPortal;
