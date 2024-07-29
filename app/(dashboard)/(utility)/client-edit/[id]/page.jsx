"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import useDarkMode from "@/hooks/useDarkMode";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import Repeater from "@/components/partials/froms/Repeater";
import { Building2, Phone, Mail, MapPin, Users } from "lucide-react";

const CompanyUpdatePage = ({ params: { id } }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDark] = useDarkMode();
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyDetails = async (companyId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${companyId}/`
        );
        if (response.status === 200) {
          const companyData = response.data;
          setSelectedFile(companyData.CompanyImage);
          console.log(companyData.CompanyImage);

          methods.reset(companyData);
        } else {
          console.error("Failed to fetch company details:", response.data);
          showToast("Failed to fetch company details", "error");
        }
      } catch (error) {
        console.error("Error fetching company details:", error.message);
        showToast("Error fetching company details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails(id);
    }
  }, [id, methods]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      methods.setValue("CompanyImage", file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== "CompanyImage" && key !== "members") {
          formData.append(key, data[key]);
        }
      });
      if (data.CompanyImage instanceof File) {
        formData.append('CompanyImage', data.CompanyImage);
      } else if (typeof data.CompanyImage === 'string' && data.CompanyImage !== selectedFile) {
        formData.append('CompanyImage', data.CompanyImage);
      }
  
      // Append members data as JSON string
      formData.append('members', JSON.stringify(data.members));
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        showToast("Client updated successfully", "success");
        setTimeout(() => {
          router.push('/clients');
        }, 1500);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("There was an error updating the company!", error);
      showToast("Failed to update client: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: type === "success" ? 1500 : 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  if (loading) {
    return <LoadingSpinner isDark={isDark} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <ToastContainer />
      <Card title="Update Client Profile" className="w-full">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <CompanyDetailsSection methods={methods} selectedFile={selectedFile} handleFileChange={handleFileChange} />
            <ContactDetailsSection methods={methods} />
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Users className="mr-2" /> Company Members
              </h3>
              <Repeater />
            </div>
            <div className="flex justify-end mt-8">
              <Button className="btn-primary" type="submit">
                Update Client Profile
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

const LoadingSpinner = ({ isDark }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-50">
    <div className="text-center">
      <div className="mb-4">
        <img
          src={isDark ? "/assets/images/logo.png" : "/assets/images/logo.png"}
          alt="Logo"
          className="h-20 w-auto mx-auto"
        />
      </div>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

const CompanyDetailsSection = ({ methods, selectedFile, handleFileChange }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
      <Building2 className="mr-2" /> Company Details
    </h3>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full md:col-span-2 lg:col-span-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company Logo
        </label>
       
        <Fileinput
          name="CompanyImage"
          selectedFile={selectedFile}
          onChange={handleFileChange}
          className="w-full"
        />
         {methods.getValues("CompanyImage") && (
          <img
            src={methods.getValues("CompanyImage")}
            alt="Company Logo"
            className="mt-4 w-20"
          />
        )}
      </div>
      <div>
        <Textinput
          label="Company Name"
          type="text"
          placeholder="Enter company name"
          register={methods.register("CompanyName", {
            required: "Company name is required",
          })}
          error={methods.formState.errors.CompanyName}
          className="w-full"
        />
      </div>
      <div>
        <Textinput
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          register={methods.register("CompanyPhoneNumber", {
            required: "Phone number is required",
          })}
          error={methods.formState.errors.CompanyPhoneNumber}
          className="w-full"
          icon={<Phone className="h-5 w-5 text-gray-400" />}
        />
      </div>
    </div>
  </div>
);

const ContactDetailsSection = ({ methods }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
      <Mail className="mr-2" /> Contact Information
    </h3>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <Textinput
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          register={methods.register("CompanyEmail", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          error={methods.formState.errors.CompanyEmail}
          className="w-full"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        />
      </div>
      <div>
        <Textinput
          label="Physical Address"
          type="text"
          placeholder="Enter physical address"
          register={methods.register("CompanyAddress", {
            required: "Address is required",
          })}
          error={methods.formState.errors.CompanyAddress}
          className="w-full"
          icon={<MapPin className="h-5 w-5 text-gray-400" />}
        />
      </div>
    </div>
  </div>
);

export default CompanyUpdatePage;