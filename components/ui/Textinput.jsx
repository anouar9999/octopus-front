import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";

const Textinput = ({
  type,
  label,
  placeholder = "Add placeholder",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  readonly,
  error,
  disabled,
  id,
  horizontal,
  validate,
  isMask,
  msgTooltip,
  description,
  hasicon,
  onChange,
  options,
  onFocus,
  defaultValue,
  onBlur,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`fromGroup  ${error ? "has-error" : ""}  ${
        horizontal ? "flex" : ""
      }  ${validate ? "is-valid" : ""} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize font-sans ${classLabel}  ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] font-sans break-words" : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        <input
          type={type === "password" && open === true ? "text" : type}
          className={`${
            error ? " has-error" : " "
          } form-control py-2 ${className}  `}
          placeholder={placeholder}
          readOnly={readonly}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          id={id}
          {...register}
          {...rest}
        />
        {error && (
          <div
            className={`mt-2 ${
              msgTooltip
                ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded font-sans"
                : "text-danger-500 block text-sm"
            }`}
          >
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Textinput;
