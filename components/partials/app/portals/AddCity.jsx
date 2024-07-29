import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { openPortalModal } from "./store";

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const FormValidationSchema = yup.object().shape({
  name: yup.string().required("City Name is required"),
  image: yup.mixed()
    
    .test("fileFormat", "Unsupported Format", (value) => {
      if (!value) return true; // Allows empty
      return value && SUPPORTED_FORMATS.includes(value[0]?.type);
    })
});

const AddCity = ({ SubCategorieID }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  });
  const { openModal, categoryId } = useSelector((state) => state.portals);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("sub_category", SubCategorieID);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${SubCategorieID}/cities/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("City created:", response.data);
      toast.success("City created successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Optionally reload the page or fetch updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
    }
  };

  return (
    <div>
      <Modal
        title="Add City"
        labelclassName="btn-outline-dark"
        activeModal={openModal}
        onClose={() => dispatch(openPortalModal({ open: false }))}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textinput
            name="name"
            label="City Name"
            type="text"
            placeholder="Enter City Name"
            register={register("name")}
            error={errors.name?.message}
          />
          <label className="block capitalize form-label font-semibold flex-0 mr-6 md:w-[100px] w-[60px] font-sans break-words">
            City Image
          </label>
          <section className="container w-full mb-4">
            <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
              <input
                id="upload"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={(e) => {
                  handleFileChange(e);
                  register("image").onChange(e);
                }}
                className="hidden"
              />
              {!previewImage && (
                <label htmlFor="upload" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-700 mx-auto mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                    Upload picture
                  </h5>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    Choose photo size should be less than{" "}
                    <b className="text-gray-600">2mb</b>
                  </p>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    and should be in <b className="text-gray-600">JPG, PNG, or GIF</b> format.
                  </p>
                </label>
              )}
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 max-h-48 mx-auto rounded-lg"
                />
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </section>
          <div className="flex justify-end">
            <button className="w-full btn btn-dark">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddCity;