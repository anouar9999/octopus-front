import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { editCityModel } from "../store";

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const FormValidationSchema = yup.object().shape({
  name: yup.string().required("City name is required"),
  image: yup.mixed()
    
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value || !value.length) return true; // Allows empty
      return SUPPORTED_FORMATS.includes(value[0].type);
    })
});

const UpdateCity = () => {
  const { editCity, CityID } = useSelector((state) => state.portals);
  const dispatch = useDispatch();
  const [cityData, setCityData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  });
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("image", [file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setValue("image", null);
      setPreviewImage(null);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${CityID}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("City Updated:", response.data);
      dispatch(editCityModel({ open: false }));

      toast.success("City updated successfully", {
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

  useEffect(() => {
    if (CityID) {
      const fetchCityData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${CityID}/`
          );
          setCityData(response.data);
          setPreviewImage(response.data.image);
          reset(response.data);
        } catch (error) {
          console.error("Error fetching city data:", error);
          toast.error("Failed to fetch city data");
        }
      };
      fetchCityData();
    }
  }, [CityID, reset]);

  return (
    <div>
      <Modal
        title="Edit City"
        labelclassName="btn-outline-dark"
        activeModal={editCity}
        onClose={() => dispatch(editCityModel({ open: false }))}
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
          <div>
            <label className="block capitalize form-label font-semibold mb-2">
              City Image
            </label>
            <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
              {previewImage && (
                <img
                  src={previewImage.startsWith('http') ? previewImage : `${process.env.NEXT_PUBLIC_API_URL}${previewImage}`}
                  alt="Preview"
                  className="mt-4 max-h-48 mx-auto rounded-lg mb-4"
                />
              )}
              <input
                id="upload"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleFileChange}
                className="hidden"
              />
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
                  Upload new picture
                </h5>
                <p className="font-normal text-sm text-gray-400 md:px-6">
                  Choose photo size should be less than <b className="text-gray-600">2mb</b>
                </p>
                <p className="font-normal text-sm text-gray-400 md:px-6">
                  and should be in <b className="text-gray-600">JPG, PNG, or GIF</b> format.
                </p>
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-dark">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UpdateCity;