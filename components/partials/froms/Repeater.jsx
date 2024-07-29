import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { User, Phone, Briefcase, Mail, Lock, Plus, Trash2 } from "lucide-react";

const Repeater = () => {
  const { register, control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 12 }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  };

  const generateEmail = (input) => `${input.toLowerCase().replace(/\s+/g, '.')}@genius.com`;

  const updateEmail = (index, value) => {
    setValue(`members.${index}.MemberEmail`, generateEmail(value), { shouldValidate: true });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <User className="mr-2" /> Member Information
      </h3>
      <div className="space-y-6">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Textinput
                label="Full Name"
                type="text"
                placeholder="Enter full name"
                register={register(`members.${index}.MemberFullName`, {
                  onChange: (e) => updateEmail(index, e.target.value)
                })}
                icon={<User className="h-5 w-5 text-gray-400" />}
              />
              <Textinput
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                register={register(`members.${index}.MemberPhone`)}
                icon={<Phone className="h-5 w-5 text-gray-400" />}
              />
              <Textinput
                label="Role"
                type="text"
                placeholder="Enter role"
                register={register(`members.${index}.MemberRole`)}
                icon={<Briefcase className="h-5 w-5 text-gray-400" />}
              />
              <Textinput
                label="Email"
                type="email"
                placeholder="Enter email"
                register={register(`members.${index}.MemberEmail`)}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />
              <Textinput
                label="Password"
                type="text"
                placeholder="Enter password"
                register={register(`members.${index}.MemberPassword`)}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />
              {index > 0 && (
                <div className="flex items-end">
                  <Button
                    onClick={() => remove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    icon="trash-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <Button
            text="Add New Member"
            icon="plus"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
            onClick={() => {
              const newMemberName = `New Member ${fields.length + 1}`;
              append({
                MemberFullName: newMemberName,
                MemberPhone: "",
                MemberRole: "",
                MemberEmail: generateEmail(newMemberName),
                MemberPassword: generatePassword(),
              });
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Repeater;