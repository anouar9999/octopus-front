"use client";
import React, { useState } from "react";
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

const InvoiceAddPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDark] = useDarkMode();
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const createFormData = (data, file) => {
    const formData = new FormData();
    formData.append("CompanyImage", file);
  
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "members") {
        formData.append(key, value);
      }
    });
  
    formData.append("members", JSON.stringify(data.members));
    return formData;
  };

  const createCompany = async (formData) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/companies/create/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  };

  const registerMembers = async (members) => {
    const registerPromises = members.map(async (member) => {
      const username = member.MemberFullName.replace(/\s+/g, "-");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        username,
        email: member.MemberEmail,
        fullname: member.MemberFullName,
        phone: member.MemberPhone,
        role: member.MemberRole,
        password: member.MemberPassword,
      });
    });
    await Promise.all(registerPromises);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = createFormData(data, selectedFile);
      const companyResponse = await createCompany(formData);

      if (companyResponse.status === 201) {
        await registerMembers(data.members);
        showToast("Client created successfully", "success");
        router.push('/clients');
        methods.reset();
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      showToast(error.message || "There was an error creating the company", "error");
      console.error("Error details:", error);
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
      <Card title="Create Client Profile (Company)" className="w-full">
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
                Create Client Profile
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
          name="basic"
          selectedFile={selectedFile}
          onChange={handleFileChange}
          className="w-full"
        />
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

export default InvoiceAddPage;