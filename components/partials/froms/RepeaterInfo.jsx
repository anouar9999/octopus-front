import React from "react";
import { useFieldArray } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";

const RepeaterInfo = ({ register }) => {
  const { fields, append, remove } = useFieldArray({
    name: "emails",
  });

  const generateEmail = (input) => {
    const email = `${input}@genius.com`;
    return email;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 -mx-6 px-6 py-6">
      <div className="mb-6 text-slate-600 dark:text-slate-300 text-xs font-medium uppercase">
        Email Addresses
      </div>
      <div>
        {fields.map((item, index) => (
          <div className="flex items-center gap-2 mb-2" key={item.id}>
            <Textinput
              label={`Email ${index + 1}`}
              type="email"
              placeholder="Email"
              {...register(`emails[${index}]`)}
            />
            {index > 0 && (
              <button
                onClick={() => remove(index)}
                type="button"
                className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
              >
                <Icon icon="heroicons-outline:trash" />
              </button>
            )}
          </div>
        ))}
        <div className="mt-4">
          <Button
            text="Add New Email"
            icon="heroicons-outline:plus"
            className="text-slate-600 p-0 dark:text-slate-300"
            onClick={() => {
              append(generateEmail("newEmail"));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RepeaterInfo;
