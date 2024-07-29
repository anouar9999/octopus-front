import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { toggleUploadImageModal } from "./store";

const FormValidationSchema = yup.object({
  info: yup.string().required("Description is required"),
});

const UploadImages = ({ projectID, stageName }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    validationSchema: FormValidationSchema,
  });
  useEffect(() => {
    console.log("----------")
    console.log(stageName)
  }, []);

  const { openUploadImageModal } = useSelector((state) => state.project);
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
  // const fetchProjectImages = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/stages/${StageName}/images/`
  //     );

  //     if (response.status === 200) {
  //       const images = response.data;
  //       console.log(images);
  //       setImages(images); // Implement this function to display images on the page
  //     }
  //   } catch (error) {
  //     console.error("Error fetching images:", error);
  //     toast.error("Failed to fetch images");
  //   }
  // };
  const handleImageUpload = async (data) => {
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedImageTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload an image (JPEG, PNG, or GIF).');
      return;
    }
console.log(data.info)
    const formData = new FormData();
    formData.append("info", data.info);
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectID}/stages/${stageName}/upload_image/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Image uploaded successfully");
        dispatch(toggleUploadImageModal(false));
        // You might want to add a function to refresh the project images here
        // fetchProjectImages();
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <Modal
      title="Upload Image"
      labelclassName="btn-outline-dark"
      activeModal={openUploadImageModal}
      onClose={() => dispatch(toggleUploadImageModal(false))}
    >
      <form onSubmit={handleSubmit(handleImageUpload)} className="space-y-4">
        <label className="block capitalize form-label font-semibold flex-0 mr-6 md:w-[100px] w-[60px] font-sans break-words">
          City Image
        </label>
        <section className="container w-full mb-4">
          <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
        </section>
        
        <Textarea
          label="Description"
          placeholder="Enter image description"
          register={register("info", {
            required: "information Image is required",
          })}
          error={errors.info?.message}
        />
        <div className="flex justify-end">
          <button type="submit" className="w-full btn btn-dark">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadImages;