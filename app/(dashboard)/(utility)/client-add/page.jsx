"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import useDarkMode from "@/hooks/useDarkMode";
import { Building2, Phone, Mail, MapPin, Users, Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import Repeater from "@/components/partials/froms/Repeater";
import PageHeader from "./PageHeader";

const InvoiceAddPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDark] = useDarkMode();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      CompanyName: "",
      CompanyPhoneNumber: "",
      CompanyEmail: "",
      CompanyAddress: "",
      members: []
    }
  });

  // File handling functions
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be less than 5MB");
        return;
      }
      setSelectedFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Form submission functions
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
        toast.success("Client created successfully");
        router.push('/clients');
      }
    } catch (error) {
      toast.error(error.message || "Error creating company");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
     < PageHeader title={"Create New Client Profile"}  subTitle={"Fill in the company details and add team members."} />
      <div className="w-full px-4">
       
        
        <div className="bg-gray-  00 dark:bg-gray-800 shadow-md  dark:border-gray-700">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Company Logo Section */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Company Logo</h2>
                </div>
                
                <div className="w-full p-6 bg-gray-50 dark:bg-gray-700 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
                  {filePreview ? (
                    <div className="text-center">
                      <img
                        src={filePreview}
                        alt="Company logo preview"
                        className="mx-auto h-32 w-32 rounded-lg object-cover mb-4 border border-gray-200 dark:border-gray-600"
                      />
                      <Button
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                        type="button"
                        className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500"
                      >
                        Change Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Fileinput
                        name="companyLogo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full"
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Upload PNG or JPG (max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information Section */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Company Information</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Textinput
                    label="Company Name"
                    type="text"
                    placeholder="Enter company name"
                    register={methods.register("CompanyName", {
                      required: "Company name is required"
                    })}
                    error={methods.formState.errors.CompanyName}
                    className="w-full"
                  />

                  <Textinput
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    register={methods.register("CompanyPhoneNumber", {
                      required: "Phone number is required"
                    })}
                    error={methods.formState.errors.CompanyPhoneNumber}
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    className="w-full"
                  />

                  <Textinput
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    register={methods.register("CompanyEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    error={methods.formState.errors.CompanyEmail}
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    className="w-full"
                  />

                  <Textinput
                    label="Company Address"
                    type="text"
                    placeholder="Enter physical address"
                    register={methods.register("CompanyAddress", {
                      required: "Address is required"
                    })}
                    error={methods.formState.errors.CompanyAddress}
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Team Members Section */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Team Members</h2>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <Repeater />
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={() => router.push('/clients')}
                    disabled={loading}
                    className="px-6 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500"
                  >
                    Cancel
                  </Button>
                  <Button
  type="submit"
  disabled={loading}
  className="px-6 py-2 bg-[#0b77b7] hover:bg-blue-600 text-white"
>
  {loading ? (
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      <span>Creating...</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Plus className="h-5 w-5" />
      <span>Create Profile</span>
    </div>
  )}
</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
              <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Creating client profile...</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceAddPage;