"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Repeater from "@/components/partials/froms/Repeater";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import useDarkMode from "@/hooks/useDarkMode";

const InvoiceAddPage = () => {


  const [picker, setPicker] = useState(new Date());
  const [isDark] = useDarkMode();
  const { register, handleSubmit,reset ,formState: { errors } } = useForm();
  const methods = useForm();
const [Loading, setLoading] = useState(false);

   const onSubmit = async (data) => {
    setLoading(true)
    console.log(data);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/companies/', data); // Ensure the URL matches your Django endpoint
      console.log(response.data);
      setLoading(false)
      reset();

    } catch (error) {
      console.error('There was an error creating the company!', error);
    }
  };
  return (
 <div>
    {
    Loading?  <div className="flex flex-col items-center justify-center app_height">
    <div className="mb-3">
      <img
        src={
          isDark
            ? "/assets/images/logo/logo-white.svg"
            : "/assets/images/logo/logo.svg"
        }
        alt="Logo"
      />
    </div>

    <svg
      className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 
         h-12 w-12
       "
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    hhhhhhhhhh
  </div>  : 
     <div>
    <Card title="Formulaire de Création de Profil Client (Société)">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <div className="lg:col-span-2 col-span-1">
                <Textinput
                  label="Nom de la société (Champ texte)"
                  type="text"
                  placeholder="Nom de la société"
                  register={methods.register("CompanyName", { required: "Company name is required" })}
                  error={methods.formState.errors.CompanyName}
                />
              </div>

              <div className="lg:col-span-2 col-span-1">
                <Textinput
                  label="Numéro de téléphone (Champ texte)"
                  type="phone"
                  placeholder="Numéro de téléphone"
                  register={methods.register("CompanyPhoneNumber", { required: "Phone number is required" })}
                  error={methods.formState.errors.CompanyPhoneNumber}
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <div className="lg:col-span-2 col-span-1">
                <Textinput
                  label="Adresse e-mail de contact (Champ e-mail)"
                  type="email"
                  placeholder="Add your email"
                  register={methods.register("CompanyEmail", { 
                    required: "Email is required",
                    pattern: { 
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })}
                  error={methods.formState.errors.CompanyEmail}
                />
              </div>

              <div className="lg:col-span-2 col-span-1">
                <Textinput
                  label="Adresse physique (Champ texte)"
                  type="text"
                  placeholder="Adresse physique"
                  register={methods.register("CompanyAddress", { required: "Address is required" })}
                  error={methods.formState.errors.CompanyAddress}
                />
              </div>
            </div>
          </div>
          <div className="my-6">
            <Repeater />
          </div>

          <div className="ltr:text-center rtl:text-center space-x-3 rtl:space-x-reverse">
            <Button text="Create Client Profile" className="btn-dark" type="submit" />
          </div>
        </form>
      </FormProvider>
    </Card>
    </div> 
  }
  </div>
  );
};

export default InvoiceAddPage;
