import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";

const Repeater = () => {
  const [email, setEmail] = useState("");

  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 12;
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    return newPassword;
  };
  const generateEmail = (input) => {
    const email = `@genius.com`
  return email;
   
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 -mx-6 px-6 py-6">
      <div className="mb-6 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase">
        Informations des Membres
      </div>
      <div>
        {fields.map((item, index) => (
          <div
            className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-5 mb-5 last:mb-0"
            key={item.id}
          >
            <Textinput
              label="Nom et prenom"
              type="text"
              placeholder="Nom et prenom"
              register={register(`members[${index}].MemberFullName`)}
            
            />
            <Textinput
              label="Numéro de téléphone (Champ texte)"
              type="text"
              placeholder="Numéro de téléphone"
              register={register(`members[${index}].MemberPhone`)}
            />
            <Textinput
              label="Role"
              type="text"
              placeholder="Role"
              register={register(`members[${index}].MemberRole`)}
            />
            <Textinput
              label="Email"
              type="email"
              placeholder="Email"
              defaultValue={generateEmail('de')}
              register={register(`members[${index}].MemberEmail`)}
            />
            <Textinput
              label="Password"
              type="text"
              placeholder="Password"
              defaultValue={generatePassword()}
              register={register(`members[${index}].MemberPassword`)}
            />
            {index > 0 && (
              <div className="flex-none relative">
                <button
                  onClick={() => remove(index)}
                  type="button"
                  className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                >
                  <Icon icon="heroicons-outline:trash" />
                </button>
              </div>
            )}
            {index >= 0 && (
              <>
                <br /><br />
                <center></center>   <hr className="h-5 text center m-2" />
              </>
            )}
          </div>
        ))}
        <div className="mt-4">
          <Button
            text="Add new"
            icon="heroicons-outline:plus"
            className="text-slate-600 p-0 dark:text-slate-300"
            onClick={() => {
              append({
                MemberFullName: "",
                MemberPhone: "",
                MemberRole: "",
                MemberEmail: "",
                MemberPassword: generatePassword(),
              })
              ,generateEmail(email)
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Repeater;
