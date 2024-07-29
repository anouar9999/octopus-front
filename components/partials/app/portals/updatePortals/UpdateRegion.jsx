import React, { useEffect, useState } from "react";
import { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { editPortalModel, openPortalModal } from "../store";
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



const UpdateRegion = ({RegionID}) => {
  const { editModal, categoryId } = useSelector((state) => state.portals);
  const dispatch = useDispatch();
  const [portals, setPortals] = useState([]);

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
   
  
    try {
      const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/regions/${RegionID}/update/`,
        formData
      );
      console.log("SubPortal created:", response.data);
      dispatch(editPortalModel({ open: false }));
      toast.success("Region Updated successfully", {
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

    const fetchPortals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/regions/${RegionID}/`
        );
        console.log('-------------');
        console.log(response.data);
        console.log('-------------');
        setPortals(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching portals:", error);
        throw error;
      }
    };
    fetchPortals();
  }, []);

  return (
    <div>
      <Modal
        title="Add Region"
        labelclassName="btn-outline-dark"
        activeModal={editModal}
        onClose={() =>dispatch(editPortalModel({open : false}))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="name"
            label="Region Name"
            type="text"
            defaultValue={portals.name}
            placeholder="Enter Region Name "
            register={register("name", {
              required: "Region name is required",
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
            <button className="btn btn-dark  text-end">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateRegion;
