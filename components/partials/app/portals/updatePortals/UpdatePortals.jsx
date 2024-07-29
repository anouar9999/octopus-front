import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { editPortalModel, editcategorieModel } from "../store";

const FormValidationSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
  })
  .required();

const UpdatePortal = ({ companyID }) => {
  const { categoryId, editcategorie } = useSelector((state) => state.portals);
  const dispatch = useDispatch();
  const [portals, setPortals] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    validationSchema: FormValidationSchema,
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("company_id", companyID);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/update`,
        formData
      );
      console.log("Category updated:", response.data);
      dispatch(editcategorieModel({ open: false }));
      toast.success("Category updated successfully", {
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}/detail`
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
        title="Edit Category"
        labelclassName="btn-outline-dark"
        activeModal={editcategorie}
        onClose={() => dispatch(editcategorieModel({ open: false }))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="name"
            label="Category Name"
            type="text"
            defaultValue={portals.name}
            placeholder="Enter Category Name"
            register={register("name", {
              required: "Category name is required",
            })}
            error={errors.name}
          />

          <Textarea
            label="Description"
            placeholder="Description"
            defaultValue={portals.description}
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description}
          />

          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark text-end">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UpdatePortal;
